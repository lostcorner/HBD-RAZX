const records = [
  ["2013-12-early","2013-12","早起","Better Than I Know Myself","Adam Lambert","better-than-i-know-myself"],
  ["2013-12-01","2013-12","第一节","Applause","Lady Gaga","applause"],
  ["2013-12-03","2013-12","第三节","Beauty and a Beat","Justin Bieber","beauty-and-a-beat"],
  ["2013-12-04","2013-12","第四节","Red","Taylor Swift","red"],
  ["2013-12-05","2013-12","第五节","International Smile","Katy Perry","international-smile"],
  ["2013-12-06","2013-12","第六节","Let Her Go","Passenger","let-her-go"],
  ["2013-12-07","2013-12","第七节","Plan B","Kylee","plan-b"],
  ["2013-12-08","2013-12","第八节","Here's to Never Growing Up","Avril Lavigne","heres-to-never-growing-up"],
  ["2013-12-night-01","2013-12","晚自习第一节","We Can't Stop","Miley Cyrus","we-cant-stop"],
  ["2013-12-night-02","2013-12","晚自习第二节","Good Time","Owl City","good-time"],
  ["2013-12-sleep","2013-12","就寝","Chasing Pavements","Adele","chasing-pavements"],
  ["2015-06-early","2015-06","早起","Can We Dance","The Vamps","can-we-dance"],
  ["2015-06-01","2015-06","第一节","Bad Blood","Taylor Swift","bad-blood"],
  ["2015-06-03","2015-06","第三节","Go Hard or Go Home","Wiz Khalifa & Iggy Azalea","go-hard-or-go-home"],
  ["2015-06-04","2015-06","第四节","Big Girls Cry","Sia","big-girls-cry"],
  ["2015-06-05","2015-06","第五节","Get Low","Dillon Francis & DJ Snake","get-low"],
  ["2015-06-06","2015-06","第六节","Wear Me Out","Skylar Grey","wear-me-out"],
  ["2015-06-07","2015-06","第七节","Poison","Rita Ora","poison"],
  ["2015-06-08-09","2015-06","第八、九节","Shut Up and Dance","Walk the Moon","shut-up-and-dance"],
  ["2015-06-10","2015-06","第十节","Evil in the Night","Adam Lambert","evil-in-the-night"],
  ["2015-06-11","2015-06","第十一节","This Summer's Gonna Hurt","Maroon 5","this-summers-gonna-hurt"],
  ["2015-09-early","2015-09","早起","Go Big Or Go Home","American Authors","go-big-or-go-home"],
  ["2015-09-01","2015-09","第一节","Blank Space","Taylor Swift","blank-space"],
  ["2015-09-03","2015-09","第三节","Drag Me Down","One Direction","drag-me-down"],
  ["2015-09-04","2015-09","第四节","One Last Time","Ariana Grande","one-last-time"],
  ["2015-09-05","2015-09","第五节","Uma Thurman","Fall Out Boy","uma-thurman"],
  ["2015-09-06","2015-09","第六节","Wings (Acoustic)","Birdy","wings-acoustic"],
  ["2015-09-07","2015-09","第七节","Cheerleader","OMI","cheerleader"],
  ["2015-09-08-09","2015-09","第八、九节","Honey, I'm Good","Andy Grammer","honey-im-good"],
  ["2015-09-10","2015-09","第十节","Rumors","Adam Lambert feat. Tove Lo","rumors"],
  ["2015-09-11","2015-09","第十一节","Lean On","Major Lazer, DJ Snake & MØ","lean-on"],
  ["2015-10-early","2015-10","早起","Invincible","Kelly Clarkson","invincible"],
  ["2015-10-01","2015-10","第一节","Today's The Day","P!nk","todays-the-day"],
  ["2015-10-03","2015-10","第三节","Stitches","Shawn Mendes","stitches"],
  ["2015-10-04","2015-10","第四节","Somebody","Natalie La Rose feat. Jeremih","somebody"],
  ["2015-10-05","2015-10","第五节","Friend Zone","Danielle Bradbery","friend-zone"],
  ["2015-10-06","2015-10","第六节","One Call Away","Charlie Puth","one-call-away"],
  ["2015-10-07","2015-10","第七节","Style","Taylor Swift","style"],
  ["2015-10-09","2015-10","第九节","Cannonball","Skylar Grey feat. X Ambassadors","cannonball"],
  ["2015-10-11","2015-10","第十一节","What Do You Mean?","Justin Bieber","what-do-you-mean"],
  ["2015-11-early","2015-11","早起","I Don't Want to Go to Bed","Simple Plan feat. Nelly","i-dont-want-to-go-to-bed"],
  ["2015-11-01","2015-11","第一节","Turnin'","Young Rising Sons","turnin"],
  ["2015-11-03","2015-11","第三节","Something In the Way You Move","Ellie Goulding","something-in-the-way-you-move"],
  ["2015-11-04","2015-11","第四节","Perfect","One Direction","perfect"],
  ["2015-11-05","2015-11","第五节","Confident","Demi Lovato","confident"],
  ["2015-11-06","2015-11","第六节","Hello","Adele","hello"],
  ["2015-11-07","2015-11","第七节","Lay It All On Me","Rudimental feat. Ed Sheeran","lay-it-all-on-me"],
  ["2015-11-09","2015-11","第九节","Bang My Head","David Guetta feat. Sia & Fetty Wap","bang-my-head"],
  ["2015-11-10","2015-11","第十节","Fire N Gold","Bea Miller","fire-n-gold"],
  ["2015-11-11","2015-11","第十一节","How Deep Is Your Love","Calvin Harris & Disciples","how-deep-is-your-love"],
  ["2015-12-early","2015-12","早起","Get Over Me","Nick Carter feat. Avril Lavigne","get-over-me"],
  ["2015-12-01","2015-12","第一节","Stand By You","Rachel Platten","stand-by-you"],
  ["2015-12-03","2015-12","第三节","Hoping For Snow","The Vamps","hoping-for-snow"],
  ["2015-12-04","2015-12","第四节","Wildest Dreams","Taylor Swift","wildest-dreams"],
  ["2015-12-05","2015-12","第五节","Wolves","Rag'n'Bone Man","wolves"],
  ["2015-12-06","2015-12","第六节","WILD","Troye Sivan","wild"],
  ["2015-12-07","2015-12","第七节","Boys Like You","Who Is Fancy feat. Meghan Trainor & Ariana Grande","boys-like-you"],
  ["2015-12-09","2015-12","第九节","A Head Full of Dreams","Coldplay","a-head-full-of-dreams"],
  ["2015-12-10","2015-12","第十节","I Know What You Did Last Summer","Shawn Mendes & Camila Cabello","i-know-what-you-did-last-summer"],
  ["2015-12-11","2015-12","第十一节","Roses","The Chainsmokers feat. ROZES","roses"],
  ["2017-08-early","2017-08","早起","Numb","Linkin Park","numb"],
  ["2017-08-01","2017-08","第一节","Summer Vibe","Walk off the Earth","summer-vibe"],
  ["2017-08-03","2017-08","第三节","There for You","Martin Garrix & Troye Sivan","there-for-you"],
  ["2017-08-04","2017-08","第四节","You Don't Know About Me","Ella Vos","you-dont-know-about-me"],
  ["2017-08-05","2017-08","第五节","Mr. Blue Sky","Electric Light Orchestra","mr-blue-sky"],
  ["2017-08-06","2017-08","第六节","Just Another Day","Lady Gaga","just-another-day"],
  ["2017-08-07","2017-08","第七节","Didn't Stand a Chance","Travis Garland","didnt-stand-a-chance"],
  ["2017-08-09","2017-08","第九节","So Stop the World","Emma Stevens","so-stop-the-world"],
  ["2017-08-10","2017-08","第十节","Strip That Down","Liam Payne feat. Quavo","strip-that-down"],
  ["2017-08-11","2017-08","第十一节","Mind over Matter (Acoustic)","PVRIS","mind-over-matter-acoustic"],
  ["2018-07-early","2018-07","早起","Don't You","Wonderful Humans","dont-you"],
  ["2018-07-01","2018-07","第一节","You Give Me Life","iLY","you-give-me-life"],
  ["2018-07-03","2018-07","第三节","Lights Out","Virginia to Vegas","lights-out"],
  ["2018-07-04","2018-07","第四节","Tokyo","Truitt & Light House","tokyo"],
  ["2018-07-05","2018-07","第五节","Oops","Little Mix feat. Charlie Puth","oops"],
  ["2018-07-06","2018-07","第六节","Loving You Tonight","Andrew Allen","loving-you-tonight"],
  ["2018-07-07","2018-07","第七节","Girl with a Suntan","Jai Waetford","girl-with-a-suntan"],
  ["2018-07-08","2018-07","第八节","That's So Us","Allie X","thats-so-us"],
  ["2018-07-10","2018-07","第十节","We Don't Have To","Jai Waetford","we-dont-have-to"],
  ["2018-07-11","2018-07","第十一节","Closer (80s Remix)","TRONICBOX / The Chainsmokers / Halsey","closer-80s-remix"]
].map(([id, month, period, title, artist, audioSlug]) => ({
  id, month, period, title, artist, audioSlug,
  audio: window.APPLE_PREVIEWS?.[id] || "",
  source: {
    "2013-12": "https://tieba.baidu.com/p/2253394145",
    "2015-06": "https://tieba.baidu.com/p/3323924877",
    "2015-09": "https://tieba.baidu.com/p/4020077190",
    "2015-10": "https://tieba.baidu.com/p/4020077190",
    "2015-11": "https://tieba.baidu.com/p/4020077190",
    "2015-12": "https://tieba.baidu.com/p/4020077190",
    "2017-08": "https://tieba.baidu.com/p/4020077190",
    "2018-07": "https://tieba.baidu.com/"
  }[month],
  confidence: "原帖记录"
}));

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
  { label: "上午", options: [["morning-1", "第一节课"], ["morning-2", "第二节课"], ["morning-3", "第三节课"], ["morning-4", "第四节课"]] },
  { label: "下午", options: [["afternoon-1", "第五节课"], ["afternoon-2", "第六节课"], ["afternoon-3", "第七节课"], ["afternoon-4", "第八节课"], ["joint-8-9", "第八、九节课"]] },
  { label: "晚上", options: [["evening-1", "第九节课"], ["evening-2", "第十节课"], ["evening-3", "第十一节课"], ["sleep", "就寝"]] }
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
  if (enrollmentSummary) enrollmentSummary.textContent = `${$("#enrollment-year").selectedOptions[0].textContent} · ${compactMonth(start)}—${compactMonth(end)}`;
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
  return {
    "早起": "早起",
    "第一节": "第一节课", "第二节": "第二节课", "第三节": "第三节课", "第四节": "第四节课",
    "第五节": "第五节课", "第六节": "第六节课", "第七节": "第七节课", "第八节": "第八节课",
    "第八、九节": "第八、九节课", "第九节": "第九节课", "晚自习第一节": "第九节课",
    "第十节": "第十节课", "晚自习第二节": "第十节课", "第十一节": "第十一节课", "就寝": "就寝"
  }[period] || period;
}

