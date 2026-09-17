# 瑞安中学校铃曲目总表（第二轮校对稿）

更新日期：2026-09-17  
整理范围：当前 `resource/` 中保存的贴吧页面、图片及 `resource.md` 人工转录内容，以及 `resource_netmusic/` 中的网易云歌单快照与简介。

## 阅读说明

可信度标记：

- **A｜明确**：原帖正文直接写明月份、课间、歌名和歌手。
- **B｜基本明确**：来自原帖发布者或歌单图片，但部分标签需要根据顺序还原。
- **C｜待确认**：只有歌单曲序，无法从现有页面确定对应课间。
- **未播放**：曾进入计划歌单，但原帖明确说明当月实际未播放。

本稿只把原帖发布者公布的歌单、用户提供的人工转录和明确的歌单截图计入正式曲目。普通回帖中的“推荐”“想听”“求采纳”均未计入。

## 已录入页面的数据（2026-09-17）

贴吧原帖的课次级记录已从本稿抽成结构化文件 `data/tieba-slot-records.json`，与网易云歌单简介候选合并后生成页面读取的 `dist/catalog.js`。当前覆盖情况：

| 课次来源 | 月份数 | 说明 |
|---|---:|---|
| 贴吧原帖正文（A／B） | 9 | 2013.12、2014.06、2015.06、2015.09–2015.12、2017.08、2018.07 |
| ↳ 其中已与网易云简介逐条交叉校对 | 7 | 课次零冲突，页面标记为「已与贴吧交叉校对」 |
| 仅网易云歌单简介（无贴吧正文可对） | 22 | 2013.04、2013.08–2013.09、2014.01、2014.03–2014.05、2014.09–2014.12、2015.01、2015.03–2015.05、2016.01–2016.02、2016.04–2016.07、2016.09，属于 C 级「待校友确认」 |
| 仅网易云歌单曲目 | 72 | 只有曲序，页面按“课次待确认”列出曲目，不参与猜题 |

- 课次记录合计 318 条：其中 317 条课次写法能在猜题面板作答，318 条全部已匹配 Apple 30 秒预览；唯一被排除的是 2015.10 的 `Fire N Gold`，原帖写明当月计划但未播放。
- 歌单简介里的明显笔误按通行写法收录（例如 `I Took A Pill In Abiza` 实为 `Ibiza`），原始写法保留在记录的备注里。
- 每条记录都带出处：贴吧月份的记录指向原帖 URL、楼层和发布日，简介月份的记录指向歌单；档案页可展开原文，答题结果页可直接跳去核对。
- 贴吧与网易云简介同时覆盖的 7 个月已逐条校对，**课次零冲突**；仅 4 处歌名写法不同（`Nothin' on You`／`Nothing On You`、`This Summer's Gonna Hurt` 的完整标题、`Wildest Dreams`／`Wildest Dream`、`Last SummerS` 的单复数）。校对明细见 `data/catalog-review.md`。
- 2014.03、2014.05、2014.06、2014.09 四个月的简介把上午／下午／晚自习各自从“第一节”重新编号，已按全天连续课时还原（上午第一~五节、下午第一~三节等于第六~八节、晚自习第一~二节）。
- 2021.04 的歌单简介是补充说明而不是歌单，已排除，不计入 C 级候选。

## 本轮新增材料核对

| 保存页面 | 当前快照实际保留的楼层 | 可确认的正式歌单 | 处理结果 |
|---|---|---|---|
| `瑞中校铃_2017-2018` | 72–76 楼附近 | 2018.07，含课间对应 | 已纳入总表及 MVP 猜题库 |
| `瑞中校铃2018.8-2019.7` | 38–50 楼附近 | 2019.01，只有截图曲序 | 已纳入总表；暂不用于猜课间 |
| `瑞安中学下课铃2019.10月~2020年暑期` | 71–86 楼附近 | 2020.06，只有截图曲序 | 已纳入总表；暂不用于猜课间 |
| `【瑞中校铃】2020.9-2021暑期` | 35–57 楼附近 | 当前可见楼层未见正式歌单 | 暂列缺口，回帖推荐未收录 |

