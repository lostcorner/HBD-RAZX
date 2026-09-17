// 曲库由 scripts/build-site-catalog.mjs 生成到 dist/catalog.js。
// 课次明确的记录进 records；只有歌单曲目、课次待确认的进 unconfirmedTracks。
const catalog = window.BELL_CATALOG || { months: {}, stats: {} };
const monthCatalog = catalog.months || {};
const catalogMonths = Object.keys(monthCatalog).sort();

const records = Object.values(monthCatalog).flatMap((month) => month.records.map((record) => ({
  ...record,
  source: month.playlist?.url || "",
  confidence: month.confidenceLabel
})));

const monthSlotSource = (month) => monthCatalog[month]?.source || "";
const monthConfidenceLabel = (month) => monthCatalog[month]?.confidenceLabel || "";
const monthIsVerified = (month) => Boolean(monthCatalog[month]?.verified);
const unconfirmedTracks = (month) => monthCatalog[month]?.unconfirmedTracks || [];

// 月度歌单是“这个月有哪些歌”的来源之一，不等同于单曲的精确播放链接。
// 历史简介可能比当前曲目更完整（歌曲可能因版权等原因从歌单中消失）。
const monthPlaylists = window.NETEASE_MONTH_PLAYLISTS || {};
const collectionPlaylists = window.NETEASE_COLLECTION_PLAYLISTS || [];

function playlistUrl(playlist) {
  return `https://music.163.com/#/playlist?id=${playlist.id}`;
}

function renderMonthPlaylist(month) {
  const playlist = monthPlaylists[month];
  if (!playlist) return "";
  const note = playlist.note ? ` ${escapeHtml(playlist.note)}` : "";
  return `<a class="month-playlist-link" href="${playlistUrl(playlist)}" target="_blank" rel="noreferrer">${playlist.label}${note} ↗</a>`;
}

function renderCollectionGuide() {
  const playlist = collectionPlaylists[0];
  if (!playlist) return "";
  return `<p class="collection-guide">可以先从合集里寻找这段时间的铃声：</p><a class="collection-guide-link" href="${playlistUrl(playlist)}" target="_blank" rel="noreferrer">${escapeHtml(playlist.label)} ↗</a>`;
}

function renderCollectionPlaylists() {
  const container = $("#playlist-collections");
  const links = $("#playlist-collection-links");
  if (!collectionPlaylists.length) {
    container.hidden = true;
    return;
  }
  links.innerHTML = collectionPlaylists.map((playlist) =>
    `<a href="${playlistUrl(playlist)}" target="_blank" rel="noreferrer">${escapeHtml(playlist.label)} ↗</a>`
  ).join("");
}

const periods = [...new Set(records.map((record) => record.period))];
const state = { current: null, answered: false };
const memoryState = { current: null };

