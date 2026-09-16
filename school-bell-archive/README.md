# 铃声档案 MVP

一个本地运行的校园铃声回忆与档案原型。目前收录 8 个月、80 条课间对应明确的记录。

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
4. 切换到“铃声档案”，按“年份 → 月份 → 歌单”展开历史资料。默认展示当前入学范围，也可以打开全部年份。
5. 在歌曲详情中可以提交年月、课次和说明的纠错意见，并打开网易云、QQ 音乐或 Spotify 的搜索链接。

回忆和纠错意见只保存在当前浏览器的 `localStorage` 中。同一台设备、同一浏览器可以保留数据，但目前不会同步给其他人。

## 音乐播放

当前版本不保存本地 MP3。已匹配网易云歌曲 ID 的记录会在答题前使用网易云官方外链播放器播放；用户先听歌，再选择月份和课间，提交答案后才显示歌曲名称和其他音乐平台外链。

播放器的可用性取决于网易云当前的版权、地区和登录状态。外链播放器可能在播放器内部显示歌曲信息，因此后续如果要做到完全不泄露答案，需要使用平台提供的音频预览接口或自建合法音频预览。Apple Music、网易云、QQ 音乐和 Spotify 的其他入口目前仍按歌名和歌手生成搜索链接。铃声档案页也会显示这些外链。

这样可以避免把受版权保护的音频文件提交到仓库，也不需要为音频配置存储服务。当前只有已经匹配精确网易云歌曲 ID 的记录进入 quiz；其余记录仍保留在档案页，待补充播放源。

## 更新数据

以下命令都在 `school-bell-archive/` 目录执行。

`resource_netmusic/歌单.md` 更新后，运行以下命令即可重建月份索引：

```bash
node scripts/build-netmusic-index.mjs
```

档案按“年份 → 月份 → 具体歌单”折叠展示，默认只显示当前选择的在校时间，也可切换为全部年份。

如需刷新网易云公开数据快照（名称、简介、当前曲序及统计信息），运行：

```bash
node scripts/fetch-netmusic-metadata.mjs
```

结果写入 `resource_netmusic/netease-metadata.json`。它记录抓取时的平台状态，不能覆盖历史截图或贴吧原帖。

两个 resource（贴吧原始索引与网易云歌单）合并后的主数据是 `resource_netmusic/merged-catalog.json`，人工检查用索引是 `resource_netmusic/merged-catalog.md`。其中已有课次记录沿用 `dist/app.js` 的结构化曲库，并以 `bell-catalog-draft.md` 交叉校对。在刷新网易云快照后运行：

```bash
node scripts/build-merged-catalog.mjs
```

合并结果保留三种状态：双来源匹配、仅当前网易云、仅贴吧历史记录；歌单简介中能识别出的“早起/第几节/就寝—歌曲”也会进入 `descriptionEntries`，原文同时保留。

如需把这些简介中的课次映射单独导出为待确认候选，运行：

```bash
node scripts/build-description-candidates.mjs
```

结果写入 `resource_netmusic/description-candidates.json` 和 `resource_netmusic/description-candidates.md`，当前共 208 条，全部保留原始简介行和对应歌单链接。

## 当前数据与记忆

- 铃声数据暂时维护在 `dist/app.js` 的 `records` 数组中。
- 用户写下的回忆保存在浏览器 `localStorage`，不会上传。
- “铃声档案”中的年月/课次校对也保存在浏览器 `localStorage`；可确认现有映射或提交不同年月、课次及说明。
- 本地版无法展示其他设备上的回忆；未来接入数据库后再改为共享记忆墙。
- 本地版同样无法汇总其他设备的校对票；公开投票、去重和审核需要后端数据库。

## 当前 MVP 的边界

- 没有用户系统、数据库或部署配置。
- 回忆与纠错数据不会上传，也不能跨设备共享。
- 网易云歌单反映抓取时的公开状态；删歌、改版、remix 和历史顺延需要人工核验。
- `merged-catalog.json` 是来源合并结果，不代表所有歌曲的课次都已经确认。
- 页面是静态文件，修改 `dist/` 后重新刷新浏览器即可看到结果。
- 原始贴吧网页和附件位于本地 `resource/`，默认不纳入 Git 跟踪；可发布的数据已经整理到 `resource_netmusic/` 和 `dist/`。

## 开发检查

修改目录生成脚本后，可以先检查 JavaScript 语法：

```bash
node --check scripts/build-merged-catalog.mjs
node --check scripts/build-description-candidates.mjs
```

提交前建议确认没有意外的本地数据或临时文件：

```bash
git status --short
```

## 贴吧资料导入建议

先保存原帖正文，再做离线解析和人工校对。每条正式记录应保留原帖 URL、楼层或回复标识、原始文本和可信度。贴吧存在动态渲染及反爬行为，不建议把实时爬取作为页面运行时依赖。