注意：这些离线页面并不是帖子的完整副本。贴吧采用虚拟滚动，未出现在保存瞬间视口附近的楼层只有占位元素，因此不能根据文件体积判断整帖已保存。

---

## 2013 年 12 月｜A

来源：贴吧帖 `2253394145` 第 63 楼，发布于 2013-12-01。

| 时段 | 歌曲 | 歌手 | 备注 |
|---|---|---|---|
| 早起 | Better Than I Know Myself | Adam Lambert |  |
| 第一节下课 | Applause | Lady Gaga |  |
| 第三节下课 | Beauty and a Beat | Justin Bieber |  |
| 第四节下课 | Red | Taylor Swift | 201312 班投稿 |
| 第五节下课 | International Smile | Katy Perry |  |
| 第六节下课 | Let Her Go | Passenger |  |
| 第七节下课 | Plan B | Kylee | 201316 班投稿 |
| 第八节下课 | Here's to Never Growing Up | Avril Lavigne | 201302 班投稿 |
| 晚自习第一节下课 | We Can't Stop | Miley Cyrus |  |
| 晚自习第二节下课 | Good Time | Owl City | 201301 班投稿 |
| 就寝 | Chasing Pavements | Adele |  |

网易云交叉核验：歌单 `445701417` 的简介同样列出上述 11 个时段，但 2026-09-16 的当前歌单只有前 10 首，`Chasing Pavements` 已不在其中。此处以历史简介和贴吧原帖保留就寝曲，不用当前歌单反向删除历史记录。

## 2014 年 6 月｜B

来源：贴吧帖 `2253394145` 第 129 楼，发布于 2014-06-29。原帖中的“第一、第二、第三节”出现重复，推测分别属于上午、下午、晚自习三个时段；请校友确认。

| 推测时段 | 歌曲 | 歌手 | 备注 |
|---|---|---|---|
| 早起 | You Raise Me Up | Westlife | 返场老歌 |
| 上午第一节下课 | Love You So | Natalie | 歌手具体版本待确认 |
| 上午第三节下课 | Mad | Ne-Yo |  |
| 上午第四节下课 | I Believe | Agnes Carlsson | 原帖拼作 `Clarlsson` |
| 上午第五节下课 | Where Is the Love? | The Black Eyed Peas |  |
| 下午第一节下课 | Lucky | Jason Mraz | 原帖拼作 `Marz` |
| 下午第二节下课 | Farewell | Rihanna |  |
| 下午第三节下课 | Burn It Down | Linkin Park |  |
| 晚自习第一节下课 | Hush Hush | The Pussycat Dolls |  |
| 晚自习第二节下课 | Nothin' on You | B.o.B |  |

原帖明确写着“这次选老歌”，并解释老歌可以包含以前放过的歌。回帖中有毕业班同学提到，`You Raise Me Up` 的返场很容易让高三学生产生毕业情绪。

## 2015 年 6 月｜A

来源：贴吧帖 `3323924877` 第 109 楼，发布于 2015-06-08。

| 时段 | 歌曲 | 歌手 | 备注 |
|---|---|---|---|
| 早起 | Can We Dance | The Vamps |  |
| 第一节 | Bad Blood | Taylor Swift |  |
| 第三节 | Go Hard or Go Home | Wiz Khalifa & Iggy Azalea | 《Furious 7》原声 |
| 第四节 | Big Girls Cry | Sia |  |
| 第五节 | Get Low | Dillon Francis & DJ Snake | 《Furious 7》原声 |
| 第六节 | Wear Me Out | Skylar Grey | 有回帖称军训时曾播放过 |
| 第七节 | Poison | Rita Ora |  |
| 第八、九节 | Shut Up and Dance | Walk the Moon |  |
| 第十节 | Evil in the Night | Adam Lambert |  |
| 第十一节 | This Summer's Gonna Hurt Like a Motherf***er | Maroon 5 | 标题含敏感词，公开展示时可采用洁净标题 |

