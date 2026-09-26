# Java 阶梯题库 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `java-step-up/` 制作一个适配 iPhone 15 Pro 的独立 PWA Java 刷题站，含逐级课程、300 道高质量练习、本地学习记录与错题复习。

**Architecture:** React + TypeScript + Vite 前端单页应用，按阶段拆分为静态 JSON 题库；题库结构由运行时校验器检查，本地学习进度由单独存储模块读写。Vite PWA 插件预缓存应用与题目；首版没有登录、服务器或代码执行服务。

**Tech Stack:** React 19、TypeScript、Vite、vite-plugin-pwa、CSS、浏览器 LocalStorage/Blob/File APIs、Node 内置文件 API。

**Spec:** `docs/superpowers/specs/2026-09-26-java-step-up-design.md`

## Global Constraints

- 工作目录保持在 `D:\computer\java-step-up\`；不修改 408 网站的应用代码、题库或本地存储。
- 主要布局按 iPhone 15 Pro Safari 竖屏 393 × 852 CSS 像素设计，并为桌面浏览器适配。
- 主要触控区域至少 44 CSS 像素；代码框独立横向滚动；整页不横向溢出。
- 题目内容以原创为主；首版默认代码语言版本为 Java 21。
- 首版题量严格为 300：入门 60、基础 80、进阶 80、深入 50、综合 30。
- 进度只写入独立的 `java-step-up:progress:v1` 本地存储键；导入先预览并合并，不静默覆盖现有记录。
- 安装依赖只使用 React、TypeScript、Vite 与 PWA 插件；题目检查脚本只依赖 Node 内置模块。
- 在实现中运行 `npm run build` 检查 TypeScript 与生产构建；不建立或运行自动化测试套件。

## Review Focus

1. 损坏或结构不完整的导入文件不得覆盖本机学习进度；由进度模块提供字段完整检查与预览。
2. 多选题只能在所选答案集合与标准答案集合完全相同时判为正确；由题目判分函数实现。
3. 代码输出题应区分空白字符差异，同时容忍 CRLF/LF 差异；由代码答案标准化函数实现。
4. 浏览器拒绝 LocalStorage（例如私密模式或空间不足）时，答题页面仍可使用并显示进度未持久保存的提示；由存储读写适配层实现。
5. 空题库筛选、空错题本、空收藏、未知题目 ID 和失效上次练习 ID 都应得到可读空状态；由题库选择与页面状态实现。

---

### Task 1: 项目骨架与题目数据契约

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/types/question.ts`
- Create: `src/data/stages.ts`
- Create: `src/data/questions/index.ts`
- Create: `src/lib/answer.ts`
- Create: `scripts/validate-content.mjs`

**Interfaces:**
- `Question`: `{ id, stage, chapter, point, type, difficulty, stem, code?, languageVersion?, options?, answer, explanation, references? }`。`stage` 使用 `beginner | foundation | advanced | internals | comprehensive`；`type` 为 `single | multiple | output | debug`；`difficulty` 为 `基础 | 巩固 | 综合`；`code` 为字符串，出现代码时 `languageVersion` 必为 `21`；`options` 是 `{ id, text }[]`；`answer` 是选项 ID 字符串/字符串数组或输出参考字符串；`explanation` 是 `{ reasoning: string, optionAnalysis?: Record<string, string>, pitfall: string, takeaway: string }`；`references` 为可选的 URL 字符串数组。
- `STAGES`: 五个学习阶段及配额 `[60, 80, 80, 50, 30]`。试点配额为 `[6, 8, 8, 5, 3]`。
- `questionBank: Question[]` 与 `normalizeCodeOutput(text: string): string`。
- `npm run check:content -- --pilot` 校验 30 题试点；`npm run check:content -- --full` 校验全部阶段配额、ID 唯一性、四种题型覆盖、选项及答案引用、解析字段、代码版本字段和每题必需属性。

- [ ] 创建独立 Vite/React/TypeScript 入口和 npm 脚本 `dev`、`build`、`preview`、`check:content`。依赖范围对齐工作区已安装的 React 19、Vite 7、TypeScript 5 和 PWA 插件。
- [ ] 在 `src/types/question.ts` 定义题目、选项、题型、阶段、难度和解析的联合类型；在 `src/data/stages.ts` 固定阶段 ID、中文名、主题与题量配额。
- [ ] 在 `src/lib/answer.ts` 定义选择题及字符串题的准确判分和规范化函数；代码答案只把 CRLF 统一成 LF、忽略末尾一个换行，其他空格保持有效；题库索引先导出空 `questionBank`，供后续内容模块扩展。
- [ ] 在 `scripts/validate-content.mjs` 实现纯 Node JSON 加载与结构检查；无效数据以非零退出码并指出题目 ID 和字段。
- [ ] 在 `java-step-up` 执行 `npm run build`；预期 Vite 可启动生产构建。
- [ ] 提交项目骨架和数据契约。

