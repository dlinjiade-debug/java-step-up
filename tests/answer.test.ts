import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCodeOutput, scoreAnswer } from "../src/lib/answer.ts";
import type { Question } from "../src/types/question.ts";

const explanation = {
  reasoning: "逐步分析后可以得到正确结果。",
  pitfall: "不要忽略题目中的边界条件。",
  takeaway: "先写出执行顺序，再判断结果。",
};

function question(overrides: Partial<Question> = {}): Question {
  return {
    id: "J01-001",
    stage: "beginner",
    chapter: "表达式",
    point: "运算符",
    type: "single",
    difficulty: "基础",
    stem: "选择正确答案。",
    options: [
      { id: "A", text: "选项 A" },
      { id: "B", text: "选项 B" },
      { id: "C", text: "选项 C" },
    ],
    answer: "B",
    explanation,
    ...overrides,
  };
}

test("single choice requires the exact answer ID", () => {
  assert.equal(scoreAnswer(question(), "B").correct, true);
  assert.equal(scoreAnswer(question(), "A").correct, false);
});

test("multiple choice compares complete sets and ignores duplicate selections", () => {
  const q = question({ type: "multiple", answer: ["A", "C"] });
  assert.equal(scoreAnswer(q, ["C", "A", "A"]).correct, true);
  assert.equal(scoreAnswer(q, ["A"]).correct, false);
  assert.equal(scoreAnswer(q, ["A", "B", "C"]).correct, false);
});

test("code output normalizes line endings and only removes one final newline", () => {
  assert.equal(normalizeCodeOutput("12\r\n"), "12");
  assert.equal(normalizeCodeOutput("a\r\nb\n"), "a\nb");
  assert.equal(normalizeCodeOutput("a\n\n"), "a\n");
  assert.equal(normalizeCodeOutput("a  "), "a  ");
});

test("output answers are exact after newline normalization", () => {
  const q = question({ type: "output", options: undefined, answer: "12" });
  assert.equal(scoreAnswer(q, "12\r\n").correct, true);
  assert.equal(scoreAnswer(q, "1 2").correct, false);
});

test("debug questions are self-assessed instead of auto-scored", () => {
  const q = question({ type: "debug", options: undefined, answer: "将循环条件改为 i < values.length。" });
  const result = scoreAnswer(q, "我找到了数组越界问题");
  assert.equal(result.correct, null);
  assert.equal(result.automatic, false);
});
