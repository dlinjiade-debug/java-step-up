import { AppIcon } from "./AppIcon.tsx";
import type { ImportPreview as ImportPreviewResult } from "../lib/progressStorage.ts";

export function ImportPreview({ preview, onCancel, onConfirm }: {
  preview: Extract<ImportPreviewResult, { valid: true }>;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="import-preview" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <button className="icon-button import-preview__close" type="button" onClick={onCancel} aria-label="关闭"><AppIcon name="close" size={18} /></button>
        <span className="eyebrow">IMPORT PREVIEW</span>
        <h2 id="import-title">先确认，再合并。</h2>
        <p>本机进度会保留，导入内容只补充缺少的记录。</p>
        <div className="import-preview__stats">
          <div><span>匹配题目</span><strong>{preview.knownCount}</strong><small>条记录可合并</small></div>
          <div><span>未知题目</span><strong>{preview.unknownCount}</strong><small>条记录会跳过</small></div>
        </div>
        <div className="import-preview__note"><AppIcon name="check" size={17} /><span>答题数保留较大值，收藏合并去重。</span></div>
        <div className="import-preview__actions"><button className="button button--secondary" type="button" onClick={onCancel}>返回修改</button><button className="button button--primary" type="button" onClick={onConfirm}>合并到本机</button></div>
      </section>
    </div>
  );
}
