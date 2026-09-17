import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(root, path), "utf8"));

const tieba = readJson("data/tieba-slot-records.json");
const candidates = readJson("resource_netmusic/description-candidates.json");
const metadata = readJson("resource_netmusic/netease-metadata.json");
const previews = existsSync(resolve(root, "data/apple-previews.json")) ? readJson("data/apple-previews.json") : { entries: {} };

// 课次 → 记录 id 后缀。已上线的 2013-12 等月份沿用旧 id，避免本机回忆记录失联。
const PERIOD_SLUG = {
  "早起": "early",
  "第一节": "01", "第二节": "02", "第三节": "03", "第四节": "04", "第五节": "05",
  "第六节": "06", "第七节": "07", "第八节": "08", "第八、九节": "08-09", "第九节": "09",
  "第十节": "10", "第十一节": "11",
  "晚自习第一节": "night-01", "晚自习第二节": "night-02", "晚自习第三节": "night-03",
  "就寝": "sleep"
};
// 猜题库提供的课次选项，必须与 dist/app.js 的 periodGroups 一一对应。
// 按学校作息：上午五节但第二节是大课间、从来不放铃，所以「第二节」不是选项；
// 下午第六节起共四节，「第八、九节」是连堂合放；晚上两节即第十、十一节。
const QUIZ_PERIODS = new Set([
  "早起",
  "第一节", "第三节", "第四节", "第五节",
  "第六节", "第七节", "第八节", "第八、九节", "第九节",
  "第十节", "第十一节",
  "晚自习第一节", "晚自习第二节",
  "就寝"
]);
// 课次少于 4 条时无法构成一份完整歌单，先只进档案。
const MIN_RECORDS_FOR_QUIZ = 4;

const normalize = (value) => String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
// 歌名在贴吧与简介里常出现缩写或单复数差异（Nothin' on You / Nothing On You），
// 用二元组相似度兜底判断是否为同一首。
function similarity(left, right) {
  if (!left || !right) return 0;
  if (left === right) return 1;
  const pairs = (value) => {
    const set = new Set();
    for (let index = 0; index < value.length - 1; index += 1) set.add(value.slice(index, index + 2));
    return set;
  };
  const a = pairs(left);
  const b = pairs(right);
  let shared = 0;
  for (const item of a) if (b.has(item)) shared += 1;
  return (2 * shared) / (a.size + b.size);
}
const previewKey = (month, title) => `${month}|${normalize(title)}`;

// 歌单简介里的明显笔误：按通行写法收录（否则 Apple 匹配和站内搜索都找不到），
// 并在 note 里保留原始写法，避免看起来像本站抄错。
// 键统一走 normalize，写原句即可（脚本会去掉空格与标点）。
const TITLE_FIXES = {
  "I Took A Pill In Abiza (SeeB Remix)": {
    title: "I Took A Pill In Ibiza (SeeB Remix)",
    note: "原歌单简介把 Ibiza 写作 Abiza"
  }
};
const titleFixMap = new Map(Object.entries(TITLE_FIXES).map(([key, value]) => [normalize(key), value]));

const monthlyPlaylists = new Map(metadata.playlists.filter((item) => item.kind === "month").map((item) => [item.key, item]));
const tiebaByMonth = new Map(tieba.months.map((item) => [item.month, item]));

const candidatesByMonth = new Map();
for (const item of candidates.candidates) {
  candidatesByMonth.set(item.month, [...(candidatesByMonth.get(item.month) || []), item]);
}

// 贴吧原帖与网易云简介同时覆盖的月份，逐条比对，作为「已交叉校对」的依据。
// 歌名写法差异（缩写、单复数）不算冲突，课次写法冲突才算。
function crossCheck(month) {
  const tiebaMonth = tiebaByMonth.get(month);
  const descs = candidatesByMonth.get(month) || [];
  const empty = { checked: false, matched: 0, total: tiebaMonth ? tiebaMonth.records.length : 0, mismatch: [], titleVariants: [] };
  if (!tiebaMonth || !descs.length) return empty;
  const used = new Set();
  const mismatch = [];
  const titleVariants = [];
  let matched = 0;
  for (const record of tiebaMonth.records) {
    const key = normalize(record.title);
    let index = descs.findIndex((item, position) => !used.has(position) && normalize(item.title) === key);
    let variant = false;
    if (index === -1) {
      index = descs.findIndex((item, position) => {
        if (used.has(position)) return false;
        const other = normalize(item.title);
        return other.includes(key) || key.includes(other) || similarity(key, other) >= 0.8;
      });
      variant = index !== -1;
    }
    if (index === -1) {
      mismatch.push({ title: record.title, reason: "简介中未找到同名曲目" });
      continue;
    }
    used.add(index);
    matched += 1;
    if (variant) titleVariants.push({ title: record.title, descriptionTitle: descs[index].title });
    if (descs[index].period !== record.period) mismatch.push({ title: record.title, reason: `课次不一致：贴吧 ${record.period} / 简介 ${descs[index].periodLabel}` });
  }
  return { checked: true, matched, total: tiebaMonth.records.length, mismatch, titleVariants };
}

