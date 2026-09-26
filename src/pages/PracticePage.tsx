import { useEffect, useMemo, useState } from "react";
import { AnswerFeedback } from "../components/AnswerFeedback.tsx";
import { AppIcon } from "../components/AppIcon.tsx";
import { CodeBlock } from "../components/CodeBlock.tsx";
import { scoreAnswer } from "../lib/answer.ts";
import { STAGES } from "../data/stages.ts";
import type { Answer, Question, StageId } from "../types/question.ts";
import type { QuestionProgress } from "../types/progress.ts";

interface PracticePageProps {
  questions: Question[];
  initialQuestionId?: string;
  initialStage?: StageId | "all";
  progress: Record<string, QuestionProgress>;
  onAnswer: (question: Question, answer: Answer, correct: boolean) => void;
  onBookmark: (questionId: string) => void;
  onBack: () => void;
}

const typeLabels = { single: "单选", multiple: "多选", output: "代码输出", debug: "代码纠错" };

function answerText(answer: Answer) {
  return Array.isArray(answer) ? answer.join("、") : answer;
}

export function PracticePage({
  questions,
  initialQuestionId,
  initialStage = "all",
  progress,
  onAnswer,
  onBookmark,
  onBack,
}: PracticePageProps) {
  const [stageFilter, setStageFilter] = useState<StageId | "all">(initialStage);
  const [chapterFilter, setChapterFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | string[]>("");
  const [submitted, setSubmitted] = useState(false);
  const [selfRated, setSelfRated] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    setStageFilter(initialStage);
    setChapterFilter("all");
    setDifficultyFilter("all");
    setTypeFilter("all");
  }, [initialStage, initialQuestionId]);

  const chapters = useMemo(() => {
    const stageQuestions = stageFilter === "all" ? questions : questions.filter((question) => question.stage === stageFilter);
    return [...new Set(stageQuestions.map((question) => question.chapter))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  }, [questions, stageFilter]);

  const filteredQuestions = useMemo(() => questions.filter((question) =>
    (stageFilter === "all" || question.stage === stageFilter)
    && (chapterFilter === "all" || question.chapter === chapterFilter)
    && (difficultyFilter === "all" || question.difficulty === difficultyFilter)
    && (typeFilter === "all" || question.type === typeFilter),
  ), [questions, stageFilter, chapterFilter, difficultyFilter, typeFilter]);

  useEffect(() => {
    const target = filteredQuestions.findIndex((question) => question.id === initialQuestionId);
    setIndex(target >= 0 ? target : 0);
  }, [filteredQuestions, initialQuestionId]);

  const question = filteredQuestions[index];
  useEffect(() => {
    if (!question) return;
    setSelected(question.type === "multiple" ? [] : "");
    setSubmitted(false);
    setSelfRated(false);
    setCorrect(null);
    setInputError("");
  }, [question?.id]);

  const selectStage = (value: string) => {
    setStageFilter(value as StageId | "all");
    setChapterFilter("all");
    setIndex(0);
  };
  const nextQuestion = () => {
    if (index < filteredQuestions.length - 1) setIndex((current) => current + 1);
    else onBack();
  };

  if (filteredQuestions.length === 0) {
    return (
      <section className="page practice-page">
        <div className="practice-page__heading">
          <button className="icon-button" type="button" onClick={onBack} aria-label="返回学习"><AppIcon name="back" /></button>
          <span className="eyebrow">PRACTICE</span>
        </div>
        <div className="empty-state">
          <span className="empty-state__symbol"><AppIcon name="practice" size={26} /></span>
          <h2>这个筛选下还没有题目</h2>
          <p>试试换一个阶段或章节，继续向前练习。</p>
          <button className="button button--primary" type="button" onClick={() => { setStageFilter("all"); setChapterFilter("all"); setDifficultyFilter("all"); setTypeFilter("all"); }}>查看全部题目</button>
        </div>
      </section>
    );
  }

  if (!question) return null;
  const stage = STAGES.find((item) => item.id === question.stage)!;
  const questionProgress = progress[question.id];
  const selectedIds = Array.isArray(selected) ? selected : selected ? [selected] : [];
  const correctIds = Array.isArray(question.answer) ? question.answer : [question.answer];

  const handleSubmit = () => {
    const response: Answer = question.type === "multiple"
      ? selectedIds
      : question.type === "output" || question.type === "debug"
        ? (selected as string)
        : (selected as string);
    if ((Array.isArray(response) && response.length === 0) || (!Array.isArray(response) && !response.trim())) {
      setInputError(question.type === "multiple" ? "至少选择一个选项。" : "先写下你的答案，再提交。");
      return;
    }
    const result = scoreAnswer(question, response);
    setSubmitted(true);
    setCorrect(result.correct);
    setInputError("");
    if (result.correct !== null) onAnswer(question, result.normalizedAnswer, result.correct);
  };

  const selfAssess = (understood: boolean) => {
    const response = Array.isArray(selected) ? selected.join("\n") : selected;
    onAnswer(question, response, understood);
    setSelfRated(true);
    setCorrect(understood);
  };

  return (
    <section className="page practice-page">
      <header className="practice-toolbar">
        <button className="icon-button" type="button" onClick={onBack} aria-label="返回"><AppIcon name="back" /></button>
        <div className="practice-toolbar__title"><span>{stage.name} · 第 {index + 1} 题</span><small>{filteredQuestions.length} 题一组</small></div>
        <button
          className={`icon-button${questionProgress?.bookmarked ? " icon-button--saved" : ""}`}
          type="button"
          onClick={() => onBookmark(question.id)}
          aria-label={questionProgress?.bookmarked ? "取消收藏" : "收藏题目"}
          aria-pressed={questionProgress?.bookmarked ?? false}
        ><AppIcon name="bookmark" /></button>
      </header>

      <div className="practice-progress-row"><span>本组进度</span><strong>{String(index + 1).padStart(2, "0")} / {String(filteredQuestions.length).padStart(2, "0")}</strong></div>
      <div className="progress-track" aria-hidden="true"><span style={{ width: `${((index + 1) / filteredQuestions.length) * 100}%` }} /></div>

      <details className="filter-panel">
        <summary><span>筛选题目</span><span>{[stageFilter, chapterFilter, difficultyFilter, typeFilter].filter((value) => value !== "all").length ? "已应用" : "阶段 · 章节 · 难度 · 题型"}</span></summary>
        <div className="filter-grid">
          <label>阶段<select value={stageFilter} onChange={(event) => selectStage(event.target.value)}><option value="all">全部阶段</option>{STAGES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
          <label>章节<select value={chapterFilter} onChange={(event) => { setChapterFilter(event.target.value); setIndex(0); }}><option value="all">全部章节</option>{chapters.map((chapter) => <option key={chapter}>{chapter}</option>)}</select></label>
          <label>难度<select value={difficultyFilter} onChange={(event) => { setDifficultyFilter(event.target.value); setIndex(0); }}><option value="all">全部难度</option>{["基础", "巩固", "综合"].map((difficulty) => <option key={difficulty}>{difficulty}</option>)}</select></label>
          <label>题型<select value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value); setIndex(0); }}><option value="all">全部题型</option>{Object.entries(typeLabels).map(([type, label]) => <option value={type} key={type}>{label}</option>)}</select></label>
        </div>
      </details>

      <div className="question-meta"><span className="question-meta__kind">{typeLabels[question.type]}</span><span>{question.difficulty}</span><span>{question.chapter}</span></div>
      <h1 className="question-stem">{question.stem}</h1>
      {question.code ? <CodeBlock code={question.code} languageVersion={question.languageVersion} /> : null}

      {(question.type === "single" || question.type === "multiple") ? (
        <fieldset className="answer-options" disabled={submitted}>
          <legend>{question.type === "multiple" ? "选择所有正确答案" : "选择一个答案"}</legend>
          {question.options?.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const isAnswer = correctIds.includes(option.id);
            const resultClass = submitted && isAnswer ? " answer-option--correct" : submitted && isSelected && !isAnswer ? " answer-option--wrong" : "";
            return (
              <button
                type="button"
                key={option.id}
                className={`answer-option${isSelected ? " is-selected" : ""}${resultClass}`}
                aria-pressed={isSelected}
                onClick={() => {
                  setInputError("");
                  if (question.type === "multiple") {
                    setSelected((current) => {
                      const currentIds = Array.isArray(current) ? current : [];
                      return currentIds.includes(option.id) ? currentIds.filter((id) => id !== option.id) : [...currentIds, option.id];
                    });
                  } else setSelected(option.id);
                }}
              >
                <span className="answer-option__id">{option.id}</span><span className="answer-option__text">{option.text}</span>
                {submitted && isAnswer ? <AppIcon className="answer-option__result" name="check" size={18} /> : null}
              </button>
            );
          })}
        </fieldset>
      ) : (
        <label className="text-answer"><span>{question.type === "output" ? "输入程序输出" : "写下你发现的问题"}</span>
          {question.type === "output" ? (
            <input value={selected as string} onChange={(event) => { setSelected(event.target.value); setInputError(""); }} placeholder="在这里输入输出结果" disabled={submitted} />
          ) : (
            <textarea value={selected as string} onChange={(event) => { setSelected(event.target.value); setInputError(""); }} placeholder="描述错误位置与修正方式" rows={3} disabled={submitted} />
          )}
        </label>
      )}

      {inputError ? <p className="field-error" role="alert">{inputError}</p> : null}
      {submitted ? <AnswerFeedback question={question} correct={correct} /> : null}
      {submitted && question.type === "debug" && !selfRated ? (
        <div className="self-assess"><p>看完解析后，给自己一个判断</p><div><button className="button button--secondary" type="button" onClick={() => selfAssess(false)}>还要复习</button><button className="button button--primary" type="button" onClick={() => selfAssess(true)}>我已理解</button></div></div>
      ) : null}

      <footer className="practice-actions">
        {submitted ? (
          <>
            {index > 0 ? <button className="button button--secondary practice-actions__previous" type="button" onClick={() => setIndex((current) => Math.max(0, current - 1))}>上一题</button> : null}
            <button className="button button--primary practice-actions__next" type="button" onClick={nextQuestion} disabled={question.type === "debug" && !selfRated}>
              {index === filteredQuestions.length - 1 ? "完成本组" : "下一题"}<AppIcon name="arrow" size={17} />
            </button>
          </>
        ) : (
          <button className="button button--primary practice-actions__submit" type="button" onClick={handleSubmit}>
            {question.type === "debug" ? "查看解析" : "提交答案"}<AppIcon name="arrow" size={17} />
          </button>
        )}
      </footer>
    </section>
  );
}

export function allStages(): StageId[] {
  return STAGES.map((stage) => stage.id);
}

export function displayedAnswer(question: Question): string {
  return answerText(question.answer);
}
