# Java 阶梯

面向手机端的 Java 交互题库，按入门、基础、进阶、深入、综合五个阶段学习，适合在 iPhone 15 Pro 的 Safari 中使用，也可添加到主屏幕作为独立 PWA。

题库共有 300 道原创练习，阶段配额为 **60 / 80 / 80 / 50 / 30**。题目覆盖单选、多选、代码输出和代码纠错；每题按知识点、难度和章节组织，并提供推理、易错点与记忆要点。代码示例以 Java 21 为准。

## 本地运行

需要 Node.js 22.12 或更新的 LTS 版本，以及 npm 10 或更新版本。

```bash
npm install
npm run dev
```

Vite 会输出本机访问地址。生产构建与本地预览：

```bash
npm run build
npm run preview
```

## 校验与题库维护

```bash
npm test
npm run check:content -- --full
npm run check:java
```

`check:content` 会检查题目字段、ID、阶段配额、题型、答案引用、解析和 Java 版本。`check:java` 检查题目代码片段的引号、注释和括号结构；它不编译片段，因为代码纠错题会故意包含错误，其他题目的代码也以页面中的片段形式呈现。

题库位于 `src/data/questions/`，每个阶段一个 JSON 文件。需要重建完整题库时运行：

```bash
npm run generate:bank
npm run check:content -- --full
```

生成器会保留每阶段原有的试点题，并稳定地重新生成其余题目。题目契约定义在 `src/types/question.ts`。

## 学习记录与离线使用

答题进度、收藏和错题状态保存在当前浏览器的本地存储中，不需要账户或服务器。个人页可以导出 JSON 备份；导入会先展示内容，再与本机记录合并。不同设备之间需要手动传递备份文件。

PWA 首次加载需要网络。使用 Safari 打开部署后的网站，选择“分享 → 添加到主屏幕”；应用缓存题库后，可离线继续学习。发布新版本时，Service Worker 会在后台更新缓存。

## 主要目录

```text
src/
  components/       题目、导航、代码块、解析和进度组件
  data/questions/   五阶段 JSON 题库
  lib/              判分、本地进度与备份逻辑
  pages/            学习、练习、错题和个人页
  styles/           深色设计令牌与响应式样式
scripts/            题库生成与内容结构校验
tests/              Node 内置测试
docs/superpowers/   产品规格、实现计划和 Figma 设计参考
```
