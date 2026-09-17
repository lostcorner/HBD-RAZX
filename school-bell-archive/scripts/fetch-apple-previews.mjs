import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cachePath = resolve(root, "data/apple-previews.json");
const recordsPath = resolve(root, "data/catalog-records.json");

if (!existsSync(recordsPath)) {
  console.error("缺少 data/catalog-records.json，请先运行 scripts/build-site-catalog.mjs");
  process.exit(1);
}

const catalog = JSON.parse(readFileSync(recordsPath, "utf8"));
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : { generatedAt: null, entries: {} };
cache.entries ||= {};

const normalize = (value) => String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
const tokens = (value) => String(value || "").toLowerCase().split(/[^a-z0-9\u4e00-\u9fff]+/).filter((token) => token.length > 1);
const previewKey = (month, title) => `${month}|${normalize(title)}`;

// 歌手名在不同版本里写法多样，按词元命中的比例打分，避免选到翻唱或他人作品。
function scoreCandidate(record, candidate) {
  const recordTitle = normalize(record.title);
  const candidateTitle = normalize(candidate.trackName);
  let score = 0;
  if (recordTitle === candidateTitle) score += 4;
  else if (candidateTitle.startsWith(recordTitle) || recordTitle.startsWith(candidateTitle)) score += 3;
  else if (candidateTitle.includes(recordTitle)) score += 2;
  else return -1;

  const recordTokens = new Set(tokens(record.artist));
  const candidateTokens = new Set(tokens(candidate.artistName));
  let overlap = 0;
  for (const token of recordTokens) if (candidateTokens.has(token)) overlap += 1;
  score += Math.min(overlap, 2) * 2;

  // 记录本身不是 remix 版本时，优先原版。
  const wantsRemix = /remix|bootleg|version|mix\)/i.test(record.title);
  if (!wantsRemix && /remix|bootleg/i.test(candidate.trackName)) score -= 2;
  return score;
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

// iTunes 搜索接口对频率敏感：被限流时会返回 resultCount 0 而不是错误码，
// 因此空结果也要重试，并且必须拉开间隔，否则后半段会整段丢结果。
async function request(term, attempts = 5) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=10`;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.status === 429 || response.status >= 500) {
        await sleep(4000 * (attempt + 1));
        continue;
      }
      if (!response.ok) return null;
      const payload = await response.json();
      if (payload.resultCount > 0) return payload.results;
      if (attempt < attempts - 1) await sleep(5000 * (attempt + 1));
    } catch {
      await sleep(3000 * (attempt + 1));
    }
  }
  return null;
}

async function search(record) {
  const queries = [`${record.title} ${record.artist}`, record.title];
  for (const term of queries) {
    const results = await request(term);
    if (!results) continue;
    const ranked = results
      .filter((item) => item.previewUrl)
      .map((item) => ({ item, score: scoreCandidate(record, item) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);
    if (ranked[0]) return ranked[0].item;
    await sleep(1200);
  }
  return null;
}

const pending = [];
for (const month of Object.values(catalog.months)) {
  for (const record of month.records) {
    const key = previewKey(record.month, record.title);
    if (cache.entries[key]?.previewUrl) continue;
    if (pending.some((item) => previewKey(item.month, item.title) === key)) continue;
    pending.push(record);
  }
}

console.log(`需要抓取 ${pending.length} 首曲目的 Apple 预览（缓存已有 ${Object.keys(cache.entries).length} 条）`);
let done = 0;
let hit = 0;
for (const record of pending) {
  const match = await search(record);
  const key = previewKey(record.month, record.title);
  cache.entries[key] = match
    ? {
        previewUrl: match.previewUrl,
        trackViewUrl: match.trackViewUrl,
        trackName: match.trackName,
        artistName: match.artistName,
        collectionName: match.collectionName,
        matched: true
      }
    : { previewUrl: "", trackViewUrl: "", matched: false };
  if (match) hit += 1;
  done += 1;
  if (done % 20 === 0 || done === pending.length) {
    cache.generatedAt = new Date().toISOString();
    writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
    console.log(`进度 ${done}/${pending.length}，命中 ${hit}`);
  }
  await sleep(1500);
}
cache.generatedAt = new Date().toISOString();
writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
console.log(`完成：本次抓取 ${done} 首，命中预览 ${hit} 首`);