const periodGroups = [
  { label: "起床铃", options: [["early", "起床铃"]] },
  { label: "上午", options: [["morning-1", "第一节"], ["morning-2", "第二节"], ["morning-3", "第三节"], ["morning-4", "第四节"]] },
  { label: "下午", options: [["afternoon-1", "第五节"], ["afternoon-2", "第六节"], ["afternoon-3", "第七节"], ["afternoon-4", "第八节"]] },
  { label: "连堂", options: [["joint-8-9", "第八、九节"]] },
  { label: "晚上", options: [["evening-1", "第九节"], ["evening-2", "第十节"], ["evening-3", "第十一节"], ["sleep", "就寝"]] }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const monthLabel = (month) => `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月`;
const compactMonth = (month) => month.replace("-", ".");
const monthSerial = (month) => {
  const [year, value] = month.split("-").map(Number);
  return year * 12 + value - 1;
};

function activeRange() {
  return { start: $("#range-start").value, end: $("#range-end").value };
}

function syncRangePanels() {
  const { start, end } = activeRange();
  const label = `我的瑞中时间 · ${compactMonth(start)}—${compactMonth(end)}`;
  ["#quiz-range-label", "#memory-range-label", "#archive-range-label"].forEach((selector) => {
    const element = $(selector);
    if (element) element.textContent = label;
  });
  const enrollmentSummary = $("#enrollment-summary");
  if (enrollmentSummary) {
    const selected = $("#enrollment-year").value;
    enrollmentSummary.textContent = selected === "custom" ? "自定义" : `${selected}级`;
  }
}

function inActiveRange(month) {
  const { start, end } = activeRange();
  return monthSerial(month) >= monthSerial(start) && monthSerial(month) <= monthSerial(end);
}

function periodKey(period) {
  return {
    "早起": "early", "第一节": "morning-1", "第二节": "morning-2",
    "第三节": "morning-3", "第四节": "morning-4", "第五节": "afternoon-1",
    "第六节": "afternoon-2", "第七节": "afternoon-3", "第八节": "afternoon-4",
    "第八、九节": "joint-8-9", "第九节": "evening-1", "晚自习第一节": "evening-1",
    "第十节": "evening-2", "晚自习第二节": "evening-2", "第十一节": "evening-3",
    "就寝": "sleep"
  }[period];
}

function periodLabel(period) {
  // 课次统一显示成「第 N 节」；晚自习的两节与第九、第十节是同一时段，归并显示。
  return {
    "第一节": "第一节", "第二节": "第二节", "第三节": "第三节", "第四节": "第四节",
    "第五节": "第五节", "第六节": "第六节", "第七节": "第七节", "第八节": "第八节",
    "第八、九节": "第八、九节", "第九节": "第九节", "晚自习第一节": "第九节",
    "第十节": "第十节", "晚自习第二节": "第十节", "第十一节": "第十一节", "就寝": "就寝"
  }[period] || period;
}

function periodDetailLabel(period) {
  const labels = {
    early: "起床铃 · 早起",
    "morning-1": "第一节 · 上午第一节", "morning-2": "第二节 · 上午第二节",
    "morning-3": "第三节 · 上午第三节", "morning-4": "第四节 · 上午第四节",
    "afternoon-1": "第五节 · 下午第一节", "afternoon-2": "第六节 · 下午第二节",
    "afternoon-3": "第七节 · 下午第三节", "afternoon-4": "第八节 · 下午第四节",
    "joint-8-9": "第八、九节 · 下午连堂课", "evening-1": "第九节 · 晚上第一节",
    "evening-2": "第十节 · 晚上第二节", "evening-3": "第十一节 · 晚上第三节", sleep: "就寝 · 晚间"
  };
  return labels[periodKey(period)] || labels[period] || periodLabel(period);
}

function monthsInRange(start, end) {
  const months = [];
  for (let serial = monthSerial(start); serial <= monthSerial(end); serial += 1) {
    const year = Math.floor(serial / 12);
    months.push(`${year}-${String(serial % 12 + 1).padStart(2, "0")}`);
  }
  return months;
}

function searchableLinks(record) {
  const query = encodeURIComponent(`${record.title} ${record.artist}`);
  // 有精确链接时直接用，避免同名、remix、多版本选错曲目；没有才退回搜索。
  const apple = record.appleUrl
    ? [record.appleUrl, "打开曲目页"]
    : [`https://music.apple.com/cn/search?term=${query}`, "搜索"];
  const netease = record.neteaseUrl
    ? [record.neteaseUrl, "打开单曲页"]
    : [`https://music.163.com/#/search/m/?s=${query}&type=1`, "搜索"];
  return [
    ["Apple Music", apple[0], apple[1]],
    ["网易云音乐", netease[0], netease[1]],
    ["QQ 音乐", `https://y.qq.com/n/ryqq/search?w=${query}`, "搜索"],
    ["Spotify", `https://open.spotify.com/search/${query}`, "搜索"]
  ];
}

function renderPlatformLinks(record, compact = false) {
  const icons = {
    "Apple Music": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.7 12.7c0-2 1.7-3 1.8-3.1-1-.1-2.2 1.1-2.6 1.1-.6 0-1.5-1.1-2.8-1.1-1.4 0-2.6.8-3.3 2.1-1.4 2.5-.4 6.1 1 8 .7.9 1.5 1.9 2.6 1.8 1-.1 1.4-.9 2.7-.9 1.3 0 1.7.9 2.8.9 1.1 0 1.8-1 2.4-1.9.8-1.1 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.5zM14.9 8.4c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.6-1.2z"/></svg>',
    "网易云音乐": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.2 18.2a3.2 3.2 0 1 1 2.3-5.5V6.5l8.1-1.8v9.7a3.2 3.2 0 1 1-2.1-3V7.3l-6 1.3v6.3a3.2 3.2 0 0 1-2.3 3.3z"/></svg>',
    "QQ 音乐": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 18.3a3.1 3.1 0 1 1 2.2-5.3V6.2l7.3-1.7v9.1a3.1 3.1 0 1 1-2.1-2.9V7.1l-5.2 1.2v6.2A3.1 3.1 0 0 1 9 18.3z"/></svg>',
    Spotify: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.2 9.2a1 1 0 0 1 .9-1.8c4.1-1.2 8.8-.7 11.9.9a1 1 0 1 1-.9 1.8c-2.6-1.3-6.7-1.8-10.9-.6a1 1 0 0 1-1-.3zm1 4a.9.9 0 0 1 .8-1.7c3.4-1 7.4-.6 10.1.8a.9.9 0 1 1-.8 1.6c-2.3-1.2-5.8-1.5-9-.7a.9.9 0 0 1-1.1 0zm1.1 3.7a.8.8 0 0 1 .7-1.5c2.8-.7 5.7-.4 7.9.7a.8.8 0 1 1-.7 1.4c-1.8-.9-4.3-1.1-6.7-.5a.8.8 0 0 1-1.2-.1z"/></svg>'
  };
  const classes = { "Apple Music": "apple", "网易云音乐": "netease", "QQ 音乐": "qq", Spotify: "spotify" };
  const iconFiles = { "Apple Music": "apple-music.jpg", "网易云音乐": "netease-cloud-music.jpg", "QQ 音乐": "qq-music.jpg", Spotify: "spotify.jpg" };
  return `<div class="platform-links">${searchableLinks(record).map(([name, url, action]) => {
    const label = compact ? name.replace(/\s*音乐\s*$/, "").trim() : name;
    const hint = `在${name}中${action}${record.title}`;
    // 文字单独包一层 span：手机端只留图标时把它隐藏即可。
    // 隐藏后链接会失去可读名称，所以补 aria-label 顶替。
    return `<a class="platform-link platform-${classes[name]}" href="${url}" target="_blank" rel="noreferrer" aria-label="${escapeAttr(hint)}" title="${escapeAttr(hint)}"><span class="platform-icon" aria-hidden="true"><img src="./assets/platform-icons/${iconFiles[name]}" alt="" /></span><span class="platform-label">${label} ↗</span></a>`;
  }).join("")}</div>`;
}

function eligibleRecords() {
  return records.filter((record) => record.audio && record.quizEligible && inActiveRange(record.month));
}

function chooseQuestion() {
  const pool = eligibleRecords();
  renderChoices();
  state.current = pool[Math.floor(Math.random() * pool.length)] || null;
  state.answered = false;
  $("#mystery-title").textContent = state.current ? "未知铃声" : "这段时间还没有档案";
  $("#result-panel").hidden = true;
  $("#answer-form").hidden = !state.current;
  $("#answer-form").reset();
  if (!state.current) {
    const audio = $("#audio-player");
    audio.pause();
    audio.removeAttribute("src");
    $("#audio-toggle").disabled = true;
    $("#audio-progress").value = 0;
    $("#audio-current").textContent = "0:00";
    $("#audio-status").textContent = "可以扩大上面的时间范围，或者等待我们继续补齐歌单。";
    return;
  }
  const audio = $("#audio-player");
  audio.pause();
  audio.src = state.current.audio;
  audio.load();
  $("#audio-toggle").disabled = false;
  $("#audio-progress").value = 0;
  $("#audio-current").textContent = "0:00";
  $("#audio-status").textContent = "点击图标，先听一段，再根据记忆选择月份和课间。";
}

function chooseMemoryTrack() {
  const pool = eligibleRecords();
  const previous = memoryState.current;
  const choices = pool.length > 1 ? pool.filter((record) => record.id !== previous?.id) : pool;
  const record = choices[Math.floor(Math.random() * choices.length)] || null;
  const audio = $("#memory-audio-player");
  memoryState.current = record;
  $("#memory-song-title").textContent = record?.title || "暂时没有可播放铃声";
  $("#memory-song-artist").textContent = record?.artist || "";
  $("#memory-song-meta").textContent = record ? `${record.month.replace("-", " 年 ")} 月 · ${periodLabel(record.period)}` : "—";
  $("#memory-platform-links").innerHTML = record ? renderPlatformLinks(record) : "";
  $("#memory-list").innerHTML = record ? renderMemories(record.id) : "";
  $("#memory-note-input").value = "";
  audio.pause();
  audio.removeAttribute("src");
  if (!record) return;
  audio.src = record.audio;
  audio.load();
  $("#memory-audio-toggle").disabled = false;
  $("#memory-audio-progress").value = 0;
  $("#memory-audio-current").textContent = "0:00";
  $("#memory-audio-status").textContent = "点击星球播放。";
}

function renderChoices() {
  const { start, end } = activeRange();
  const months = monthsInRange(start, end);
  const years = [...new Set(months.map((month) => month.slice(0, 4)))];
  $("#month-options").innerHTML = `
    <label class="answer-select-label">年份
      <select id="answer-year" name="year" class="answer-select">
        <option value="">选择年份</option>
        ${years.map((year) => `<option value="${year}">${year} 年</option>`).join("")}
      </select>
    </label>
    <label class="answer-select-label">月份
      <select id="answer-month" name="month" class="answer-select" disabled>
        <option value="">先选择年份</option>
      </select>
    </label>`;
  $("#answer-year").addEventListener("change", (event) => {
    const year = event.target.value;
    event.target.classList.toggle("has-value", Boolean(year));
    const monthSelect = $("#answer-month");
    const available = months.filter((month) => month.startsWith(`${year}-`));
    monthSelect.disabled = !year;
    monthSelect.innerHTML = year
      ? `<option value="">选择月份</option>${available.map((month) => `<option value="${month.slice(5)}">${Number(month.slice(5))} 月</option>`).join("")}`
      : `<option value="">先选择年份</option>`;
    monthSelect.classList.remove("has-value");
    monthSelect.onchange = (monthEvent) => monthEvent.target.classList.toggle("has-value", Boolean(monthEvent.target.value));
  });

  $("#period-options").innerHTML = periodGroups.map((group) => `
    <section class="period-group">
      <h3>${group.label}</h3>
      <div class="period-choice-row">${group.options.map(([value, label]) => `
        <label class="period-choice">
          <input type="radio" name="period" value="${value}" ${value === "early" ? "required" : ""} />
          <span>${label}</span>
        </label>`).join("")}</div>
    </section>`).join("");
}

function memoryKey(recordId) { return `bell-memories:${recordId}`; }
function getMemories(recordId) {
  try { return JSON.parse(localStorage.getItem(memoryKey(recordId))) || []; }
  catch { return []; }
}
function saveMemory(recordId, content) {
  const memories = getMemories(recordId);
  memories.unshift({ content, date: new Date().toLocaleDateString("zh-CN") });
  localStorage.setItem(memoryKey(recordId), JSON.stringify(memories));
}
function renderMemories(recordId) {
  // 没有回忆时不显示任何占位文案，列表留空即可（.memories:empty 会一起收掉外边距）。
  const memories = getMemories(recordId);
  return memories
    .map((memory) => `<article class="memory-item"><p>${escapeHtml(memory.content)}</p><small>本机记录 · ${memory.date}</small></article>`)
    .join("");
}

function correctionKey(recordId) { return `bell-corrections:${recordId}`; }
function getCorrections(recordId) {
  try { return JSON.parse(localStorage.getItem(correctionKey(recordId))) || []; }
  catch { return []; }
}
function saveCorrection(recordId, correction) {
  const corrections = getCorrections(recordId);
  corrections.push({ ...correction, date: new Date().toISOString() });
  localStorage.setItem(correctionKey(recordId), JSON.stringify(corrections));
}
function renderCorrectionSummary(record) {
  const corrections = getCorrections(record.id);
  if (!corrections.length) return "尚无本机校对";
  const latest = corrections.at(-1);
  return `${corrections.length} 次本机标记 · 最近：${latest.month.replace("-", " 年 ")} 月 / ${periodLabel(latest.period)}`;
}
function renderCorrectionForm(record) {
  return `
    <details class="correction-box">
      <summary>确认或纠正年月、课间</summary>
      <p class="correction-summary">${renderCorrectionSummary(record)}</p>
      <form class="correction-form" data-record-id="${record.id}">
        <label>年月<input name="month" type="month" value="${record.month}" required /></label>
        <label>课间<select name="period" required>${periods.map((period) => `<option value="${period}"${period === record.period ? " selected" : ""}>${periodLabel(period)}</option>`).join("")}</select></label>
        <label class="correction-note">说明（可选）<input name="note" maxlength="120" placeholder="例如：记得这是晚间的课间" /></label>
        <button type="submit" class="secondary-button">提交本机校对</button>
      </form>
      <small>当前原型仅保存在这台设备；联网版再汇总为公开票数。</small>
    </details>`;
}
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}
// escapeHtml 走 textContent 只转义 & < >，放进 HTML 属性还得把引号也处理掉。
function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function revealResult(month, period) {
  const record = state.current;
  const correct = Boolean(month) && record.month === month && periodKey(record.period) === period;
  state.answered = true;
  $("#mystery-title").textContent = record.title;
  $("#answer-form").hidden = true;
  const panel = $("#result-panel");
  panel.hidden = false;
  panel.innerHTML = `
    <div class="result-card">
      <span class="result-badge ${correct ? "correct" : ""}">${correct ? "答对了" : "再听一次，也许就想起来了"}</span>
      <div class="result-heading"><h3>${escapeHtml(record.title)}</h3><span class="result-artist">${escapeHtml(record.artist)}</span></div>
      <p class="answer-line"><strong>${record.month.replace("-", " 年 ")} 月</strong><span>·</span><strong>${periodDetailLabel(record.period)}</strong></p>
      ${record.sourceRef?.url ? `<a class="answer-source-link" href="${record.sourceRef.url}" target="_blank" rel="noreferrer">核对${escapeHtml(record.sourceRef.kind)}${record.sourceRef.floor ? `（第 ${record.sourceRef.floor} 楼）` : ""} ↗</a>` : ""}
      ${renderPlatformLinks(record)}
      <div class="memory-box">
        <h4>关于这首铃声，你想起了什么？</h4>
        <textarea id="memory-input" maxlength="500" placeholder="走廊、教室、同桌，或者那一天发生的小事……"></textarea>
        <button type="button" class="primary-button memory-save-button" id="save-memory">留下回忆</button>
        <div class="memory-actions"><button type="button" class="secondary-button" id="next-question">下一首</button></div>
        <div class="memories" id="memory-list">${renderMemories(record.id)}</div>
      </div>
    </div>`;

  $("#next-question").addEventListener("click", chooseQuestion);
  $("#save-memory").addEventListener("click", () => {
    const input = $("#memory-input");
    const content = input.value.trim();
    if (!content) { input.focus(); return; }
    saveMemory(record.id, content);
    input.value = "";
    $("#memory-list").innerHTML = renderMemories(record.id);
  });
}

