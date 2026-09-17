# 铃声档案 MVP

一个本地运行的校园铃声回忆与档案原型。目前覆盖 103 个月：其中 31 个月共 318 条课次记录（可猜题 317 条，全部已匹配 30 秒预览），另外 72 个月只有网易云歌单曲目，标注为“课次待确认”。

默认以 2014 年入学为例，时间范围为 2014.07—2017.06。选择其他入学届别时，会自动采用“当年 7 月至三年后 6 月”；实验班、转学等情况可以直接修改起止月份。回忆题库与档案页共享这一范围。

## 快速开始

### 环境要求

- Python 3，用来启动本地静态服务器
- Node.js 18 或更高版本，仅在更新网易云数据或重建目录时需要
- 一个现代浏览器

### 启动 MVP

在仓库根目录执行：

```bash
cd school-bell-archive
python3 -m http.server 4173 --directory dist
```

然后打开 <http://127.0.0.1:4173/>。

如果 4173 端口已被占用，可以换一个端口，例如：

```bash
python3 -m http.server 4175 --directory dist
```

### 使用方式

1. 在“铃声回忆”页选择入学年份。默认范围是 2014.07—2017.06，也可以直接修改起止月份，适合实验班、转学等不同经历。
2. 页面会从当前时间范围中随机抽取一首铃声。先选择它所属的月份和课间，再点击“唤醒这段回忆”。
3. 提交后查看正确答案、歌曲信息和已有回忆；可以在本机写下自己的回忆。
4. 切换到“铃声档案”，按“年份 → 月份 → 歌单”展开历史资料。每个月会标明课次来源与可信度、可展开比对原帖原文或歌单简介原文，并给出直达出处（贴吧楼层或歌单）的链接。只有歌单曲目、还没确认课间的月份会列出曲目并说明“课次待确认”。默认为当前入学范围，也可以打开全部年份。
5. 在歌曲详情中可以提交年月、课次和说明的纠错意见，并打开 Apple Music 曲目页或网易云、QQ 音乐、Spotify 的搜索链接。答题结果里也能直接跳到该曲目的课次出处做核对。

回忆和纠错意见只保存在当前浏览器的 `localStorage` 中。同一台设备、同一浏览器可以保留数据，但目前不会同步给其他人。

## 音乐播放

当前版本不保存本地 MP3。已匹配 Apple 预览地址的记录会在答题前使用页面自己的播放器播放 30 秒预览；用户先听歌，再选择月份和课间，提交答案后才显示歌曲名称和其他音乐平台外链。

预览地址来自 Apple 的公开搜索结果，播放器界面由本页面控制，因此不会显示歌名和歌手。预览是否存在取决于 Apple 的地区目录和歌曲匹配结果；没有预览的记录仍保留在档案页，暂不进入 quiz。Apple Music、网易云、QQ 音乐和 Spotify 的其他入口目前仍按歌名和歌手生成搜索链接，命中 Apple 曲目的记录会额外保留精确曲目页链接。

这样可以避免把受版权保护的音频文件提交到仓库，也不需要为音频配置存储服务。

## 更新数据

以下命令都在 `school-bell-archive/` 目录执行。

### 曲库（页面读到的数据）

页面读取的曲库是 `dist/catalog.js`，由脚本生成，不要手改。它的来源有三份：

| 来源 | 文件 | 说明 |
|---|---|---|
| 贴吧原帖 | `data/tieba-slot-records.json` | 人工整理的课次级记录，含原帖链接、楼层、原文和可信度 |
| 网易云歌单简介 | `resource_netmusic/description-candidates.json` | 从歌单简介解析出的课次候选 |
| 网易云歌单快照 | `resource_netmusic/netease-metadata.json` | 抓取当天的曲目列表，用于补齐没有课次的月份 |

重建顺序（脚本之间有依赖：预览脚本需要先由曲库脚本产出中间文件，所以曲库脚本要跑两次）：

