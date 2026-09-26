import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "01-beginner.json",
  "02-foundation.json",
  "03-advanced.json",
  "04-internals.json",
  "05-comprehensive.json",
];

function findStructureErrors(source) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  let state = "code";
  let line = 1;
  let startLine = 1;
  const errors = [];

  for (let index = 0; index < source.length; index += 1) {
    const current = source[index];
    const next = source[index + 1];
    if (current === "\n") line += 1;

    if (state === "line-comment") {
      if (current === "\n") state = "code";
      continue;
    }
    if (state === "block-comment") {
      if (current === "*" && next === "/") { state = "code"; index += 1; }
      continue;
    }
    if (state === "string" || state === "char") {
      if (current === "\\") { index += 1; continue; }
      if ((state === "string" && current === '"') || (state === "char" && current === "'")) state = "code";
      else if (current === "\n") errors.push(`第 ${startLine} 行：字符串或字符字面量没有结束。`);
      continue;
    }
    if (state === "text-block") {
      if (current === "\\") { index += 1; continue; }
      if (current === '"' && source.slice(index, index + 3) === '"""') { state = "code"; index += 2; }
      continue;
    }

    if (current === "/" && next === "/") { state = "line-comment"; index += 1; continue; }
    if (current === "/" && next === "*") { state = "block-comment"; startLine = line; index += 1; continue; }
    if (current === '"' && source.slice(index, index + 3) === '"""') { state = "text-block"; startLine = line; index += 2; continue; }
    if (current === '"') { state = "string"; startLine = line; continue; }
    if (current === "'") { state = "char"; startLine = line; continue; }

    if ("([{".includes(current)) stack.push({ token: current, line });
    else if (Object.hasOwn(pairs, current)) {
      const opening = stack.pop();
      if (!opening || opening.token !== pairs[current]) errors.push(`第 ${line} 行：${current} 没有匹配的开括号。`);
    }
  }

  if (state === "block-comment") errors.push(`第 ${startLine} 行：块注释没有结束。`);
  if (state === "string" || state === "char" || state === "text-block") errors.push(`第 ${startLine} 行：字面量没有结束。`);
  for (const opening of stack) errors.push(`第 ${opening.line} 行：${opening.token} 没有匹配的闭括号。`);
  return errors;
}

const problems = [];
let snippetCount = 0;
for (const filename of files) {
  const questions = JSON.parse(await readFile(path.join(root, "src/data/questions", filename), "utf8"));
  for (const question of questions) {
    if (question.code === undefined) continue;
    snippetCount += 1;
    if (question.languageVersion !== 21) problems.push(`${question.id}: Java 代码应标记为 Java 21。`);
    for (const error of findStructureErrors(question.code)) problems.push(`${question.id}: ${error}`);
  }
}

if (problems.length > 0) {
  console.error(`代码片段结构校验失败（${problems.length} 项）：`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`代码片段结构校验通过：${snippetCount} 段 Java 21 代码。`);
  console.log("检查范围：引号、注释与括号配对；题目中的代码片段不是独立编译单元。" );
}