function renderMonthSource(month) {
  const entry = monthCatalog[month];
  const source = monthSlotSource(month);
  if (!source) return `<span class="month-source">课次来源：暂无</span>`;
  const detail = entry?.sourceDetail || null;
  const confidence = entry?.confidenceLabel || "";
  const verified = monthIsVerified(month) ? "已与贴吧原帖交叉校对" : "待校友确认";
  const parts = [`课次来源：${escapeHtml(source)}`, escapeHtml(confidence), escapeHtml(verified)];
  const url = entry?.sourceDetail?.url || entry?.playlist?.url || "";
  const link = url
    ? `<a class="month-source-link" href="${url}" target="_blank" rel="noreferrer">查看${detail?.kind === "贴吧原帖" ? `原帖${detail.floor ? `第 ${detail.floor} 楼` : ""}` : "歌单简介"} ↗</a>`
    : "";
  const raw = detail?.raw
    ? `<details class="month-source-raw"><summary>原文</summary><p>${escapeHtml(detail.raw)}</p>${detail.openQuestion ? `<p class="month-source-question">待确认：${escapeHtml(detail.openQuestion)}</p>` : ""}</details>`
    : "";
  return `<span class="month-source">${parts.join(" · ")}</span>${link}${raw}`;
}

function renderUnconfirmedTracks(month, hasRecords = false) {
  const tracks = unconfirmedTracks(month);
  if (!tracks.length) return "";
  const note = hasRecords
    ? `另外还有 ${tracks.length} 首出现在这个月的网易云歌单里，但还没确认对应哪个课间，所以暂不参与猜题。`
    : "这个月只找到了网易云歌单的曲目列表，还没有人确认每首歌对应哪个课间，因此暂不参与猜题。";
  return `
    <div class="month-unconfirmed">
      <p class="month-unconfirmed-note">${escapeHtml(note)}</p>
      <ol class="unconfirmed-list">${tracks.map((track) => `
        <li>
          <div class="unconfirmed-song"><strong>${escapeHtml(track.title)}</strong><span>${escapeHtml(track.artist)}</span></div>
          <div class="unconfirmed-links">${renderPlatformLinks(track, true)}</div>
        </li>`).join("")}</ol>
    </div>`;
}

