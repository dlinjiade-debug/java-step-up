import type { Answer, Question } from "../types/question.ts";
import type { MasteryStatus, QuestionProgress, StudySession, UserState } from "../types/progress.ts";

export const PROGRESS_STORAGE_KEY = "java-step-up:progress:v1";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type ImportPreview =
  | { valid: true; state: UserState; knownCount: number; unknownCount: number }
  | { valid: false; error: string };

export function emptyUserState(): UserState {
  return { schemaVersion: 1, progress: {}, sessions: [] };
}

function cloneAnswer(answer: Answer): Answer {
  return Array.isArray(answer) ? [...answer] : answer;
}

export function recordAnswer(
  state: UserState,
  question: Question,
  answer: Answer,
  correct: boolean,
  now = Date.now(),
): UserState {
  const previous = state.progress[question.id];
  const correctCount = (previous?.correctCount ?? 0) + Number(correct);
  const wrongCount = (previous?.wrongCount ?? 0) + Number(!correct);
  const attempts = (previous?.attempts ?? 0) + 1;
  const status: MasteryStatus = correct
    ? (correctCount >= 2 ? "mastered" : "uncertain")
    : "wrong";
  return {
    ...state,
    progress: {
      ...state.progress,
      [question.id]: {
        questionId: question.id,
        attempts,
        correctCount,
        wrongCount,
        status,
        bookmarked: previous?.bookmarked ?? false,
        selectedAnswer: cloneAnswer(answer),
        updatedAt: now,
      },
    },
    lastQuestionId: question.id,
  };
}

export function toggleBookmark(state: UserState, questionId: string, now = Date.now()): UserState {
  const previous = state.progress[questionId];
  const next: QuestionProgress = previous
    ? { ...previous, bookmarked: !previous.bookmarked, updatedAt: now }
    : {
        questionId,
        attempts: 0,
        correctCount: 0,
        wrongCount: 0,
        status: "unseen",
        bookmarked: true,
        updatedAt: now,
      };
  return { ...state, progress: { ...state.progress, [questionId]: next } };
}

export function markMastered(state: UserState, questionId: string, now = Date.now()): UserState {
  const previous = state.progress[questionId];
  if (!previous) return state;
  return {
    ...state,
    progress: { ...state.progress, [questionId]: { ...previous, status: "mastered", updatedAt: now } },
  };
}