function searchableLinks(record) {
  const query = encodeURIComponent(`${record.title} ${record.artist}`);
  return [
    ["Apple Music", `https://music.apple.com/cn/search?term=${query}`],
    ["网易云音乐", `https://music.163.com/#/search/m/?s=${query}&type=1`],
    ["QQ 音乐", `https://y.qq.com/n/ryqq/search?w=${query}`],
    ["Spotify", `https://open.spotify.com/search/${query}`]
  ];
}

function renderPlatformLinks(record, compact = false) {
  const icons = { "Apple Music": "", "网易云音乐": "云", "QQ 音乐": "Q", Spotify: "●" };
  const classes = { "Apple Music": "apple", "网易云音乐": "netease", "QQ 音乐": "qq", Spotify: "spotify" };
  return `<div class="platform-links">${searchableLinks(record).map(([name, url]) =>
    `<a class="platform-link platform-${classes[name]}" href="${url}" target="_blank" rel="noreferrer" title="在${name}中搜索${record.title}"><span class="platform-icon" aria-hidden="true">${icons[name]}</span>${compact ? name.replace("音乐", "") : name} ↗</a>`
  ).join("")}</div>`;
}

function eligibleRecords() {
  return records.filter((record) => record.audio && inActiveRange(record.month));
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
  $("#audio-status").textContent = "先听一段，再根据记忆选择月份和课间。";
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
  $("#memory-audio-status").textContent = "点击左侧星球播放。";
}

