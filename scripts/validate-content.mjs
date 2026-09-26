import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const pilotCounts = { beginner: 6, foundation: 8, advanced: 8, internals: 5, comprehensive: 3 };
export const fullCounts = { beginner: 60, foundation: 80, advanced: 80, internals: 50, comprehensive: 30 };
const stagePrefix = { beginner: "J01", foundation: "J02", advanced: "J03", internals: "J04", comprehensive: "J05" };
const files = [
  ["beginner", "01-beginner.json"],
  ["foundation", "02-foundation.json"],
  ["advanced", "03-advanced.json"],
  ["internals", "04-internals.json"],
  ["comprehensive", "05-comprehensive.json"],
];

const text = (value) => typeof value === "string" && value.trim().length > 0;
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);

export function validateQuestions(questions) {
  const errors = [];
  const seen = new Set();
  const allowedStages = new Set(Object.keys(stagePrefix));
  const allowedTypes = new Set(["single", "multiple", "output", "debug"]);
  const allowedDifficulties = new Set(["基础", "巩固", "综合"]);
  if (!Array.isArray(questions)) return ["题库必须是数组。"];

  for (const [index, question] of questions.entries()) {
    const at = isRecord(question) && text(question.id) ? question.id : `索引 ${index + 1}`;
    if (!isRecord(question)) {
      errors.push(`${at}: 题目必须是对象。`);
      continue;
    }
    if (!text(question.id)) errors.push(`${at}: 缺少题目 ID。`);
    if (seen.has(question.id)) errors.push(`${question.id}: 重复 ID。`);
    seen.add(question.id);
    if (!allowedStages.has(question.stage)) errors.push(`${at}: 未知阶段 ${String(question.stage)}。`);
    if (allowedStages.has(question.stage) && !new RegExp(`^${stagePrefix[question.stage]}-\\d{3}$`).test(question.id)) errors.push(`${at}: ID 与阶段前缀不匹配。`);
    if (!text(question.chapter)) errors.push(`${at}: 缺少章节。`);
    if (!text(question.point)) errors.push(`${at}: 缺少知识点。`);
    if (!allowedTypes.has(question.type)) errors.push(`${at}: 未知题型。`);
    if (!allowedDifficulties.has(question.difficulty)) errors.push(`${at}: 未知难度。`);
    if (!text(question.stem)) errors.push(`${at}: 缺少题干。`);
    if (!isRecord(question.explanation)
      || !text(question.explanation.reasoning)
      || !text(question.explanation.pitfall)
      || !text(question.explanation.takeaway)) errors.push(`${at}: 解析必须包含推理、易错点和知识小结。`);

    const hasCode = text(question.code);
    if (hasCode && question.languageVersion !== 21) errors.push(`${at}: Java 代码必须声明 languageVersion: 21。`);
    if (!hasCode && question.languageVersion !== undefined) errors.push(`${at}: 没有代码时不应声明 languageVersion。`);
    if (["output", "debug"].includes(question.type) && !hasCode) errors.push(`${at}: ${question.type} 题必须包含代码。`);
    if (question.references !== undefined && (!Array.isArray(question.references) || !question.references.every((url) => {
      try { return new URL(url).protocol === "https:"; } catch { return false; }
    }))) errors.push(`${at}: 参考资料必须为 HTTPS URL 数组。`);

    const hasOptions = Array.isArray(question.options);
    if (["single", "multiple"].includes(question.type)) {
      if (!hasOptions || question.options.length < 2) {
        errors.push(`${at}: 单选和多选题至少需要两个选项。`);
      } else {
        const optionIds = new Set();
        for (const option of question.options) {
          if (!isRecord(option) || !text(option.id) || !text(option.text)) errors.push(`${at}: 选项必须包含 ID 和文字。`);
          else if (optionIds.has(option.id)) errors.push(`${at}: 选项 ID ${option.id} 重复。`);
          else optionIds.add(option.id);
        }
        const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
        if (question.type === "single" && (Array.isArray(question.answer) || answers.length !== 1)) errors.push(`${at}: 单选题答案必须是一个选项 ID。`);
        if (question.type === "multiple" && (!Array.isArray(question.answer) || answers.length < 2)) errors.push(`${at}: 多选题答案必须是至少两个选项 ID。`);
        if (new Set(answers).size !== answers.length || answers.some((answer) => !optionIds.has(answer))) errors.push(`${at}: 答案引用了不存在或重复的选项 ID。`);
      }
    } else {
      if (question.options !== undefined) errors.push(`${at}: 输出题与纠错题不应携带选择选项。`);
      if (!text(question.answer)) errors.push(`${at}: 参考答案不能为空。`);
    }

    if (question.explanation?.optionAnalysis !== undefined) {
      if (!isRecord(question.explanation.optionAnalysis)) errors.push(`${at}: optionAnalysis 必须是对象。`);
      else for (const key of Object.keys(question.explanation.optionAnalysis)) {
        if (!question.options?.some((option) => option.id === key)) errors.push(`${at}: optionAnalysis 引用了不存在的选项 ${key}。`);
      }
    }
  }
  return errors;
}

export function checkStageCounts(questions, expectedCounts) {
  const counts = Object.fromEntries(Object.keys(fullCounts).map((stage) => [stage, 0]));
  for (const question of questions) if (question && counts[question.stage] !== undefined) counts[question.stage] += 1;
  const errors = [];
  for (const [stage, expected] of Object.entries(expectedCounts)) {
    if (counts[stage] !== expected) errors.push(`${stage}: 预期 ${expected} 题，实际 ${counts[stage]} 题。`);
  }
  return { counts, errors };
}

async function loadBank() {
  const bank = [];
  for (const [stage, filename] of files) {
    try {
      const parsed = JSON.parse(await readFile(path.join(root, "src/data/questions", filename), "utf8"));
      if (!Array.isArray(parsed)) throw new TypeError("文件根节点必须是数组");
      bank.push(...parsed);
    } catch (error) {
      throw new Error(`${stage} 题库无法读取：${error.message}`);
    }
  }
  return bank;
}

async function main() {
  const mode = process.argv.includes("--pilot") ? "pilot" : "full";
  const questions = await loadBank();
  const errors = validateQuestions(questions);
  const counts = checkStageCounts(questions, mode === "pilot" ? pilotCounts : fullCounts);
  errors.push(...counts.errors);
  const allTypes = new Set(questions.map((question) => question.type));
  for (const type of ["single", "multiple", "output", "debug"]) if (!allTypes.has(type)) errors.push(`题库缺少 ${type} 题型。`);
  for (const stage of Object.keys(fullCounts)) {
    if (!questions.some((question) => question.stage === stage && text(question.code))) errors.push(`${stage}: 至少需要一道代码题。`);
  }
  if (errors.length) {
    console.error(`题库校验失败（${errors.length} 项）：`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log(`题库校验通过：${questions.length} 道题。`);
  for (const [stage, count] of Object.entries(counts.counts)) console.log(`  ${stage}: ${count}`);
}

if (import.meta.url === `file://${process.argv[1]?.replaceAll("\\", "/")}` || process.argv[1]?.endsWith("validate-content.mjs")) {
  await main();
}