```bash
node scripts/fetch-netmusic-metadata.mjs      # 可选：刷新网易云快照
node scripts/build-merged-catalog.mjs         # 合并贴吧与网易云，产出复核用索引
node scripts/build-description-candidates.mjs # 解析歌单简介里的课次
node scripts/build-site-catalog.mjs           # 第一遍：产出 data/catalog-records.json
node scripts/fetch-apple-previews.mjs         # 抓取 30 秒预览与曲目页链接（有缓存，只补缺）
node scripts/build-site-catalog.mjs           # 第二遍：把预览地址写进 dist/catalog.js
```

`scripts/build-site-catalog.mjs` 会顺便写出两份复核材料：

- `data/catalog-review.md`：逐月的课次来源、可信度、可猜题数量，以及贴吧与网易云简介的课时冲突／歌名差异清单。建议提交。
- `data/catalog-records.json`：预览抓取脚本读取的中间产物，可由上面两条命令随时重建，已在 `.gitignore` 中排除。

抓取预览时 Apple 搜索接口会限流，返回的空结果不代表歌曲不存在；脚本会重试并退避，重复运行只会补抓缓存里还缺的曲目。抓取结果缓存在 `data/apple-previews.json`，建议提交，这样重建曲库时不必再打接口。

### 歌单索引

`resource_netmusic/歌单.md` 更新后，运行以下命令即可重建月份索引：

```bash
node scripts/build-netmusic-index.mjs
```

档案按“年份 → 月份 → 具体歌单”折叠展示，默认只显示当前选择的在校时间，也可切换为全部年份。

## 当前数据与记忆

- 铃声数据由 `data/tieba-slot-records.json` + 网易云快照生成到 `dist/catalog.js`。
- 课次来源分四档：贴吧原帖正文（A）、贴吧分段编号还原（B）、网易云歌单简介（C，待校友确认）、仅歌单曲目（无课次）。档案页和答题结果都会显示当前记录的档位。
- 用户写下的回忆保存在浏览器 `localStorage`，不会上传。
- “铃声档案”中的年月/课次校对也保存在浏览器 `localStorage`；可确认现有映射或提交不同年月、课次及说明。
- 本地版无法展示其他设备上的回忆；未来接入数据库后再改为共享记忆墙。
- 本地版同样无法汇总其他设备的校对票；公开投票、去重和审核需要后端数据库。

## 当前 MVP 的边界

- 没有用户系统、数据库或部署配置。
- 回忆与纠错数据不会上传，也不能跨设备共享。
- 网易云歌单反映抓取时的公开状态；删歌、改版、remix 和历史顺延需要人工核验。
- 网易云简介里的课次是歌单创建者写的，属于“待校友确认”档；档案页会显示原文供核对，不当作已确认结论。
- Apple 预览地址是抓取当天从 Apple 搜索接口拿到的签名链接，长期可能失效；失效后对应曲目会自动退出猜题池，但档案与平台外链不受影响。重新运行 `scripts/fetch-apple-previews.mjs` 即可补抓。
- `merged-catalog.json` 是来源合并结果，不代表所有歌曲的课次都已经确认；只有 31 个月有课次记录。
- 页面是静态文件，修改 `dist/` 后重新刷新浏览器即可看到结果。
- 原始贴吧网页和附件位于本地 `resource/`，默认不纳入 Git 跟踪；可发布的数据已经整理到 `resource_netmusic/`、`data/` 和 `dist/`。

## 开发检查

修改目录生成脚本后，可以先检查 JavaScript 语法：

```bash
node --check scripts/build-merged-catalog.mjs
node --check scripts/build-description-candidates.mjs
node --check scripts/build-site-catalog.mjs
node --check scripts/fetch-apple-previews.mjs
node --check dist/app.js
```

提交前建议确认没有意外的本地数据或临时文件：

```bash
git status --short
```

## 贴吧资料导入建议

先保存原帖正文，再做离线解析和人工校对。每条正式记录应保留原帖 URL、楼层或回复标识、原始文本和可信度。贴吧存在动态渲染及反爬行为，不建议把实时爬取作为页面运行时依赖。已保存的快照只包含当时视口附近的楼层，因此逐月补齐需要重新打开帖子并翻到对应页保存。