function renderArchive() {
  const showAll = $("#archive-show-all").checked;
  const shown = (showAll ? records : eligibleRecords()).slice().sort((a, b) => a.month.localeCompare(b.month));
  const shownByMonth = shown.reduce((map, record) => {
    (map[record.month] ||= []).push(record);
    return map;
  }, {});
  const allArchiveMonths = catalogMonths.length
    ? catalogMonths
    : [...new Set(records.map((record) => record.month))].sort();
  const visibleMonths = showAll
    ? monthsInRange(allArchiveMonths[0], allArchiveMonths.at(-1))
    : monthsInRange(activeRange().start, activeRange().end);
  const years = {};
  for (const month of visibleMonths) {
    const year = month.slice(0, 4);
    (years[year] ||= {})[month] = shownByMonth[month] || [];
  }

  $("#archive-list").innerHTML = Object.entries(years).map(([year, monthGroups]) => {
    const yearRecords = Object.values(monthGroups).flat();
    const yearUnconfirmed = Object.keys(monthGroups).reduce((sum, month) => sum + unconfirmedTracks(month).length, 0);
    const yearSummary = yearRecords.length
      ? `${Object.keys(monthGroups).length} 个月 · ${yearRecords.length} 首${yearUnconfirmed ? ` · 待确认 ${yearUnconfirmed} 首` : ""}`
      : `${Object.keys(monthGroups).length} 个月 · 课次待确认 ${yearUnconfirmed} 首`;
    return `
      <details class="year-group">
        <summary><span>${year} 年</span><small>${yearSummary}</small></summary>
        <div class="year-months">${Object.entries(monthGroups).map(([month, items]) => {
          const pending = unconfirmedTracks(month);
          const monthSummary = items.length
            ? `${items.length} 首`
            : pending.length ? `课次待确认 ${pending.length} 首` : "缺少统计";
          return `
          <details class="month-group">
            <summary>
              <span>${Number(month.slice(5))} 月</span>
              <small>${monthSummary}</small>
            </summary>
            <div class="month-content">
              <div class="month-tools">${renderMonthPlaylist(month)}${renderMonthSource(month)}</div>
              ${items.length ? `<div class="archive-rows">${items.map((record) => `
                <article class="archive-row">
                  <span class="archive-period">${periodLabel(record.period)}${record.playStatus === "played" ? "" : '<em class="archive-flag">计划未播</em>'}</span>
                  <div class="archive-song"><h3>${escapeHtml(record.title)}</h3><p>${escapeHtml(record.artist)}${record.note ? ` · ${escapeHtml(record.note)}` : ""}</p></div>
                  <details class="archive-actions">
                    <summary>收听与校对</summary>
                    ${renderPlatformLinks(record, true)}
                    ${renderCorrectionForm(record)}
                  </details>
                </article>`).join("")}</div>` : ""}
              ${items.length ? "" : pending.length ? renderUnconfirmedTracks(month) : `<div class="month-empty"><strong>缺少统计</strong><p>这个月暂时还没有整理好的曲目与课间信息。</p>${renderCollectionGuide()}</div>`}
              ${items.length && pending.length ? renderUnconfirmedTracks(month, true) : ""}
            </div>
          </details>`;
        }).join("")}</div>
      </details>`;
  }).join("") || `<div class="archive-empty"><h2>这段时间的档案还在路上</h2><p>返回“铃声回忆”调整起止月份，或勾选“显示全部年份”。</p></div>`;

  $$(".correction-form").forEach((form) => form.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(form);
    saveCorrection(form.dataset.recordId, {
      month: values.get("month"),
      period: values.get("period"),
      note: values.get("note").trim()
    });
    renderArchive();
  }));
}

