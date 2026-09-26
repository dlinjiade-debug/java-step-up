import type { StudyStage } from "../data/stages.ts";

export function StageCard({ stage, answered, onClick }: { stage: StudyStage; answered: number; onClick: () => void }) {
  const progress = stage.total ? Math.min(100, (answered / stage.total) * 100) : 0;
  return (
    <button className={`stage-card${answered > 0 ? " stage-card--active" : ""}`} type="button" onClick={onClick}>
      <span className="stage-card__eyebrow"><span>{stage.number}</span><span>{stage.id}</span></span>
      <span className="stage-card__name">{stage.name}</span>
      <span className="stage-card__description">{answered ? `已完成 ${answered} / ${stage.total} 题` : `${stage.total} 题 · 待开始`}</span>
      <span className="stage-card__track"><span style={{ width: `${progress}%` }} /></span>
    </button>
  );
}
