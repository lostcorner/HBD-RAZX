import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const merged = JSON.parse(readFileSync(resolve(root, "resource_netmusic/merged-catalog.json"), "utf8"));

const periodMap = {
  "早起": "早起", "早起床": "早起", "早五": "早五", "早三": "早三",
  "第一节": "第一节", "第二节": "第二节", "第三节": "第三节", "第四节": "第四节",
  "第五节": "第五节", "第六节": "第六节", "第七节": "第七节", "第八节": "第八节",
  "第八、九节": "第八、九节", "第九节": "第九节", "第十节": "第十节", "第十一节": "第十一节",
  "晚第一节": "晚自习第一节", "晚第二节": "晚自习第二节", "晚第三节": "晚自习第三节",
  "晚睡觉": "就寝", "就寝": "就寝"
};

const PERIOD_LABEL = String.raw`早\s*起床?|早起|早五|早三|第一节(?:下课)?|第二节(?:下课)?|第三节(?:下课)?|第四节(?:下课)?|第五节(?:下课)?|第六节(?:下课)?|第七节(?:下课)?|第八节(?:下课)?|第八、九节(?:下课)?|第九节(?:下课)?|第十节(?:下课)?|第十一节(?:下课)?|晚\s*第一节(?:下课)?|晚\s*第二节(?:下课)?|晚\s*第三节(?:下课)?|晚\s*睡觉|就寝`;
// 分隔符在不同年份的简介里写法不同：既用「-」，也用「——」，还可能带方括号补充说明。
const LINE_PATTERN = new RegExp(`^(${PERIOD_LABEL})\\s*[:：]?\\s*(.*?)\\s*(?:-{1,2}|—{1,2})\\s*(.+)$`);