有人问“怎么都开始用老歌了”，组织者回复这是一次“换届总结”。这可以成为六月专题题目的解释卡。

## 2015 年 9 月｜A（人工转录）

| 时段 | 歌曲 | 歌手 |
|---|---|---|
| 早起 | Go Big or Go Home | American Authors |
| 第一节 | Blank Space | Taylor Swift |
| 第三节 | Drag Me Down | One Direction |
| 第四节 | One Last Time | Ariana Grande |
| 第五节 | Uma Thurman | Fall Out Boy |
| 第六节 | Wings (Acoustic) | Birdy |
| 第七节 | Cheerleader | OMI |
| 第八、九节 | Honey, I'm Good | Andy Grammer |
| 第十节 | Rumors | Adam Lambert feat. Tove Lo |
| 第十一节 | Lean On | Major Lazer & DJ Snake feat. MØ |

网易云交叉核验：歌单 `448508597` 的首曲当前是 `Go Big Or Go Home (Taylor Wise Remix)`，而贴吧人工转录记录为 `Go Big Or Go Home`。曲名主体一致，但实际播放的是原版还是混音版仍需进一步确认。

## 2015 年 10 月｜A（人工转录）

| 时段 | 歌曲 | 歌手 | 实际播放 |
|---|---|---|---|
| 早起 | Invincible | Kelly Clarkson | 是 |
| 第一节 | Today's the Day | P!nk | 是 |
| 第三节 | Stitches | Shawn Mendes | 是 |
| 第四节 | Somebody | Natalie La Rose feat. Jeremih | 是 |
| 第五节 | Friend Zone | Danielle Bradbery | 是 |
| 第六节 | One Call Away | Charlie Puth | 是 |
| 第七节 | Style | Taylor Swift | 是 |
| 第九节 | Cannonball | Skylar Grey feat. X Ambassadors | 是 |
| 第十节 | Fire N Gold | Bea Miller | **否；顺延至 11 月** |
| 第十一节 | What Do You Mean? | Justin Bieber | 是 |

## 2015 年 11 月｜A（人工转录）

| 时段 | 歌曲 | 歌手 | 备注 |
|---|---|---|---|
| 早起 | I Don't Want to Go to Bed | Simple Plan feat. Nelly |  |
| 第一节 | Turnin' | Young Rising Sons |  |
| 第三节 | Something in the Way You Move | Ellie Goulding |  |
| 第四节 | Perfect | One Direction |  |
| 第五节 | Confident | Demi Lovato |  |
| 第六节 | Hello | Adele |  |
| 第七节 | Lay It All on Me | Rudimental feat. Ed Sheeran |  |
| 第九节 | Bang My Head | David Guetta feat. Sia & Fetty Wap |  |
| 第十节 | Fire N Gold | Bea Miller | 10 月未播放，移至本月 |
| 第十一节 | How Deep Is Your Love | Calvin Harris & Disciples | 原转录只写 Calvin Harris |

## 2015 年 12 月｜A（人工转录）

| 时段 | 歌曲 | 歌手 |
|---|---|---|
| 早起 | Get Over Me | Nick Carter feat. Avril Lavigne |
| 第一节 | Stand by You | Rachel Platten |
| 第三节 | Hoping for Snow | The Vamps |
| 第四节 | Wildest Dreams | Taylor Swift |
| 第五节 | Wolves | Rag'n'Bone Man |
| 第六节 | WILD | Troye Sivan |
| 第七节 | Boys Like You | Who Is Fancy feat. Meghan Trainor & Ariana Grande |
| 第九节 | A Head Full of Dreams | Coldplay |
| 第十节 | I Know What You Did Last Summer | Shawn Mendes & Camila Cabello |
| 第十一节 | Roses | The Chainsmokers feat. ROZES |

## 2017 年 8 月｜A

来源：贴吧帖 `4020077190` 第 164 楼，发布于 2017-08-04；同时附有网易云歌单截图。

