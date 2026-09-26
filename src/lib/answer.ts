import type { Answer, Question } from "../types/question.ts";

export interface AnswerScore {
  correct: boolean | null;
  normalizedAnswer: Answer;
  automatic: boolean;
}

export function normalizeCodeOutput(text: string): string {
  const normalized = text.replace(/\r\n?/g, "\n");
  return normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized;
}

function normalizeSet(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function scoreAnswer(question: Question, submitted: Answer): AnswerScore {
  if (question.type === "debug") {
    return { correct: null, normalizedAnswer: submitted, automatic: false };
  }

  if (question.type === "multiple") {
    const selected = Array.isArray(submitted) ? normalizeSet(submitted) : normalizeSet([submitted]);
    const expected = Array.isArray(question.answer) ? normalizeSet(question.answer) : [question.answer];
    return {
      correct: selected.length === expected.length && selected.every((id, index) => id === expected[index]),
      normalizedAnswer: selected,
      automatic: true,
    };
  }

  if (question.type === "output") {
    const answer = Array.isArray(submitted) ? submitted.join("\n") : submitted;
    const expected = Array.isArray(question.answer) ? question.answer.join("\n") : question.answer;
    const normalizedAnswer = normalizeCodeOutput(answer);
    return {
      correct: normalizedAnswer === normalizeCodeOutput(expected),
      normalizedAnswer,
      automatic: true,
    };
  }

  const selected = Array.isArray(submitted) ? submitted[0] ?? "" : submitted;
  const expected = Array.isArray(question.answer) ? question.answer[0] ?? "" : question.answer;
  return { correct: selected === expected, normalizedAnswer: selected, automatic: true };
}