const months = [...new Set([...tiebaByMonth.keys(), ...candidatesByMonth.keys(), ...monthlyPlaylists.keys()])].sort();
const output = {};
const reviewRows = [];

for (const month of months) {
  const playlist = monthlyPlaylists.get(month) || null;
  const tiebaMonth = tiebaByMonth.get(month) || null;
  const descs = candidatesByMonth.get(month) || [];
  const check = crossCheck(month);

  let source;
  if (tiebaMonth) source = "贴吧原帖正文";
  else if (descs.length) source = "网易云歌单简介";
  else source = null;

  const confidence = tiebaMonth ? tiebaMonth.confidence : descs.length ? "C" : null;
  const confidenceLabel = {
    A: "原帖明确",
    B: "原帖明确·课次为分段编号还原",
    C: "网易云歌单简介·待校友确认"
  }[confidence] || "仅有歌单曲目";

  const records = [];
  const seenTitles = new Set();
  const tiebaSource = tiebaMonth?.source || null;
  const addRecord = (record) => {
    const slug = PERIOD_SLUG[record.period] || normalize(record.period);
    const id = `${month}-${slug}`;
    if (records.some((item) => item.id === id)) return;
    const fix = titleFixMap.get(normalize(record.title));
    const title = fix ? fix.title : record.title;
    const note = [record.note, fix?.note].filter(Boolean).join("；");
    const preview = previews.entries[previewKey(month, title)] || previews.entries[previewKey(month, record.title)] || null;
    records.push({
      id,
      month,
      period: record.period,
      title,
      artist: record.artist,
      playStatus: record.playStatus || "played",
      note,
      audio: preview?.previewUrl || "",
      appleUrl: preview?.trackViewUrl || "",
      matchedOnApple: preview?.matched ?? null,
      sourceRef: tiebaSource
        ? {
          kind: "贴吧原帖",
          url: tiebaSource.thread ? `${tiebaSource.thread}?pn=1` : "",
          floor: tiebaSource.floor ?? null,
          postedAt: tiebaSource.postedAt || ""
        }
        : record.sourceRef || null
    });
    seenTitles.add(normalize(record.title));
    seenTitles.add(normalize(title));
  };

  if (tiebaMonth) {
    tiebaMonth.records.forEach(addRecord);
  } else {
    descs.forEach((item) => addRecord({
      period: item.period,
      title: item.title,
      artist: item.artist,
      playStatus: "played",
      note: item.note,
      sourceRef: {
        kind: "网易云歌单简介",
        url: item.source?.playlistUrl || playlist?.url || ""
      }
    }));
  }

  // 有课次的月份里，网易云当前曲目中没被任何课次记录覆盖的歌曲单独列出。
  const unconfirmedTracks = (playlist?.tracks || [])
    .filter((track) => !seenTitles.has(normalize(track.title)))
    .map((track) => ({
      order: track.order,
      title: track.title,
      artist: (track.artists || []).join(" & "),
      neteaseUrl: `https://music.163.com/#/song?id=${track.id}`
    }));

  const monthQuizEligible = Boolean(source) && records.length >= MIN_RECORDS_FOR_QUIZ && tiebaMonth?.quizEligible !== false;
  records.forEach((record) => {
    record.quizEligible = monthQuizEligible && QUIZ_PERIODS.has(record.period) && record.playStatus === "played";
  });

  output[month] = {
    month,
    source,
    confidence,
    confidenceLabel,
    verified: check.checked && check.mismatch.length === 0,
    crossCheck: check.checked ? { matched: check.matched, total: check.total, mismatch: check.mismatch, titleVariants: check.titleVariants } : null,
    sourceDetail: tiebaSource
      ? {
        kind: "贴吧原帖",
        url: tiebaSource.thread ? `${tiebaSource.thread}?pn=1` : "",
        threadTitle: tiebaSource.threadTitle || "",
        floor: tiebaSource.floor ?? null,
        postedAt: tiebaSource.postedAt || "",
        raw: tiebaSource.raw || "",
        openQuestion: tiebaMonth.openQuestion || ""
      }
      : descs.length
        ? { kind: "网易云歌单简介", url: playlist?.url || "", raw: descs[0]?.source?.descriptionRaw || "" }
        : null,
    playlist: playlist && {
      id: playlist.id,
      name: playlist.name,
      url: playlist.url,
      currentTrackCount: playlist.currentTrackCount,
      description: (playlist.description || "").trim() || null
    },
    records,
    unconfirmedTracks
  };

  reviewRows.push({
    month,
    source: source || "仅歌单链接",
    confidence,
    records: records.length,
    quiz: records.filter((record) => record.quizEligible).length,
    audio: records.filter((record) => record.audio).length,
    unconfirmed: unconfirmedTracks.length
  });
}

