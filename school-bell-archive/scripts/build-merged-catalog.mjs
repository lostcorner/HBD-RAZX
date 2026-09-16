import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = readFileSync(resolve(root, "dist/app.js"), "utf8").split("// 月度歌单")[0];
const sandbox = { window: {} };
vm.runInNewContext(`${app}; window.records = records;`, sandbox);
const tiebaRecords = sandbox.window.records;
const metadata = JSON.parse(readFileSync(resolve(root, "resource_netmusic/netease-metadata.json"), "utf8"));
const playlists = metadata.playlists;
const normalize = (value) => String(value || "").normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "");
const sameSong = (record, track) => normalize(record.title) === normalize(track.title);
function parseDescription(description) {
  const entries = [];
  for (const line of String(description || "").split(/\r?\n/).map((value) => value.trim()).filter(Boolean)) {
    const match = line.match(/^(早\s*起床?|早起|早五|早三|第一节(?:下课)?|第二节(?:下课)?|第三节(?:下课)?|第四节(?:下课)?|第五节(?:下课)?|第六节(?:下课)?|第七节(?:下课)?|第八节(?:下课)?|第八、九节(?:下课)?|第九节(?:下课)?|第十节(?:下课)?|第十一节(?:下课)?|晚\s*第一节(?:下课)?|晚\s*第二节(?:下课)?|晚\s*睡觉|就寝)\s*[:：]?\s*(.*?)\s*-\s*(.+)$/i);
    if (match) entries.push({ periodLabel: match[1].replace(/\s+/g, ""), title: match[2].trim(), artist: match[3].trim(), raw: line });
  }
  return entries;
}
const byMonth = (items) => items.reduce((map, item) => {
  const key = item.month || item.key;
  map.set(key, [...(map.get(key) || []), item]);
  return map;
}, new Map());
const recordsByMonth = byMonth(tiebaRecords);
const monthly = playlists.filter((item) => item.kind === "month");
const playlistsByMonth = new Map(monthly.map((item) => [item.key, item]));
const months = [...new Set([...recordsByMonth.keys(), ...playlistsByMonth.keys()])].sort();

function mergeMonth(month) {
  const playlist = playlistsByMonth.get(month) || null;
  const records = recordsByMonth.get(month) || [];
  const used = new Set();
  const descriptionEntries = parseDescription(playlist?.description).map((entry) => {
    const track = (playlist?.tracks || []).find((item) => normalize(item.title) === normalize(entry.artist));
    return track ? { ...entry, title: entry.artist, artist: entry.title, orderHint: track.order } : entry;
  });
  const mergedSongs = (playlist?.tracks || []).map((track) => {
    const match = records.find((record) => !used.has(record.id) && sameSong(record, track));
    if (match) used.add(match.id);
    return {
      order: track.order,
      title: match?.title || track.title,
      artist: match?.artist || track.artists.join(" & "),
      period: match?.period || null,
      status: match ? "both-sources" : "netease-current-only",
      netease: { playlistId: playlist.id, songId: track.id, order: track.order },
      ...(match ? { tieba: { recordId: match.id, source: match.source, confidence: match.confidence } } : {})
    };
  });
  records.filter((record) => !used.has(record.id)).forEach((record) => mergedSongs.push({
    order: null, title: record.title, artist: record.artist, period: record.period,
    status: "tieba-historical-only", tieba: { recordId: record.id, source: record.source, confidence: record.confidence }
  }));
  return {
    month,
    playlist: playlist && {
      id: playlist.id, url: playlist.url, name: playlist.name, note: playlist.note || "",
      description: playlist.description, creatorId: playlist.creatorId, creator: playlist.creator,
      descriptionEntries,
      createTime: playlist.createTime, updateTime: playlist.updateTime,
      trackCount: playlist.trackCount, currentTrackCount: playlist.currentTrackCount,
      commentCount: playlist.commentCount, playCount: playlist.playCount
    },
    tiebaRecords: records.map((record) => ({ id: record.id, period: record.period, title: record.title, artist: record.artist, source: record.source, confidence: record.confidence })),
    currentNeteaseTracks: playlist?.tracks || [],
    mergedSongs,
    reviewFlags: [
      ...(mergedSongs.some((song) => song.status === "tieba-historical-only") ? ["贴吧历史记录未在当前网易云曲目中匹配"] : []),
      ...(playlist?.description ? ["保留歌单简介原文"] : [])
    ]
  };
}