function updateRange(changedInput) {
  let { start, end } = activeRange();
  if (monthSerial(start) > monthSerial(end)) {
    if (changedInput === "start") $("#range-end").value = start;
    else $("#range-start").value = end;
    ({ start, end } = activeRange());
  }

  const label = `${compactMonth(start)}—${compactMonth(end)}`;
  syncRangePanels();
  renderArchive();
  chooseQuestion();
  if ($("#memory-audio-player")) chooseMemoryTrack();
}

function applyEnrollmentPreset() {
  const value = $("#enrollment-year").value;
  if (value === "custom") return;
  const year = Number(value);
  $("#range-start").value = `${year}-07`;
  $("#range-end").value = `${year + 3}-06`;
  updateRange();
  $(".enrollment-drawer").open = false;
}

function setView(view) {
  $$(".view").forEach((item) => item.classList.toggle("is-active", item.id === `${view}-view`));
  $$(".nav-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.view === view));
  history.replaceState(null, "", `#${view}`);
}

updateRange();
renderCollectionPlaylists();

$("#forget-month").addEventListener("click", () => {
  const year = $("#answer-year");
  const month = $("#answer-month");
  year.value = "";
  month.disabled = true;
  month.innerHTML = `<option value="">先选择年份</option>`;
  year.classList.remove("has-value");
  month.classList.remove("has-value");
});

$("#answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const year = form.get("year");
  const month = form.get("month");
  const answerMonth = year && month ? `${year}-${String(month).padStart(2, "0")}` : "";
  revealResult(answerMonth, form.get("period"));
});
$("#enrollment-year").addEventListener("change", applyEnrollmentPreset);
document.addEventListener("click", (event) => {
  const drawer = $(".enrollment-drawer");
  if (drawer?.open && !event.target.closest(".enrollment-drawer")) drawer.open = false;
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const drawer = $(".enrollment-drawer");
  if (drawer?.open) {
    drawer.open = false;
    drawer.querySelector("summary")?.focus();
  }
});
$("#range-start").addEventListener("change", () => {
  $("#enrollment-year").value = "custom";
  updateRange("start");
});
$("#range-end").addEventListener("change", () => {
  $("#enrollment-year").value = "custom";
  updateRange("end");
});
$("#archive-show-all").addEventListener("change", renderArchive);
$$(".nav-tab").forEach((tab) => tab.addEventListener("click", () => setView(tab.dataset.view)));
if (location.hash === "#archive") setView("archive");
if (location.hash === "#memory") setView("memory");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