const allRecords = Object.values(output).flatMap((item) => item.records);
const stats = {
  months: months.length,
  monthsWithRecords: Object.values(output).filter((item) => item.records.length).length,
  monthsWithSlotSource: Object.values(output).filter((item) => item.source).length,
  records: allRecords.length,
  quizRecords: allRecords.filter((record) => record.quizEligible).length,
  recordsWithAudio: allRecords.filter((record) => record.audio).length,
  unconfirmedTracks: Object.values(output).reduce((sum, item) => sum + item.unconfirmedTracks.length, 0),
  verifiedMonths: Object.values(output).filter((item) => item.verified).length
};

const catalog = {
  generatedAt: new Date().toISOString(),
  schemaVersion: 1,
  rules: {
    quizPool: "课次来源明确、当月记录不少于 4 条、且该课次在猜题库选项中存在，才进入猜题池；30 秒预览缺失时不参与播放题。",
    unconfirmedTracks: "网易云歌单当前曲目中没有课次线索的部分，只在档案页展示。"
  },
  stats,
  months: output
};

writeFileSync(resolve(root, "dist/catalog.js"), `// 由 scripts/build-site-catalog.mjs 生成，请勿手改。\nwindow.BELL_CATALOG = ${JSON.stringify(catalog, null, 2)};\n`);
writeFileSync(resolve(root, "data/catalog-records.json"), `${JSON.stringify({ generatedAt: catalog.generatedAt, stats, months: output }, null, 2)}\n`);

const header = "| 月份 | 课次来源 | 可信度 | 课次记录 | 可猜题 | 有预览 | 曲目待确认 |";
const rows = reviewRows.map((item) => `| ${item.month} | ${item.source} | ${item.confidence || "—"} | ${item.records} | ${item.quiz} | ${item.audio} | ${item.unconfirmed} |`).join("\n");
const mismatch = Object.values(output)
  .filter((item) => item.crossCheck?.mismatch.length)
  .map((item) => item.crossCheck.mismatch.map((entry) => `- ${item.month}｜${entry.title}：${entry.reason}`).join("\n"))
  .join("\n");
const variants = Object.values(output)
  .filter((item) => item.crossCheck?.titleVariants.length)
  .map((item) => item.crossCheck.titleVariants.map((entry) => `- ${item.month}｜贴吧「${entry.title}」/ 简介「${entry.descriptionTitle}」`).join("\n"))
  .join("\n");
writeFileSync(resolve(root, "data/catalog-review.md"), `# 曲库生成复核表

生成时间：${catalog.generatedAt}

- 覆盖月份：${stats.months}
- 有课次记录的月份：${stats.monthsWithSlotSource}
- 课次记录：${stats.records}（其中可猜题 ${stats.quizRecords}，带 Apple 预览 ${stats.recordsWithAudio}）
- 贴吧与简介交叉一致、课次无冲突的月份：${stats.verifiedMonths}
- 仅网易云曲目、待确认课次：${stats.unconfirmedTracks}

${header}
|---|---|---|---:|---:|---:|---:|
${rows}

## 贴吧与网易云简介的课次冲突

${mismatch || "- 无"}

## 歌名写法差异（不影响课次判定）

${variants || "- 无"}
`);
console.log(`已生成 ${stats.months} 个月曲库：课次记录 ${stats.records} 条（可猜题 ${stats.quizRecords}），待确认曲目 ${stats.unconfirmedTracks} 条`);
