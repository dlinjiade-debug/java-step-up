import type { Question } from "../types/question.ts";

export function AnswerFeedback({ question, correct }: { question: Question; correct: boolean | null }) {
  return (
    <section className={`answer-feedback${correct === true ? " answer-feedback--correct" : correct === false ? " answer-feedback--wrong" : " answer-feedback--self"}`} aria-live="polite">
      <div className="answer-feedback__heading">
        <span className="answer-feedback__mark">{correct === true ? "✓" : correct === false ? "!" : "↗"}</span>
        <div>
          <strong>{correct === true ? "回答正确" : correct === false ? "再记住这一步" : "参考解析"}</strong>
          <span>{correct === null ? "对照思路完成自我检查" : correct ? "保持节奏，继续向前" : "错题已收进复习列表"}</span>
        </div>
      </div>
      <p>{question.explanation.reasoning}</p>
      {question.type === "single" || question.type === "multiple" ? (
        <div className="answer-feedback__analysis">
          {(question.options ?? []).map((option) => question.explanation.optionAnalysis?.[option.id] ? (
            <div key={option.id}><b>{option.id}</b><span>{question.explanation.optionAnalysis[option.id]}</span></div>
          ) : null)}
        </div>
      ) : null}
      <div className="answer-feedback__note"><span>易错点</span><p>{question.explanation.pitfall}</p></div>
      <div className="answer-feedback__note answer-feedback__note--takeaway"><span>记住</span><p>{question.explanation.takeaway}</p></div>
      {question.type === "output" || question.type === "debug" ? (
        <details className="answer-feedback__reference">
          <summary>{question.type === "output" ? "查看参考输出" : "查看参考修正"}</summary>
          <pre>{Array.isArray(question.answer) ? question.answer.join("\n") : question.answer}</pre>
        </details>
      ) : null}
    </section>
  );
}