const audioPlayer = $("#audio-player");
const audioToggle = $("#audio-toggle");
const audioProgress = $("#audio-progress");
audioToggle.addEventListener("click", () => {
  if (!state.current) return;
  if (audioPlayer.paused) audioPlayer.play().catch(() => {
    $("#audio-status").textContent = "预览暂时无法播放，可以先继续作答。";
  });
  else audioPlayer.pause();
});
audioPlayer.addEventListener("play", () => {
  audioToggle.classList.add("is-playing");
  audioToggle.setAttribute("aria-label", "暂停未知铃声");
  $("#audio-status").textContent = "正在播放 30 秒预览。";
});
audioPlayer.addEventListener("pause", () => {
  audioToggle.classList.remove("is-playing");
  audioToggle.setAttribute("aria-label", "播放未知铃声");
});
audioPlayer.addEventListener("loadedmetadata", () => {
  audioProgress.max = audioPlayer.duration || 30;
  $("#audio-duration").textContent = formatTime(audioPlayer.duration || 30);
});
audioPlayer.addEventListener("timeupdate", () => {
  audioProgress.value = audioPlayer.currentTime;
  $("#audio-current").textContent = formatTime(audioPlayer.currentTime);
});
audioPlayer.addEventListener("ended", () => {
  audioToggle.classList.remove("is-playing");
  audioToggle.setAttribute("aria-label", "重播未知铃声");
  $("#audio-status").textContent = "预览结束，可以重新播放或直接作答。";
});
audioProgress.addEventListener("input", () => {
  audioPlayer.currentTime = Number(audioProgress.value);
});

