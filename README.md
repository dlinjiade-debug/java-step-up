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

### 在 iPhone 上通过局域网访问

先在电脑构建生产版本，再启动局域网预览：

```bash
npm run build
npm run preview:lan
```

确保电脑和 iPhone 连接到同一个 Wi‑Fi（不要使用访客网络），然后在 iPhone Safari 打开终端输出中的 `Network` 地址。不要使用 `127.0.0.1`，它在手机上指向手机自身。如果 Windows 防火墙拦截连接，需要允许 Node.js 在专用网络接收连接。

此方式在中国大陆本地网络中可直接访问，不依赖境外 CDN、字体或 API。局域网 IP 使用 HTTP，适合在线刷题和本机保存；Service Worker 离线缓存需要 HTTPS。要让任意大陆网络都能访问，需要配置境内主机、域名和 ICP 备案，单靠本地电脑无法提供公网访问。

## 校验与题库维护

```bash
npm test
npm run check:content -- --full
npm run check:java
npm run check:answers
```

`check:content` 会检查题目字段、ID、阶段配额、题型、答案引用、解析和 Java 版本。`check:java` 检查代码片段的引号、注释和括号结构。`check:answers` 使用 JDK 编译并运行全部代码输出题，核对实际输出与参考答案；代码纠错题故意包含错误，不参与编译核对。

题库位于 `src/data/questions/`，每个阶段一个 JSON 文件。需要重建完整题库时运行：

```bash
npm run generate:bank
npm run check:content -- --full
```

生成器会保留每阶段原有的试点题，并稳定地重新生成其余题目。题目契约定义在 `src/types/question.ts`。

完整题目、选项、答案和解析可阅读 [300 题修订版](./docs/optimized-java-300-questions.md)。重新生成题库后运行 `npm run export:bank` 更新文档。

## 学习记录与离线使用

答题进度、收藏和错题状态保存在当前设备当前浏览器的本地存储中，不需要账户或服务器，也不会上传。个人页可以导出 JSON 备份；导入会先展示内容，再与本机记录合并。不同设备之间需要手动传递备份文件。

PWA 首次加载需要网络。使用 Safari 打开部署后的网站，选择“分享 → 添加到主屏幕”；应用缓存题库后，可离线继续学习。发布新版本时，Service Worker 会在后台更新缓存。

## 发布到 GitHub Pages

项目已提供 Pages 构建命令与 GitHub Actions 工作流。推送到 main、master 或 feat/java-step-up 后会自动构建并发布；首次使用时，在 GitHub 仓库的 Settings / Pages 中把发布来源设为 GitHub Actions。操作说明、可见性和隐私范围见 [GitHub Pages 部署说明](./docs/github-pages.md)。

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