| 时段 | 歌曲 | 歌手 | 备注 |
|---|---|---|---|
| 早起 | Numb | Linkin Park | 临时替换曲目 |
| 第一节 | Summer Vibe | Walk off the Earth |  |
| 第三节 | There for You | Martin Garrix & Troye Sivan |  |
| 第四节 | You Don't Know About Me | Ella Vos |  |
| 第五节 | Mr. Blue Sky | Electric Light Orchestra |  |
| 第六节 | Just Another Day | Lady Gaga |  |
| 第七节 | Didn't Stand a Chance | Travis Garland |  |
| 第九节 | So Stop the World | Emma Stevens |  |
| 第十节 | Strip That Down | Liam Payne feat. Quavo | 原帖只写 Liam Payne |
| 第十一节 | Mind over Matter (Acoustic) | PVRIS |  |

原帖说明：2017-07-20 Chester Bennington 去世后，组织者临时把原定早起铃换成 `Numb` 纪念他。回帖随后吐槽“起床铃会断”，这正好可以做成揭晓后的背景故事。

## 2018 年 7 月｜A

来源：`瑞中校铃_2017-2018` 第 72 楼，发布于 2018-07-10；附网易云歌单截图。

| 时段 | 歌曲 | 歌手 |
|---|---|---|
| 早起 | Don't You | Wonderful Humans |
| 第一节 | You Give Me Life | iLY |
| 第三节 | Lights Out | Virginia to Vegas |
| 第四节 | Tokyo | Truitt & Light House |
| 第五节 | Oops | Little Mix feat. Charlie Puth |
| 第六节 | Loving You Tonight | Andrew Allen |
| 第七节 | Girl with a Suntan | Jai Waetford |
| 第八节 | That's So Us | Allie X |
| 第十节 | We Don't Have To | Jai Waetford |
| 第十一节 | Closer (80s Remix) | TRONICBOX / The Chainsmokers / Halsey |

这是发帖者最后一次选铃。她在原帖中留下退任感言，提到从高一到高三、看到大家喜欢自己选的歌是最开心的事。可作为这一期的“选铃人手记”。

## 2019 年 1 月｜C

来源：`瑞中校铃2018.8-2019.7` 第 39 楼，发布于 2019-01-20。只有手机歌单截图，可确认曲序，不能从当前材料确认课间。

| 曲序 | 歌曲 | 歌手 | 课间 |
|---|---|---|---|
| 1 | Been There Done That | NOTD & Tove Styrke | 待确认 |
| 2 | Woman Like Me | Little Mix feat. Nicki Minaj | 待确认 |
| 3 | Everything I Need (Film Version) | Skylar Grey | 待确认 |
| 4 | Make It Beautiful | Minimonster | 待确认 |
| 5 | High Hopes | Panic! at the Disco | 待确认 |
| 6 | #0000FF | Jasmine Sokko | 待确认 |
| 7 | Brave | Fancy Cars | 待确认 |
| 8 | What We Started | Don Diablo / Steve Aoki / Lush & Simon | 待确认；完整艺人信息需核对 |
| 9 | Hello My Love | Westlife | 待确认 |
| 10 | Waiting for Tomorrow | Martin Garrix / Pierce Fulton / Mike Shinoda | 待确认 |

网易云交叉核验：歌单 `2624774963` 当前仍为上述 10 首。公开评论中，歌单创建者本人曾回复“可能有首不是的忘删了”；另有用户曾问“为什么有 11 首”。评论没有指出具体哪一首，因此整月继续保持 C，不根据当前曲序批量映射课次。

## 2020 年 6 月｜C

来源：`瑞安中学下课铃2019.10月~2020年暑期` 第 71 楼，发布于 2020-06-06。只有网易云歌单截图，可确认 11 首曲目及曲序，不能确认每个课间。

