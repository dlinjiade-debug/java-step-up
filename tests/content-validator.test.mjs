import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { checkStageCounts, fullCounts, validateQuestions } from "../scripts/validate-content.mjs";

const baseQuestion = {
  id: "J01-001",
  stage: "beginner",
  chapter: "表达式",
  point: "运算符",
  type: "single",
  difficulty: "基础",
  stem: "哪项正确？",
  options: [{ id: "A", text: "甲" }, { id: "B", text: "乙" }],
  answer: "B",
  explanation: { reasoning: "推导答案。", pitfall: "留意类型。", takeaway: "遵守规则。" },
};

test("content validator reports duplicate IDs and invalid answer references", () => {
  const duplicate = { ...baseQuestion, id: "J01-001", answer: "Z" };
  const errors = validateQuestions([baseQuestion, duplicate]);
  assert.ok(errors.some((error) => /重复 ID/.test(error)));
  assert.ok(errors.some((error) => /答案.*选项/.test(error)));
});

test("content validator requires Java versions for code questions", () => {
  const codeQuestion = {
    ...baseQuestion,
    id: "J01-002",
    type: "output",
    options: undefined,
    answer: "1",
    code: "System.out.println(1);",
  };
  const errors = validateQuestions([codeQuestion]);
  assert.ok(errors.some((error) => /languageVersion|Java 版本/.test(error)));
});

test("pilot counts match the planned stage distribution", () => {
  const sample = [
    ...Array.from({ length: 6 }, (_, index) => ({ ...baseQuestion, id: `J01-${String(index + 1).padStart(3, "0")}`, stage: "beginner" })),
    ...Array.from({ length: 8 }, (_, index) => ({ ...baseQuestion, id: `J02-${String(index + 1).padStart(3, "0")}`, stage: "foundation" })),
    ...Array.from({ length: 8 }, (_, index) => ({ ...baseQuestion, id: `J03-${String(index + 1).padStart(3, "0")}`, stage: "advanced" })),
    ...Array.from({ length: 5 }, (_, index) => ({ ...baseQuestion, id: `J04-${String(index + 1).padStart(3, "0")}`, stage: "internals" })),
    ...Array.from({ length: 3 }, (_, index) => ({ ...baseQuestion, id: `J05-${String(index + 1).padStart(3, "0")}`, stage: "comprehensive" })),
  ];
  const result = checkStageCounts(sample, { beginner: 6, foundation: 8, advanced: 8, internals: 5, comprehensive: 3 });
  assert.deepEqual(result.errors, []);
  assert.equal(Object.values(result.counts).reduce((sum, count) => sum + count, 0), 30);
});

test("the shipped question bank contains the full 300-question stage distribution", async () => {
  const filenames = [
    "01-beginner.json",
    "02-foundation.json",
    "03-advanced.json",
    "04-internals.json",
    "05-comprehensive.json",
  ];
  const root = new URL("../src/data/questions/", import.meta.url);
  const questions = [];
  for (const filename of filenames) questions.push(...JSON.parse(await readFile(new URL(filename, root), "utf8")));

  assert.equal(questions.length, 300);
  assert.deepEqual(validateQuestions(questions), []);
  assert.deepEqual(checkStageCounts(questions, fullCounts).errors, []);
});