### Task 2: 五阶段原创题库与内容校验

**Files:**
- Create: `src/data/questions/01-beginner.json`
- Create: `src/data/questions/02-foundation.json`
- Create: `src/data/questions/03-advanced.json`
- Create: `src/data/questions/04-internals.json`
- Create: `src/data/questions/05-comprehensive.json`
- Modify: `src/data/questions/index.ts`
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- 各题目文件导出前由 `questionBank` 索引读取；每题字段与 Task 1 的 `Question` 契约一致。
- 题目编号固定为 `J01-001` 至 `J05-030` 的阶段前缀格式；验证器检查各阶段题数精确匹配配额。

- [ ] 为五个阶段各撰写 `[6, 8, 8, 5, 3]` 道原创试点题；整体覆盖四种题型，每阶段至少有一道代码相关题；每题有解析、易错点、知识小结，涉及代码时标注语言版本。
- [ ] 按阶段把 JSON 文件汇入 `questionBank`；筛选答案、引用链接或重复 ID 的问题时给出精确诊断。
- [ ] 运行 `npm run check:content -- --pilot`；预期五阶段分布为 `[6, 8, 8, 5, 3]`，总计 30 题并通过结构校验。
- [ ] 提交题库与校验器。

### Task 3: 响应式外壳、首页与阶段导航

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/StageCard.tsx`
- Create: `src/components/ProgressRing.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/app.css`
- Modify: `src/main.tsx`
- Modify: `index.html`

**Interfaces:**
- `App` 管理 `learn | practice | wrong | me` 四个顶级页面及一个可恢复的最近题目。
- `StageCard` 接收 `{ stage, total, answered, correctRate, onClick }`。
- `ProgressRing` 接收 `{ value, label }`；超出 0–100 范围时将展示限制在有效范围。

- [ ] 建立暖白纸色、墨绿主色和珊瑚橙强调色的视觉令牌，完成四个页面的共用导航、顶部栏和空状态组件。
- [ ] 建立首页阶段卡片、继续学习入口、总体进度、每日建议和错题复习入口；每个按钮进入对应真实页面。
- [ ] 加入响应式断点、安全区 inset、`100dvh` 页面布局和 44 CSS 像素触控尺寸；窄屏没有整页横向滚动。
- [ ] 在 `index.html` 加上简体中文、主题色、移动视口 `viewport-fit=cover` 与站点描述。
- [ ] 运行 `npm run build`；预期首页构建通过。
- [ ] 提交页面外壳和首页。

### Task 4: 逐题答题、代码块和答案解析

**Files:**
- Create: `src/pages/PracticePage.tsx`
- Create: `src/components/QuestionCard.tsx`
- Create: `src/components/AnswerFeedback.tsx`
- Create: `src/components/CodeBlock.tsx`
- Create: `src/lib/highlightJava.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`

**Interfaces:**
- `PracticePage` 接收 `{ questions, initialQuestionId, onAnswer: (question: Question, submitted: string | string[], correct: boolean | null) => void, onBookmark: (questionId: string) => void }`。
- `QuestionCard` 按 `Question.type` 渲染单选、多选、输出预测和纠错自评；答案只在提交后揭示。
- `CodeBlock` 接收 `{ code: string, languageVersion?: number }`，保留纯文本复制，并允许代码容器独立横向滚动。
- `scoreAnswer(question: Question, submitted: string | string[]): { correct: boolean | null, normalizedAnswer: string | string[], automatic: boolean }` 为各题型共享判分接口；`debug` 的 `correct` 为 `null`，提交者查看解析后自评。

- [ ] 实现按阶段、章节、难度和题型筛选以及一道题一屏聚焦的答题页，空结果展示清楚的返回操作。
- [ ] 实现选项触控、提交、判分、解析、选项分析、上/下一题和题目收藏动作。
- [ ] 实现不依赖高亮服务的 Java 词法着色组件；代码块可读字号、行距和独立横向滚动；将易错字符串按 HTML 文本安全渲染。
- [ ] 为多选题比较去重后的完整答案集合；代码输出题规范化换行并保留行内空格。
- [ ] 运行 `npm run build`；预期各题型视图编译通过。
- [ ] 提交答题交互与解析。

### Task 5: 学习记录、错题本、收藏和数据备份

**Files:**
- Create: `src/types/progress.ts`
- Create: `src/lib/progressStorage.ts`
- Create: `src/pages/WrongPage.tsx`
- Create: `src/pages/MePage.tsx`
- Create: `src/components/ImportPreview.tsx`
- Modify: `src/App.tsx`
- Modify: `src/pages/PracticePage.tsx`

**Interfaces:**
- `UserState` 精确为 `{ schemaVersion: 1, progress: Record<string, QuestionProgress>, sessions: StudySession[], lastQuestionId?: string }`；`QuestionProgress` 为 `{ questionId, attempts, correctCount, wrongCount, status: "unseen" | "wrong" | "uncertain" | "mastered", bookmarked, selectedAnswer?, updatedAt }`；`StudySession` 为 `{ id, startedAt, endedAt?, answered, correct }`；`Answer = string | string[]`。
- `loadProgress(): { state: UserState, warning?: string }`；状态以 `schemaVersion: 1` 标记。
- `recordAnswer(state: UserState, question: Question, answer: Answer, correct: boolean, now?: number): UserState`。
- `toggleBookmark(state: UserState, questionId: string): UserState`。
- `previewImport(text: string, validIds: Set<string>): ImportPreview`；返回 `{ valid: true, state: UserState, knownCount, unknownCount }` 或 `{ valid: false, error: string }`。
- `mergeProgress(current: UserState, incoming: UserState): UserState`：答题数与正确数取较大值、收藏取并集、近况按时间戳合并、会话按 ID 去重。

- [ ] 实现 LocalStorage 读写、每次答题保存、独立键、存储异常告警、错题和熟练状态，以及稳定 JSON 导出。
- [ ] 实现错题和收藏列表、答题历史与分阶段进度；空列表显示可继续练习的入口。
- [ ] 实现文件选择、结构检查、导入预览、确认合并及无效文件错误提示；未知题目 ID 统计后忽略，不丢弃本机记录。
- [ ] 为 `localStorage` getter 或读写抛错的环境保留页面使用能力，并告知学习者刷新后进度可能无法保存。
- [ ] 运行 `npm run build`；预期学习记录、导入导出和空状态页面构建通过。
- [ ] 提交进度与备份功能。

### Task 6: PWA 离线缓存与主屏幕入口

**Files:**
- Modify: `vite.config.ts`
- Create: `public/manifest.webmanifest`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`
- Create: `public/icons/apple-touch-icon.png`
- Modify: `index.html`
- Modify: `src/App.tsx`