| 曲序 | 歌曲 | 歌手 | 课间 |
|---|---|---|---|
| 1 | Free Fall | Christopher | 待确认 |
| 2 | Feeling Good (American Idol Studio Version) | Adam Lambert | 待确认 |
| 3 | Sucker for You | Matt Terry | 待确认 |
| 4 | Supermarket Flowers | Ed Sheeran | 待确认 |
| 5 | No Promises | Cheat Codes feat. Demi Lovato | 待确认 |
| 6 | RISE | The Glitch Mob / Mako / The Word Alive | 待确认 |
| 7 | This Is Living (Double H Bootleg) | Double H / Hillsong Young & Free | 待确认 |
| 8 | FRIENDS | Marshmello & Anne-Marie | 待确认 |
| 9 | Believer | Imagine Dragons feat. Lil Wayne | 待确认；截图所示版本 |
| 10 | Strawberries & Cigarettes | Troye Sivan | 待确认 |
| 11 | To Die For (Ólafur Arnalds Remix) | Sam Smith & Ólafur Arnalds | 待确认 |

网易云交叉核验：歌单 `4915620341` 在 2026-09-16 只剩 9 首，当前缺少截图中的 `This Is Living (Double H Bootleg)` 与 `FRIENDS`。历史截图比当前平台状态更完整，因此两首继续保留在档案中。

---

## 可用于问答的背景与梗

### 1. 六月为什么经常出现老歌？

- 2014 年 6 月：原帖明确说明“这次选老歌”，允许曾经播放过的歌曲返场。
- 2015 年 6 月：有人问为什么又开始用老歌，组织者回答“换届总结”。
- 产品用法：六月题目揭晓后显示“毕业季返场”卡片，邀请用户写下第一次听到和再次听到这首歌的不同记忆。

### 2. 早起铃为什么只能听到一部分？

- 用户口述：学校周边小区投诉后，一些时期的早起音乐只能播放一部分。
- 帖吧旁证：2017 年 8 月 `Numb` 被安排为早起铃后，有人评论“起床铃会断”。
- 状态：具体从哪年哪月开始、截取时长和投诉发生时间仍需校友确认。

### 3. 铃声为什么不是什么歌都能放？

2013 年帖子中，组织者说明了当时的选歌原则：以英文流行音乐为主，避免说唱、过多电音和歌词不合适的歌曲；班级投稿需要附中文歌词翻译。普通回帖里的大量歌曲因此只能算“推荐”，不能视为实际播放记录。

### 4. 谁决定歌曲放在哪个课间？

2013 年帖子说明，班级只需提交符合条件的歌曲，不负责决定播放课间；最终时段由组织方安排。这意味着“班级投稿表”和“实际铃声表”是两种不同证据。

### 5. `Numb` 为什么临时成为早起铃？

2017 年 8 月原定早起铃在 Chester Bennington 去世后临时更换为 Linkin Park 的 `Numb`。这类记录应在普通答案之外增加“当月变更原因”。

---

## 仍然没有课次线索的月份

以下表示“当前没有可确认课次的材料”，不代表当时没有铃声。

**一、连歌单来源都缺的 52 个月**

- 2013.05–2013.07、2013.10–2013.11
- 2014.02、2014.07–2014.08
- 2015.02、2015.07–2015.08
- 2016.03、2016.08、2016.10–2016.12
- 2017.01–2017.07、2017.09–2018.06
- 2019.07–2019.08、2020.02、2020.04、2020.08、2021.08
- 2022.01–2022.03、2022.07–2022.08、2023.07–2023.08、2023.12、2024.07–2024.08、2025.06–2025.08

这些月份既没有贴吧正式公布楼层，网易云歌单索引里也没有对应月份。贴吧快照缺楼层的原因是新页面使用虚拟滚动：保存网页时只保存了当时屏幕附近的楼层，其他页虽然显示占位高度，正文并未写进 HTML。需要重新打开帖子并切换到对应页保存，或由熟悉的校友补录。

**二、有歌单曲目、但没有课次线索的 72 个月**

2018.08 之后到 2026.02 的大部分月份（含上表中能对上歌单的月份）目前只有歌单曲序，页面会把这些曲目按“课次待确认”列出，并保留歌单链接。要进入猜题池，需要拿到当时的课次说明、截图或校友确认。