// 括号补充、改歌说明等都属于备注，不是歌名或歌手的一部分。
function splitAnnotation(value) {
  const notes = [];
  let clean = String(value || "").trim();
  clean = clean.replace(/[（(]([^()（）]*[\u4e00-\u9fff][^()（）]*)[)）]/g, (_match, inner) => {
    notes.push(inner.trim());
    return " ";
  });
  clean = clean.replace(/[\s，,;；]*[后後](?:改|换)(?:成|上)?\s*.*$/u, (match) => {
    notes.push(match.trim().replace(/^[，,;；\s]*/, ""));
    return "";
  });
  clean = clean.replace(/[\s，,;；]*网易云?(?:暂时?|暫)?(?:缺|无资源)\s*.*$/u, (match) => {
    notes.push(match.trim().replace(/^[，,;；\s]*/, ""));
    return "";
  });
  clean = clean
    .replace(/⩓y Grammer/g, "& Andy Grammer")
    .replace(/^[\s\-—–:：]+|[\s\-—–:：]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return { clean, note: notes.filter(Boolean).join("；") };
}

function parseDescription(description) {
  const entries = [];
  for (const raw of String(description || "").split(/\r?\n/).map((value) => value.trim()).filter(Boolean)) {
    const match = raw.match(LINE_PATTERN);
    if (!match) continue;
    const periodLabel = match[1].replace(/\s+/g, "");
    entries.push({
      periodLabel,
      period: periodMap[periodLabel] || periodMap[periodLabel.replace(/下课/g, "")] || null,
      left: match[2].trim(),
      right: match[3].trim(),
      raw
    });
  }
  return entries;
}

const normalize = (value) => String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");

// 2013 年的简介写成「歌手 - 歌名」，2014 年以后写成「歌名 - 歌手」。
// 先用当月网易云曲目判断哪一列能对上歌名／歌手；两边都判断不出来时，
// 按当月多数条目的写法决定，避免个别歌曲因不在当前曲目里而被颠倒。
function fieldOrderScore(entry, tracks) {
  const matchesTitle = (value) => tracks.some((track) => normalize(track.title) === normalize(value));
  const matchesArtist = (value) => tracks.some((track) => (track.artists || []).some((artist) => normalize(artist) === normalize(value)));
  return {
    forward: (matchesTitle(entry.left) ? 1 : 0) + (matchesArtist(entry.right) ? 1 : 0),
    reversed: (matchesTitle(entry.right) ? 1 : 0) + (matchesArtist(entry.left) ? 1 : 0)
  };
}

// 返回 true 表示简介是「歌手 - 歌名」写法，需要把左右两列互换。
function detectArtistFirst(parsed, tracks) {
  let forward = 0;
  let reversed = 0;
  for (const entry of parsed) {
    const score = fieldOrderScore(entry, tracks);
    if (score.reversed > score.forward) reversed += 1;
    else if (score.forward > score.reversed) forward += 1;
  }
  return reversed > forward;
}

// 2014 年前后的简介把上午／下午／晚自习各自从「第一节」重新编号。
// 同一课时名重复出现即可判定为分段编号，需要还原成全天连续课时。
function assignPeriods(entries) {
  const repeated = new Set();
  const seen = new Set();
  for (const entry of entries) {
    if (!entry.period) continue;
    if (seen.has(entry.period)) repeated.add(entry.period);
    seen.add(entry.period);
  }
  const restarted = repeated.size > 0;
  const blockShift = [
    { "第一节": "第一节", "第二节": "第二节", "第三节": "第三节", "第四节": "第四节", "第五节": "第五节" },
    { "第一节": "第六节", "第二节": "第七节", "第三节": "第八节", "第四节": "第九节" },
    { "第一节": "晚自习第一节", "第二节": "晚自习第二节", "第三节": "晚自习第三节" }
  ];
  let blockIndex = -1;
  let currentBlock = [];
  return entries.map((entry) => {
    if (restarted && entry.period === "第一节" && currentBlock.length) {
      blockIndex += 1;
      currentBlock = [];
    }
    currentBlock.push(entry.period);
    if (!restarted || blockIndex < 0) return { ...entry, block: null };
    const mapped = blockShift[blockIndex]?.[entry.period] || entry.period;
    return { ...entry, period: mapped, block: blockIndex, originalPeriodLabel: entry.periodLabel };
  });
}

const candidates = [];
const warnings = [];
for (const [month, item] of Object.entries(merged.months)) {
  const tracks = item.currentNeteaseTracks || [];
  const parsedRaw = assignPeriods(parseDescription(item.playlist?.description));
  const artistFirst = detectArtistFirst(parsedRaw, tracks);
  const parsed = parsedRaw.map((entry) => {
    const score = fieldOrderScore(entry, tracks);
    const swap = score.reversed > score.forward || (score.reversed === score.forward && artistFirst);
    const titleParts = splitAnnotation(swap ? entry.right : entry.left);
    const artistParts = splitAnnotation(swap ? entry.left : entry.right);
    return {
      ...entry,
      title: titleParts.clean,
      artist: artistParts.clean,
      note: [titleParts.note, artistParts.note, entry.note].filter(Boolean).join("；"),
      swappedFieldOrder: swap
    };
  });
  if (!parsed.length) continue;
  if (parsed.length < 4) {
    warnings.push({ month, reason: "简介解析出的曲目少于 4 条，可能是补充说明而非正式歌单", parsed: parsed.length });
    continue;
  }
  parsed.forEach((entry, index) => candidates.push({
    id: `netease-description-${month}-${String(index + 1).padStart(2, "0")}`,
    month,
    period: entry.period,
    periodLabel: entry.periodLabel,
    originalPeriodLabel: entry.originalPeriodLabel || null,
    sessionBlock: entry.block,
    title: entry.title,
    artist: entry.artist,
    note: entry.note || "",
    status: "candidate",
    confidence: "网易云简介",
    source: {
      playlistId: item.playlist.id,
      playlistUrl: item.playlist.url,
      descriptionRaw: entry.raw
    },
    review: { votes: [], note: "尚未经过校友确认" }
  }));
}

const output = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  source: "resource_netmusic/merged-catalog.json",
  rules: {
    candidate: "歌单简介明确写出时段，但尚未与贴吧、截图或校友记忆交叉确认",
    promoted: "与贴吧原帖交叉一致，或经人工审核／投票达到门槛后，才进入正式猜歌题库",
    sessionRestart: "同一课时名重复出现时，按上午／下午／晚自习分段编号还原为全天连续课时"
  },
  warnings,
  stats: {
    candidates: candidates.length,
    withCanonicalPeriod: candidates.filter((item) => item.period).length,
    months: new Set(candidates.map((item) => item.month)).size,
    restartMonths: [...new Set(candidates.filter((item) => item.sessionBlock !== null).map((item) => item.month))]
  },
  candidates
};

writeFileSync(resolve(root, "resource_netmusic/description-candidates.json"), `${JSON.stringify(output, null, 2)}\n`);
const rows = candidates.map((item) => `| ${item.month} | ${item.period || item.periodLabel} | ${item.title} | ${item.artist} | ${item.note || "待确认"} |`).join("\n");
const warningRows = warnings.map((item) => `- ${item.month}：${item.reason}`).join("\n") || "- 无";
writeFileSync(resolve(root, "resource_netmusic/description-candidates.md"), `# 网易云简介课次候选

生成时间：${output.generatedAt}

共 ${output.stats.candidates} 条，覆盖 ${output.stats.months} 个月；其中 ${output.stats.withCanonicalPeriod} 条已能映射到标准课次名称。它们不是正式结论，等待校友投票或其他来源确认。

分段编号还原的月份：${output.stats.restartMonths.join("、") || "无"}

## 被跳过的简介

${warningRows}

| 月份 | 课次 | 歌曲 | 歌手 | 备注 |
|---|---|---|---|---|
${rows}
`);
console.log(`已生成 ${candidates.length} 条网易云简介候选记录，覆盖 ${output.stats.months} 个月；跳过 ${warnings.length} 条非歌单简介`);