const memoryAudio = $("#memory-audio-player");
const memoryAudioToggle = $("#memory-audio-toggle");
const memoryAudioProgress = $("#memory-audio-progress");
memoryAudioToggle.addEventListener("click", () => {
  if (!memoryState.current) return;
  if (memoryAudio.paused) memoryAudio.play().catch(() => {
    $("#memory-audio-status").textContent = "预览暂时无法播放。";
  });
  else memoryAudio.pause();
});
memoryAudio.addEventListener("play", () => {
  memoryAudioToggle.classList.add("is-playing");
  memoryAudioToggle.setAttribute("aria-label", "暂停铃声");
  $("#memory-audio-status").textContent = "正在播放 30 秒预览。";
});
memoryAudio.addEventListener("pause", () => {
  memoryAudioToggle.classList.remove("is-playing");
  memoryAudioToggle.setAttribute("aria-label", "播放铃声");
});
memoryAudio.addEventListener("loadedmetadata", () => {
  memoryAudioProgress.max = memoryAudio.duration || 30;
  $("#memory-audio-duration").textContent = formatTime(memoryAudio.duration || 30);
});
memoryAudio.addEventListener("timeupdate", () => {
  memoryAudioProgress.value = memoryAudio.currentTime;
  $("#memory-audio-current").textContent = formatTime(memoryAudio.currentTime);
});
memoryAudio.addEventListener("ended", () => {
  memoryAudioToggle.classList.remove("is-playing");
  memoryAudioToggle.setAttribute("aria-label", "重播铃声");
  $("#memory-audio-status").textContent = "预览结束，可以重新播放。";
});
memoryAudioProgress.addEventListener("input", () => {
  memoryAudio.currentTime = Number(memoryAudioProgress.value);
});
$("#memory-next").addEventListener("click", () => {
  const wasPlaying = !memoryAudio.paused;
  chooseMemoryTrack();
  if (wasPlaying) memoryAudio.play().catch(() => {
    $("#memory-audio-status").textContent = "预览暂时无法播放。";
  });
});
$("#memory-save").addEventListener("click", () => {
  const input = $("#memory-note-input");
  const content = input.value.trim();
  if (!content || !memoryState.current) { input.focus(); return; }
  saveMemory(memoryState.current.id, content);
  input.value = "";
  $("#memory-list").innerHTML = renderMemories(memoryState.current.id);
});
