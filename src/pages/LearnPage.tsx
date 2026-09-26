import { AppIcon } from "../components/AppIcon.tsx";
import { ProgressRing } from "../components/ProgressRing.tsx";
import { StageCard } from "../components/StageCard.tsx";
import { STAGES } from "../data/stages.ts";
import type { Question, StageId } from "../types/question.ts";
import type { UserState } from "../types/progress.ts";

interface LearnPageProps {
  questions: Question[];
  state: UserState;
  onStart: (stage: StageId, questionId?: string) => void;
  onReview: () => void;
}

function currentStreak(state: UserState): number {
  const days = new Set(state.sessions.map((session) => new Date(session.startedAt).toLocaleDateString("en-CA")));
  const cursor = new Date();
  let streak = 0;
  while (streak < 365) {
    const day = cursor.toLocaleDateString("en-CA");
    if (!days.has(day)) {
      if (streak === 0) {
        cursor.setDate(cursor.getDate() - 1);
        if (!days.has(cursor.toLocaleDateString("en-CA"))) break;
        streak += 1;
      } else break;
    } else streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function LearnPage({ questions, state, onStart, onReview }: LearnPageProps) {
  const attempted = Object.values(state.progress).filter((entry) => entry.attempts > 0).length;
  const attempts = Object.values(state.progress).reduce((total, entry) => total + entry.attempts, 0);
  const correct = Object.values(state.progress).reduce((total, entry) => total + entry.correctCount, 0);
  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 0;
  const reviewCount = Object.values(state.progress).filter((entry) => entry.status === "wrong" || (entry.status === "uncertain" && entry.wrongCount > 0)).length;
  const streak = currentStreak(state);
  const recent = state.lastQuestionId ? questions.find((question) => question.id === state.lastQuestionId) : undefined;
  const firstStage = STAGES[0];
  const resumeStage = recent?.stage ?? firstStage.id;
  const resumeQuestions = questions.filter((question) => question.stage === resumeStage);
  const nextQuestion = resumeQuestions.find((question) => !state.progress[question.id]?.attempts) ?? recent ?? resumeQuestions[0];

  return (
    <section className="page learn-page">
      <header className="app-header">
        <div className="brand-lockup"><span className="brand-mark">J</span><span><strong>JAVA 阶梯</strong><small>LEARNING PATH</small></span></div>
        <div className="streak-pill"><AppIcon name="spark" size={16} /><strong>{streak}</strong><span>天</span></div>
      </header>

      <div className="home-intro">
        <span className="eyebrow"><span className="eyebrow__dot" /> TODAY'S PLAN</span>
        <h1>每天一点，<br />把 Java 学扎实。</h1>
        <p>每次掌握一个概念，稳稳向前。</p>
      </div>

      <article className="continue-card">
        <div className="continue-card__top"><span>CONTINUE LEARNING</span><span>{recent ? "最近学习" : `${firstStage.number} / 05`}</span></div>
        <div className="continue-card__title-row">
          <div><h2>{recent?.chapter ?? "流程控制"}</h2><p>{recent?.point ?? "条件判断 · 循环 · 数组"}</p></div>
          <ProgressRing value={questions.length ? (attempted / questions.length) * 100 : 0} label={`${attempted}`} />
        </div>
        <div className="continue-card__progress"><span>已完成 {attempted} / {questions.length} 题</span><span>{accuracy}% 正确</span></div>
        <div className="progress-track"><span style={{ width: `${questions.length ? (attempted / questions.length) * 100 : 0}%` }} /></div>
        <button className="button button--primary continue-card__button" type="button" onClick={() => onStart(resumeStage, nextQuestion?.id)}>
          {recent ? "继续上次练习" : "从第一题开始"}<AppIcon name="arrow" size={17} />
        </button>
      </article>

      <div className="section-heading"><div><span className="eyebrow">YOUR ROADMAP</span><h2>学习路线</h2></div><span>05 阶段 · {questions.length} 道题</span></div>
      <div className="stage-grid">
        {STAGES.map((stage) => {
          const answered = Object.values(state.progress).filter((entry) => entry.attempts > 0 && questions.find((question) => question.id === entry.questionId)?.stage === stage.id).length;
          return <StageCard key={stage.id} stage={stage} answered={answered} onClick={() => onStart(stage.id)} />;
        })}
      </div>

      <button className={`review-banner${reviewCount ? " review-banner--ready" : ""}`} type="button" onClick={onReview}>
        <span className="review-banner__icon"><AppIcon name="wrong" size={19} /></span>
        <span className="review-banner__copy"><strong>{reviewCount ? `还有 ${reviewCount} 题值得再看一遍` : "错题本会在这里等你"}</strong><small>{reviewCount ? "趁记忆还新，复习一下刚才卡住的地方。" : "答错的题会自动整理好，方便之后复习。"}</small></span>
        <AppIcon name="arrow" size={17} />
      </button>
    </section>
  );
}
