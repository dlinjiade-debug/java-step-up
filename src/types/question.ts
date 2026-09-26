export type StageId = "beginner" | "foundation" | "advanced" | "internals" | "comprehensive";
export type QuestionType = "single" | "multiple" | "output" | "debug";
export type Difficulty = "基础" | "巩固" | "综合";
export type Answer = string | string[];

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuestionExplanation {
  reasoning: string;
  optionAnalysis?: Record<string, string>;
  pitfall: string;
  takeaway: string;
}

export interface Question {
  id: string;
  stage: StageId;
  chapter: string;
  point: string;
  type: QuestionType;
  difficulty: Difficulty;
  stem: string;
  code?: string;
  languageVersion?: 21;
  options?: QuestionOption[];
  answer: Answer;
  explanation: QuestionExplanation;
  references?: string[];
}