## 请校友优先确认的问题

1. **2014 年 6 月时段**：原帖把上午／下午／晚自习各自从“第一节”重新编号。本站按“上午五节、下午三节、晚自习两节”的连续课时还原（`Where Is the Love?`=第五节、`Lucky`=第六节、`Farewell`=第七节、`Burn It Down`=第八节）。如果当年上午只有四节课，请指出正确课次。
2. **2015 年 10 月**：`Fire N Gold` 是否完全没有在 10 月播放，还是只缺了部分日期？猜歌题库现按“11 月实际播放”处理，10 月保留为“计划未播”。
3. **2015 年 9 月**：`Go Big or Go Home` 确认是 American Authors 的歌，而不是 2015 年 6 月出现的 `Go Hard or Go Home` 吗？两首名字很接近，建议重点核对。
4. **2016 年缺口**：2016.03、2016.08、2016.10–2016.12 是否还有歌单？或者能指出哪一页附近是正式公布楼层？
5. **早起铃投诉**：大概发生在哪个学年？当时是每天只放半首、降低音量，还是缩短了早起铃时长？
6. **2017 年 8 月**：这是暑期/军训歌单还是正式 8 月歌单？页面在按入学年份筛选时需要区分。
7. **第八、九节的命名**：不同时期出现“第八节”“第九节”“第八、九节”，而 2013–2014 年是“第一~第八节 + 晚自习第一、二节”。这是课表变化、合并播放，还是发帖人写法不同？页面已把“第八、九节”单列为「连堂」选项，但“上午／下午／晚上”分组仍按上午 1–4 节显示，需要确认后再统一。
8. **22 个只有网易云简介的月份**：这些简介是歌单创建者写的课次，属于 C 级待确认。是否能找到当时的班级通知、截图，或由当时的同学确认（尤其 2014.03、2014.05、2014.09 这三个月，简介同样分段重新编号）？
9. **2019 年之后的课次**：是否有当时的歌单截图、班级通知或组织者记录，可以确认每个课间对应的歌曲？

## 数据录入建议

正式进入网站的数据应保留以下字段：

```text
month
timeSlot
songTitle
artist
playStatus: played | planned-not-played | uncertain
confidence: A | B | C
sourceThread
sourceFloor
sourceDate
sourceImage
sourcePlaylist
sourcePlaylistDescription
sourcePlaylistSnapshotDate
storyNote
```

这样猜歌题库只抽取 `played` 且课间明确的记录，档案页则可以同时展示计划变更、返场原因和待考证内容。

### 网易云歌单与纠错证据

网易云材料需要拆成不同证据保存，不能只留一个链接：

- **歌单简介**：可能直接写明月份和课次，是历史映射证据。
- **当前曲目与曲序**：反映抓取当天仍在歌单中的内容；歌曲可能因版权或维护被删除。
- **评论**：可提供“实际播放过”“曾替换”“哪个课间”等线索，但只作为待投票核实的旁证。
- **合集/总榜**：用于框定年份范围和发现缺歌，不直接证明某一首歌的月份、课次。

用户纠错不直接覆盖档案结论。每一票应保存候选的 `month`、`timeSlot`、投票方向、可选说明和提交时间；系统根据票数与现有来源显示“待确认/较可信/已核实”，并保留原始来源与修改历史。

首次接口核查发现：网易云歌单 `445701417` 的简介列出 2013 年 12 月 11 个时段，但 2026-09-16 抓取时当前歌单只有 10 首，简介中的就寝曲 `Chasing Pavements` 已不在当前曲目中。这证明简介快照与当前曲目必须分别归档。

本次已把 `歌单.md` 中的 105 个唯一链接规范化为 101 个月度歌单和 4 个合集，并抓取到 `resource_netmusic/netease-metadata.json`：105 个均读取成功，56 个带简介，33 个带公开评论。该文件是 2026-09-16 的平台状态快照，不替代贴吧原帖、历史截图或校友投票。
