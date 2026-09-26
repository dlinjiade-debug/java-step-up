import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stages = [
  ["入门", "01-beginner.json"],
  ["基础", "02-foundation.json"],
  ["进阶", "03-advanced.json"],
  ["深入", "04-internals.json"],
  ["综合", "05-comprehensive.json"],
];
const typeNames = { single: "单选", multiple: "多选", output: "代码输出", debug: "代码纠错" };
const sections = ["# Java 阶梯题库 · 300 题完整修订版", ""];
let total = 0;

for (const [stageName, filename] of stages) {
  const questions = JSON.parse(await readFile(path.join(root, "src/data/questions", filename), "utf8"));
  sections.push(`## ${stageName} · ${questions.length} 题`, "");
  let chapter = "";
  for (const question of questions) {
    total += 1;
    if (chapter !== question.chapter) {
      chapter = question.chapter;
      sections.push(`### ${chapter}`, "");
    }
    sections.push(`#### ${question.id} · ${typeNames[question.type]} · ${question.difficulty}`, "", question.stem, "");
    if (question.code) sections.push("```java", question.code, "```", "");
    if (question.options) {
      for (const option of question.options) sections.push(`${option.id}. ${option.text}`);
      sections.push("");
    }
    if (question.type === "output") {
      sections.push("**参考答案**", "", "```text", question.answer, "```", "");
    } else {
      const answer = Array.isArray(question.answer) ? question.answer.join("、") : question.answer;
      sections.push(`**参考答案：** ${answer}`, "");
    }
    sections.push(`**解析：** ${question.explanation.reasoning}`, "");
    if (question.explanation.optionAnalysis) {
      for (const option of question.options) {
        sections.push(`- ${option.id}：${question.explanation.optionAnalysis[option.id]}`);
      }
      sections.push("");
    }
    sections.push(`**易错点：** ${question.explanation.pitfall}`, "", `**知识小结：** ${question.explanation.takeaway}`, "");
  }
}

if (total !== 300) throw new Error(`题目数量应为 300，实际为 ${total}`);
const destination = path.join(root, "docs/optimized-java-300-questions.md");
await writeFile(destination, `${sections.join("\n").trimEnd()}\n`, "utf8");
console.log(`已导出 ${total} 道完整题目：${destination}`);