**Interfaces:**
- Vite PWA 插件提供独立 Java 网站的 manifest、预缓存和 service worker 注册。
- 页面可显示本地的在线/离线状态与简洁的 iOS“添加到主屏幕”说明。

- [ ] 配置 standalone 显示模式、应用名、绿白图标、主题色和 iOS touch icon；预缓存静态应用与内置题库。
- [ ] 处理首次未缓存、离线重载和缓存更新状态，避免将未缓存资源标记为可用。
- [ ] 运行 `npm run build`；预期 `dist/` 生成 manifest、图标及 service worker。
- [ ] 提交 PWA 配置。

### Task 7: 补齐完整 300 题

**Files:**
- Modify: `src/data/questions/01-beginner.json`
- Modify: `src/data/questions/02-foundation.json`
- Modify: `src/data/questions/03-advanced.json`
- Modify: `src/data/questions/04-internals.json`
- Modify: `src/data/questions/05-comprehensive.json`
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- `npm run check:content` 的终态输出为五阶段配额及 300 道总题量。

- [ ] 将试点扩充至五阶段最终配额 `[60, 80, 80, 50, 30]`；每题保持原创、覆盖阶段知识点、使用有意义的干扰项和解析，代码题标明 Java 21。
- [ ] 运行 `npm run check:content -- --full`；预期五阶段题数精确匹配配额、总计 300，四种题型与全部结构规则通过。
- [ ] 运行 `npm run build`；预期 300 题数据随 PWA 缓存编译完成。
- [ ] 提交完整题库。

### Task 8: 最终构建、移动端复查与文档

**Files:**
- Create: `README.md`
- Modify: `src/styles/app.css`
- Modify: `docs/superpowers/plans/2026-09-26-java-step-up.md`

**Interfaces:**
- README 提供 Node/npm 版本要求、安装/开发/构建命令、题库格式和 PWA 使用说明。
- `npm run check:content -- --full` 的终态输出为五阶段配额及 300 道总题量。

- [ ] 运行 `npm run check:content -- --full` 与 `npm run build`；预期 300 题校验和生产构建都成功，`dist/` 完整。
- [ ] 在本地开发服务器检查 iPhone 15 Pro 指定视口、代码长行滚动、底部安全区、无错题状态和复杂解析；逐处修复可复现的布局问题。
- [ ] 检查应用入口、构建产物及存储键都只属于 Java 子目录。
- [ ] 补全 README，标记本计划全部已完成，并提交最终整合。
- [ ] 在本地开发服务器检查 iPhone 15 Pro 指定视口、代码长行滚动、底部安全区、无错题状态和复杂解析；逐处修复可复现的布局问题。
- [ ] 检查应用入口、构建产物及存储键都只属于 Java 子目录。
- [ ] 补全 README，标记本计划全部已完成，并提交最终整合。