function renderChoices() {
  const { start, end } = activeRange();
  const months = [];
  for (let serial = monthSerial(start); serial <= monthSerial(end); serial += 1) {
    const year = Math.floor(serial / 12);
    const month = String(serial % 12 + 1).padStart(2, "0");
    months.push(`${year}-${month}`);
  }
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
  const memories = getMemories(recordId);
  return memories.length
    ? memories.map((memory) => `<article class="memory-item"><p>${escapeHtml(memory.content)}</p><small>本机记录 · ${memory.date}</small></article>`).join("")
    : `<p class="audio-status">这台设备上还没有与这首铃声有关的回忆。</p>`;
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
      <div class="result-heading"><h3>${record.title}</h3><span class="result-artist">${record.artist}</span></div>
      <p class="answer-line"><strong>${record.month.replace("-", " 年 ")} 月</strong><span>·</span><strong>${periodLabel(record.period)}</strong></p>
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

function renderArchive() {
  const showAll = $("#archive-show-all").checked;
  const shown = (showAll ? records : eligibleRecords()).slice().sort((a, b) => a.month.localeCompare(b.month));
  const linkedMonths = Object.keys(monthPlaylists).filter((month) => showAll || inActiveRange(month));
  const visibleMonths = [...new Set([...shown.map((record) => record.month), ...linkedMonths])].sort();
  const years = visibleMonths.reduce((result, month) => {
    const year = month.slice(0, 4);
    (result[year] ||= {})[month] = [];
    return result;
  }, {});
  shown.forEach((record) => {
    const year = record.month.slice(0, 4);
    const yearGroup = years[year] ||= {};
    (yearGroup[record.month] ||= []).push(record);
  });

  $("#archive-list").innerHTML = Object.entries(years).map(([year, monthGroups]) => {
    const yearRecords = Object.values(monthGroups).flat();
    return `
      <details class="year-group">
        <summary><span>${year} 年</span><small>${Object.keys(monthGroups).length} 个月 · ${yearRecords.length} 首</small></summary>
        <div class="year-months">${Object.entries(monthGroups).map(([month, items]) => `
          <details class="month-group">
            <summary>
              <span>${Number(month.slice(5))} 月</span>
              <small>${items.length ? `${items.length} 首` : "曲目待整理"}</small>
            </summary>
            <div class="month-content">
              <div class="month-tools">${renderMonthPlaylist(month)}</div>
              ${items.length ? `<div class="archive-rows">${items.map((record) => `
                <article class="archive-row">
                  <span class="archive-period">${periodLabel(record.period)}</span>
                  <div class="archive-song"><h3>${record.title}</h3><p>${record.artist}</p></div>
                  <details class="archive-actions">
                    <summary>收听与校对</summary>
                    ${renderPlatformLinks(record, true)}
                    ${renderCorrectionForm(record)}
                  </details>
                </article>`).join("")}</div>` : `<p class="month-empty">已有网易云来源歌单，曲目与课间信息仍待导入和交叉验证。</p>`}
            </div>
          </details>`).join("")}</div>
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
$("#enrollment-confirm").addEventListener("click", () => {
  $(".enrollment-drawer").open = false;
});
$("#range-confirm").addEventListener("click", () => {
  $(".range-settings").open = false;
  $(".enrollment-drawer").open = false;
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
