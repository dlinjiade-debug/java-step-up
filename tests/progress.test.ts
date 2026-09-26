import test from "node:test";
import assert from "node:assert/strict";
import {
  emptyUserState,
  loadProgress,
  mergeProgress,
  previewImport,
  recordAnswer,
  saveProgress,
  serializeProgress,
  toggleBookmark,
} from "../src/lib/progressStorage.ts";
import type { Question } from "../src/types/question.ts";

const q: Question = {
  id: "J01-001",
  stage: "beginner",
  chapter: "表达式",
  point: "运算符",
  type: "single",
  difficulty: "基础",
  stem: "选择正确答案。",
  options: [{ id: "A", text: "A" }, { id: "B", text: "B" }],
  answer: "B",
  explanation: {
    reasoning: "按规则推导答案。",
    pitfall: "注意运算顺序。",
    takeaway: "先读题目条件。",
  },
};

test("recordAnswer creates durable per-question attempt state", () => {
  const state = recordAnswer(emptyUserState(), q, "A", false, 100);
  assert.deepEqual(state.progress["J01-001"], {
    questionId: "J01-001",
    attempts: 1,
    correctCount: 0,
    wrongCount: 1,
    status: "wrong",
    bookmarked: false,
    selectedAnswer: "A",
    updatedAt: 100,
  });
});

test("bookmarks toggle without changing other attempt fields", () => {
  const answered = recordAnswer(emptyUserState(), q, "B", true, 100);
  const saved = toggleBookmark(answered, q.id, 120);
  assert.equal(saved.progress[q.id]?.bookmarked, true);
  assert.equal(saved.progress[q.id]?.attempts, 1);
  assert.equal(toggleBookmark(saved, q.id, 140).progress[q.id]?.bookmarked, false);
});

test("merge keeps the strongest counters, unions bookmarks, and deduplicates sessions", () => {
  const local = emptyUserState();
  local.progress[q.id] = {
    questionId: q.id, attempts: 3, correctCount: 1, wrongCount: 2,
    status: "wrong", bookmarked: false, selectedAnswer: "A", updatedAt: 100,
  };
  local.sessions = [{ id: "s1", startedAt: 10, answered: 1, correct: 0 }];
  const incoming = emptyUserState();
  incoming.progress[q.id] = {
    questionId: q.id, attempts: 2, correctCount: 2, wrongCount: 0,
    status: "mastered", bookmarked: true, selectedAnswer: "B", updatedAt: 200,
  };
  incoming.sessions = [
    { id: "s1", startedAt: 10, answered: 4, correct: 2 },
    { id: "s2", startedAt: 20, answered: 2, correct: 2 },
  ];
  const merged = mergeProgress(local, incoming);
  assert.equal(merged.progress[q.id]?.attempts, 3);
  assert.equal(merged.progress[q.id]?.correctCount, 2);
  assert.equal(merged.progress[q.id]?.bookmarked, true);
  assert.equal(merged.progress[q.id]?.selectedAnswer, "B");
  assert.deepEqual(merged.sessions.map((session) => session.id).sort(), ["s1", "s2"]);
});

test("import preview counts known IDs and leaves unknown IDs out", () => {
  const incoming = emptyUserState();
  incoming.progress["J01-001"] = {
    questionId: "J01-001", attempts: 1, correctCount: 0, wrongCount: 1,
    status: "wrong", bookmarked: false, updatedAt: 50,
  };
  incoming.progress["J99-999"] = {
    questionId: "J99-999", attempts: 1, correctCount: 1, wrongCount: 0,
    status: "mastered", bookmarked: true, updatedAt: 60,
  };
  const result = previewImport(JSON.stringify(incoming), new Set(["J01-001"]));
  assert.equal(result.valid, true);
  if (result.valid) {
    assert.equal(result.knownCount, 1);
    assert.equal(result.unknownCount, 1);
    assert.deepEqual(Object.keys(result.state.progress), ["J01-001"]);
  }
});

test("invalid import is rejected with a readable error", () => {
  const result = previewImport("{broken", new Set([q.id]));
  assert.equal(result.valid, false);
  if (!result.valid) assert.match(result.error, /JSON|格式/i);
});

test("storage failures leave the question flow usable and report a warning", () => {
  const blockedStorage = {
    getItem() { throw new Error("blocked"); },
    setItem() { throw new Error("quota"); },
  };
  assert.match(loadProgress(blockedStorage).warning ?? "", /无法读取/);
  const saved = saveProgress(emptyUserState(), blockedStorage);
  assert.equal(saved.saved, false);
  assert.match(saved.warning ?? "", /保存失败/);
});

test("progress JSON uses a stable key order", () => {
  const state = emptyUserState();
  state.progress["J02-002"] = { questionId: "J02-002", attempts: 1, correctCount: 1, wrongCount: 0, status: "uncertain", bookmarked: false, updatedAt: 2 };
  state.progress["J01-003"] = { questionId: "J01-003", attempts: 2, correctCount: 1, wrongCount: 1, status: "wrong", bookmarked: true, updatedAt: 1 };
  const serialized = serializeProgress(state);
  assert.ok(serialized.indexOf("J01-003") < serialized.indexOf("J02-002"));
});