const merged = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sources: {
    tiebaRaw: { file: "resource/resource.md", urls: [...new Set(readFileSync(resolve(root, "resource/resource.md"), "utf8").match(/https?:\/\/tieba\.baidu\.com\/p\/\d+(?:\?[^\s]*)?/g) || [])] },
    tiebaStructured: { file: "dist/app.js", crossCheck: "bell-catalog-draft.md" },
    netease: { file: "resource_netmusic/歌单.md", snapshot: "resource_netmusic/netease-metadata.json" }
  },
  rules: {
    bothSources: "贴吧课次记录与网易云当前曲目按标准化歌名匹配",
    neteaseCurrentOnly: "只出现在网易云抓取快照，尚未证明课次",
    tiebaHistoricalOnly: "贴吧历史记录未匹配当前网易云，可能是删歌或版本差异"
  },
  stats: {
    months: months.length,
    monthsWithNetease: monthly.length,
    monthsWithTieba: recordsByMonth.size,
    tiebaRecords: tiebaRecords.length,
    neteaseCurrentTracks: monthly.reduce((sum, item) => sum + item.currentTrackCount, 0)
  },
  collections: playlists.filter((item) => item.kind === "collection"),
  months: Object.fromEntries(months.map((month) => [month, mergeMonth(month)]))
};

writeFileSync(resolve(root, "resource_netmusic/merged-catalog.json"), `${JSON.stringify(merged, null, 2)}\n`);
const rows = months.map((month) => {
  const item = merged.months[month];
  const playlist = item.playlist;
  const both = item.mergedSongs.filter((song) => song.status === "both-sources").length;
  const historical = item.mergedSongs.filter((song) => song.status === "tieba-historical-only").length;
  return `| ${month} | ${playlist ? `[${playlist.name}](${playlist.url})` : "—"} | ${playlist?.currentTrackCount ?? 0} | ${item.tiebaRecords.length} | ${both} | ${historical} | ${playlist?.commentCount ?? 0} |`;
}).join("\n");
const markdown = `# 网易云 + 贴吧合并歌单\n\n生成时间：${merged.generatedAt}\n\nJSON 是主数据；本表用于人工检查。\n\n## 统计\n\n- 覆盖月份：${merged.stats.months}\n- 有网易云歌单：${merged.stats.monthsWithNetease}\n- 有贴吧结构化记录：${merged.stats.monthsWithTieba}\n- 贴吧课次记录：${merged.stats.tiebaRecords}\n- 网易云当前曲目：${merged.stats.neteaseCurrentTracks}\n\n## 状态\n\n- **both-sources**：贴吧课次记录与网易云当前曲目按标准化歌名匹配。\n- **netease-current-only**：只出现在当前网易云快照，尚未证明课次。\n- **tieba-historical-only**：贴吧历史记录未匹配当前网易云，可能是删歌或版本差异。\n\n## 月份索引\n\n| 月份 | 网易云歌单 | 当前曲目 | 贴吧记录 | 双来源匹配 | 贴吧历史未匹配 | 评论数 |\n|---|---|---:|---:|---:|---:|---:|\n${rows}\n\n## 合集\n\n${merged.collections.map((item) => `- [${item.name}](${item.url})：${item.currentTrackCount} 首当前曲目，${item.commentCount} 条评论`).join("\n")}\n`;
writeFileSync(resolve(root, "resource_netmusic/merged-catalog.md"), markdown);
console.log(`已生成 ${merged.stats.months} 个月份的合并歌单，包含 ${merged.stats.tiebaRecords} 条贴吧记录和 ${merged.stats.neteaseCurrentTracks} 首网易云当前曲目`);
