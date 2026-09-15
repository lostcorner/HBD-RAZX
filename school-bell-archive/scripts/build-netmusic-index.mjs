import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(projectRoot, "resource_netmusic/歌单.md");
const outputPath = resolve(projectRoot, "dist/netmusic-playlists.js");
const source = readFileSync(sourcePath, "utf8");
const monthPlaylists = {};
const collectionPlaylists = [];

for (const rawLine of source.split(/\r?\n/)) {
  const idMatch = rawLine.match(/music\.163\.com\/(?:#\/)?playlist\?id=(\d+)/);
  if (!idMatch) continue;

  const id = idMatch[1];
  const urlStart = rawLine.lastIndexOf("https://", idMatch.index);
  const label = rawLine.slice(0, urlStart).replace(/[:：\[\s]+$/, "").trim();
  const withoutListNumber = label.replace(/^\d+\.\s+/, "");
  const monthMatch = withoutListNumber.match(/^(\d{2})\.(\d{1,2})(.*)$/);

  if (monthMatch) {
    const year = 2000 + Number(monthMatch[1]);
    const month = String(Number(monthMatch[2])).padStart(2, "0");
    const note = monthMatch[3].trim();
    monthPlaylists[`${year}-${month}`] = {
      id,
      label: "网易云月度歌单",
      ...(note ? { note } : {})
    };
  } else {
    collectionPlaylists.push({ id, label: withoutListNumber || "网易云歌单" });
  }
}

const generated = `// 由 scripts/build-netmusic-index.mjs 根据 resource_netmusic/歌单.md 生成，请勿手改。\n` +
  `window.NETEASE_MONTH_PLAYLISTS = ${JSON.stringify(monthPlaylists, null, 2)};\n` +
  `window.NETEASE_COLLECTION_PLAYLISTS = ${JSON.stringify(collectionPlaylists, null, 2)};\n`;

writeFileSync(outputPath, generated);
console.log(`已生成 ${Object.keys(monthPlaylists).length} 个月度歌单、${collectionPlaylists.length} 个合集：${outputPath}`);
