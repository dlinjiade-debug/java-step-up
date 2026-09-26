import beginner from "./01-beginner.json";
import foundation from "./02-foundation.json";
import advanced from "./03-advanced.json";
import internals from "./04-internals.json";
import comprehensive from "./05-comprehensive.json";
import type { Question, StageId } from "../../types/question.ts";

export const questionBank: Question[] = [
  ...beginner,
  ...foundation,
  ...advanced,
  ...internals,
  ...comprehensive,
] as unknown as Question[];

export const questionsByStage = (stage: StageId) => questionBank.filter((question) => question.stage === stage);
export const questionById = (id: string) => questionBank.find((question) => question.id === id);
