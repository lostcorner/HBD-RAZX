import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";
import vm from "node:vm";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = resolve(projectRoot, "dist/netmusic-playlists.js");
const outputPath = resolve(projectRoot, "resource_netmusic/netease-metadata.json");
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(indexPath, "utf8"), sandbox);

const monthly = Object.entries(sandbox.window.NETEASE_MONTH_PLAYLISTS).map(([month, playlist]) => ({
  kind: "month",
  key: month,
  ...playlist
}));
const collections = sandbox.window.NETEASE_COLLECTION_PLAYLISTS.map((playlist, index) => ({
  kind: "collection",
  key: `collection-${index + 1}`,
  ...playlist
}));
const playlists = [...collections, ...monthly];

const wait = (milliseconds) => new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
function requestJson(url) {
  return new Promise((resolvePromise, reject) => {
    const request = https.get(url, { headers: { "user-agent": "Mozilla/5.0" } }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => {
        try {
          resolvePromise({ status: response.statusCode, body: JSON.parse(body) });
        } catch (error) {
          reject(new Error(`无法解析响应：${error.message}`));
        }
      });
    });
    request.setTimeout(15000, () => request.destroy(new Error("请求超时")));
    request.on("error", reject);
  });
}
async function fetchDetail(playlist) {
  const url = `https://music.163.com/api/playlist/detail?id=${playlist.id}`;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await requestJson(url);
      const body = response.body;
      if (response.status !== 200 || !body.result) throw new Error(`HTTP ${response.status} / code ${body.code ?? "unknown"}`);
      const detail = body.result;
      return {
        ...playlist,
        url: `https://music.163.com/#/playlist?id=${playlist.id}`,
        name: detail.name,
        description: detail.description || "",
        creatorId: detail.creator?.userId ? String(detail.creator.userId) : "",
        creator: detail.creator?.nickname || "",
        createTime: detail.createTime ? new Date(detail.createTime).toISOString() : null,
        updateTime: detail.updateTime ? new Date(detail.updateTime).toISOString() : null,
        trackCount: detail.trackCount,
        currentTrackCount: detail.tracks?.length ?? 0,
        commentCount: detail.commentCount ?? 0,
        playCount: detail.playCount ?? 0,
        tracks: (detail.tracks || []).map((track, index) => ({
          order: index + 1,
          id: String(track.id),
          title: track.name,
          artists: (track.artists || []).map((artist) => artist.name)
        }))
      };
    } catch (error) {
      if (attempt === 3) return { ...playlist, url, error: error.message };
      await wait(400 * attempt);
    }
  }
}

const results = new Array(playlists.length);
let nextIndex = 0;
async function worker() {
  while (nextIndex < playlists.length) {
    const index = nextIndex;
    nextIndex += 1;
    results[index] = await fetchDetail(playlists[index]);
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
const output = {
  fetchedAt: new Date().toISOString(),
  source: "resource_netmusic/歌单.md",
  count: results.length,
  failed: results.filter((item) => item.error).length,
  playlists: results
};
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`已抓取 ${results.length} 个公开歌单，失败 ${output.failed} 个：${outputPath}`);