export function mergeProgress(current: UserState, incoming: UserState): UserState {
  const ids = new Set([...Object.keys(current.progress), ...Object.keys(incoming.progress)]);
  const progress: Record<string, QuestionProgress> = {};
  for (const id of ids) {
    const local = current.progress[id];
    const remote = incoming.progress[id];
    if (!local || !remote) {
      progress[id] = { ...(local ?? remote)! };
      continue;
    }
    const latest = remote.updatedAt >= local.updatedAt ? remote : local;
    progress[id] = {
      ...latest,
      attempts: Math.max(local.attempts, remote.attempts),
      correctCount: Math.max(local.correctCount, remote.correctCount),
      wrongCount: Math.max(local.wrongCount, remote.wrongCount),
      bookmarked: local.bookmarked || remote.bookmarked,
      selectedAnswer: latest.selectedAnswer ? cloneAnswer(latest.selectedAnswer) : undefined,
    };
  }

  const sessionsById = new Map<string, StudySession>();
  for (const session of [...current.sessions, ...incoming.sessions]) {
    const previous = sessionsById.get(session.id);
    if (!previous || session.answered > previous.answered) sessionsById.set(session.id, { ...session });
  }
  const sessions = [...sessionsById.values()].sort((a, b) => a.startedAt - b.startedAt);
  const lastQuestionId = incoming.lastQuestionId || current.lastQuestionId;
  return { schemaVersion: 1, progress, sessions, ...(lastQuestionId ? { lastQuestionId } : {}) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validProgress(value: unknown, id: string): value is QuestionProgress {
  if (!isRecord(value)) return false;
  const statuses: MasteryStatus[] = ["unseen", "wrong", "uncertain", "mastered"];
  return value.questionId === id
    && Number.isInteger(value.attempts) && Number(value.attempts) >= 0
    && Number.isInteger(value.correctCount) && Number(value.correctCount) >= 0
    && Number.isInteger(value.wrongCount) && Number(value.wrongCount) >= 0
    && statuses.includes(value.status as MasteryStatus)
    && typeof value.bookmarked === "boolean"
    && typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt)
    && (value.selectedAnswer === undefined || typeof value.selectedAnswer === "string" || (Array.isArray(value.selectedAnswer) && value.selectedAnswer.every((part) => typeof part === "string")));
}

function parseState(value: unknown): UserState | null {
  if (!isRecord(value) || value.schemaVersion !== 1 || !isRecord(value.progress) || !Array.isArray(value.sessions)) return null;
  const progress: Record<string, QuestionProgress> = {};
  for (const [id, entry] of Object.entries(value.progress)) {
    if (!validProgress(entry, id)) return null;
    progress[id] = { ...entry, ...(entry.selectedAnswer ? { selectedAnswer: cloneAnswer(entry.selectedAnswer) } : {}) };
  }
  const sessions = value.sessions as StudySession[];
  if (!sessions.every((session) => isRecord(session)
    && typeof session.id === "string"
    && typeof session.startedAt === "number"
    && Number.isInteger(session.answered) && session.answered >= 0
    && Number.isInteger(session.correct) && session.correct >= 0
    && (session.endedAt === undefined || typeof session.endedAt === "number"))) return null;
  if (value.lastQuestionId !== undefined && typeof value.lastQuestionId !== "string") return null;
  return { schemaVersion: 1, progress, sessions: sessions.map((session) => ({ ...session })), ...(value.lastQuestionId ? { lastQuestionId: value.lastQuestionId as string } : {}) };
}

function getStorage(storage?: StorageLike): StorageLike | undefined {
  if (storage) return storage;
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

export function loadProgress(storage?: StorageLike): { state: UserState; warning?: string } {
  const target = getStorage(storage);
  if (!target) return { state: emptyUserState(), warning: "浏览器未开放本地存储，当前学习进度无法持久保存。" };
  try {
    const raw = target.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return { state: emptyUserState() };
    const parsed = parseState(JSON.parse(raw));
    return parsed
      ? { state: parsed }
      : { state: emptyUserState(), warning: "本地学习记录格式无效，已为你开启空白进度。" };
  } catch {
    return { state: emptyUserState(), warning: "浏览器暂时无法读取学习进度，本次练习仍可继续。" };
  }
}

export function saveProgress(state: UserState, storage?: StorageLike): { saved: boolean; warning?: string } {
  const target = getStorage(storage);
  if (!target) return { saved: false, warning: "浏览器未开放本地存储，当前学习进度无法持久保存。" };
  try {
    target.setItem(PROGRESS_STORAGE_KEY, serializeProgress(state));
    return { saved: true };
  } catch {
    return { saved: false, warning: "进度保存失败，请导出备份或释放浏览器空间。" };
  }
}

export function serializeProgress(state: UserState): string {
  const orderedProgress = Object.fromEntries(Object.entries(state.progress).sort(([a], [b]) => a.localeCompare(b)));
  return JSON.stringify({ ...state, progress: orderedProgress });
}

export function previewImport(text: string, validIds: Set<string>): ImportPreview {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { valid: false, error: "备份文件不是有效的 JSON 格式。" };
  }
  const incoming = parseState(raw);
  if (!incoming) return { valid: false, error: "备份文件结构无效或版本不受支持。" };
  const entries = Object.entries(incoming.progress);
  const known = entries.filter(([id]) => validIds.has(id));
  const unknownCount = entries.length - known.length;
  const filtered = {
    ...incoming,
    progress: Object.fromEntries(known),
    lastQuestionId: incoming.lastQuestionId && validIds.has(incoming.lastQuestionId) ? incoming.lastQuestionId : undefined,
  };
  return { valid: true, state: filtered, knownCount: known.length, unknownCount };
}
