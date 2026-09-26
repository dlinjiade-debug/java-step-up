import { useMemo, useState } from "react";
import { AppIcon } from "../components/AppIcon.tsx";
import { questionById } from "../data/questions/index.ts";
import type { Question } from "../types/question.ts";
import type { QuestionProgress, UserState } from "../types/progress.ts";

export function WrongPage({ state, onPractice, onMarkMastered }: {
  state: UserState;
  onPractice: (questionIds: string[]) => void;
  onMarkMastered: (questionId: string) => void;
}) {
  const [tab, setTab] = useState<"review" | "saved">("review");
  const rows = useMemo(() => Object.values(state.progress)
    .filter((entry) => tab === "saved"
      ? entry.bookmarked
      : entry.wrongCount > 0 && (entry.status === "wrong" || entry.status === "uncertain"))
    .map((entry) => ({ entry, question: questionById(entry.questionId) }))
    .filter((row): row is { entry: QuestionProgress; question: Question } => Boolean(row.question))
    .sort((a, b) => b.entry.updatedAt - a.entry.updatedAt), [state.progress, tab]);
  const reviewCount = Object.values(state.progress).filter((entry) => entry.wrongCount > 0 && (entry.status === "wrong" || entry.status === "uncertain")).length;
  const savedCount = Object.values(state.progress).filter((entry) => entry.bookmarked).length;

  return (
    <section className="page list-page">
      <header className="page-heading"><span className="eyebrow">REVIEW STUDIO</span><h1>把卡住的地方，<br />再走一遍。</h1><p>复习不是重来，是把下一步走稳。</p></header>
      <div className="review-summary"><span>待复习</span><strong>{reviewCount}</strong><span>题 · 收藏 {savedCount} 题</span></div>
      <div className="segmented-control" role="tablist" aria-label="复习列表类型">
        <button type="button" role="tab" aria-selected={tab === "review"} className={tab === "review" ? "is-active" : ""} onClick={() => setTab("review")}>待复习 <span>{reviewCount}</span></button>
        <button type="button" role="tab" aria-selected={tab === "saved"} className={tab === "saved" ? "is-active" : ""} onClick={() => setTab("saved")}>我的收藏 <span>{savedCount}</span></button>
      </div>
      {rows.length ? (
        <div className="question-list">
          {rows.map(({ entry, question }) => (
            <article className="question-list__item" key={question.id}>
              <div className="question-list__meta"><span>{question.chapter}</span><span>{question.difficulty}</span></div>
              <h2>{question.point}</h2>
              <p>{question.stem}</p>
              <div className="question-list__footer">
                <span>{entry.attempts} 次练习{entry.wrongCount ? ` · ${entry.wrongCount} 次答错` : " · 已收藏"}</span>
                <div>
                  {tab === "review" ? <button className="text-button" type="button" onClick={() => onMarkMastered(question.id)}>标记掌握</button> : null}
                  <button className="text-button text-button--bright" type="button" onClick={() => onPractice([question.id])}>再练一次 <AppIcon name="arrow" size={14} /></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state empty-state--compact">
          <span className="empty-state__symbol"><AppIcon name={tab === "saved" ? "bookmark" : "check"} size={26} /></span>
          <h2>{tab === "saved" ? "还没有收藏题目" : "这里暂时很清爽"}</h2>
          <p>{tab === "saved" ? "练习时点亮书签，值得回看的题目会收在这里。" : "继续按自己的节奏练习，答错的题会自动出现在这里。"}</p>
          <button className="button button--primary" type="button" onClick={() => onPractice([])}>去做几道题<AppIcon name="arrow" size={16} /></button>
        </div>
      )}
    </section>
  );
}
