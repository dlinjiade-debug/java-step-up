import type { Answer } from "./question.ts";

export type MasteryStatus = "unseen" | "wrong" | "uncertain" | "mastered";

export interface QuestionProgress {
  questionId: string;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  status: MasteryStatus;
  bookmarked: boolean;
  selectedAnswer?: Answer;
  updatedAt: number;
}

export interface StudySession {
  id: string;
  startedAt: number;
  endedAt?: number;
  answered: number;
  correct: number;
}

export interface UserState {
  schemaVersion: 1;
  progress: Record<string, QuestionProgress>;
  sessions: StudySession[];
  lastQuestionId?: string;
}
