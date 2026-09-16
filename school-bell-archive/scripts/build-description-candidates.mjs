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
  "晚第一节": "晚自习第一节", "晚第二节": "晚自习第二节", "晚睡觉": "就寝", "就寝": "就寝"
};

const candidates = [];
for (const [month, item] of Object.entries(merged.months)) {
  const entries = item.playlist?.descriptionEntries || [];
  entries.forEach((entry, index) => candidates.push({
    id: `netease-description-${month}-${String(index + 1).padStart(2, "0")}`,
    month,
    period: periodMap[entry.periodLabel] || periodMap[entry.periodLabel.replace(/下课/g, "")] || null,
    periodLabel: entry.periodLabel,
    title: entry.title,
    artist: entry.artist,
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
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  source: "resource_netmusic/merged-catalog.json",
  rules: {
    candidate: "歌单简介明确写出时段，但尚未与贴吧、截图或校友记忆交叉确认",
    promoted: "只有经过人工审核或投票达到门槛后，才进入正式猜歌题库"
  },
  stats: {
    candidates: candidates.length,
    withCanonicalPeriod: candidates.filter((item) => item.period).length,
    months: new Set(candidates.map((item) => item.month)).size
  },
  candidates
};

writeFileSync(resolve(root, "resource_netmusic/description-candidates.json"), `${JSON.stringify(output, null, 2)}\n`);
const rows = candidates.map((item) => `| ${item.month} | ${item.period || item.periodLabel} | ${item.title} | ${item.artist} | 待确认 |`).join("\n");
writeFileSync(resolve(root, "resource_netmusic/description-candidates.md"), `# 网易云简介课次候选\n\n生成时间：${output.generatedAt}\n\n共 ${output.stats.candidates} 条，覆盖 ${output.stats.months} 个月；其中 ${output.stats.withCanonicalPeriod} 条已能映射到标准课次名称。它们不是正式结论，等待校友投票或其他来源确认。\n\n| 月份 | 课次 | 歌曲 | 歌手 | 状态 |\n|---|---|---|---|---|\n${rows}\n`);
console.log(`已生成 ${candidates.length} 条网易云简介候选记录`);
