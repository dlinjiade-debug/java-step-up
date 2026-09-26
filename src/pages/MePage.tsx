import { useMemo, useRef, useState } from "react";
import { AppIcon } from "../components/AppIcon.tsx";
import { ImportPreview } from "../components/ImportPreview.tsx";
import { questionBank } from "../data/questions/index.ts";
import { STAGES } from "../data/stages.ts";
import { previewImport } from "../lib/progressStorage.ts";
import type { UserState } from "../types/progress.ts";
import type { ImportPreview as ImportPreviewResult } from "../lib/progressStorage.ts";

export function MePage({ state, onMergeImport }: { state: UserState; onMergeImport: (incoming: UserState) => void }) {
  const canCacheOffline = window.isSecureContext && "serviceWorker" in navigator;
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<Extract<ImportPreviewResult, { valid: true }> | null>(null);
  const [fileError, setFileError] = useState("");
  const [offlineHelp, setOfflineHelp] = useState(false);
  const attempted = useMemo(() => Object.values(state.progress).filter((entry) => entry.attempts > 0).length, [state.progress]);
  const attemptCount = Object.values(state.progress).reduce((sum, entry) => sum + entry.attempts, 0);
  const correctCount = Object.values(state.progress).reduce((sum, entry) => sum + entry.correctCount, 0);
  const accuracy = attemptCount ? Math.round((correctCount / attemptCount) * 100) : 0;
  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `java-step-up-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  };
  const readImport = async (file?: File) => {
    if (!file) return;
    setFileError("");
    const result = previewImport(await file.text(), new Set(questionBank.map((question) => question.id)));
    if (result.valid) setPreview(result);
    else setFileError(result.error);
    if (fileRef.current) fileRef.current.value = "";
  };
  const confirmImport = () => {
    if (!preview) return;
    onMergeImport(preview.state);
    setPreview(null);
  };

  return (
    <section className="page me-page">
      <header className="me-header"><div className="brand-lockup"><span className="brand-mark">J</span><span><strong>JAVA 阶梯</strong><small>YOUR STUDY DESK</small></span></div><span className="me-header__avatar">J</span></header>
      <div className="page-heading page-heading--tight"><span className="eyebrow">MY PROGRESS</span><h1>我的学习</h1><p>一点点积累，最后都会看见。</p></div>
      <article className="profile-progress">
        <div className="profile-progress__top"><div><span>已练习题目</span><strong>{attempted}<small> / {questionBank.length}</small></strong></div><span className="profile-progress__percent">{questionBank.length ? Math.round((attempted / questionBank.length) * 100) : 0}%</span></div>
        <div className="progress-track"><span style={{ width: `${questionBank.length ? (attempted / questionBank.length) * 100 : 0}%` }} /></div>
        <div className="profile-progress__metrics"><div><span>累计作答</span><strong>{attemptCount}</strong></div><div><span>正确率</span><strong>{accuracy}%</strong></div><div><span>学习阶段</span><strong>05</strong></div></div>
      </article>
      <section className="stage-progress"><div className="section-heading section-heading--compact"><div><span className="eyebrow">YOUR PACE</span><h2>阶段进度</h2></div></div>
        {STAGES.map((stage) => {
          const stageQuestions = questionBank.filter((question) => question.stage === stage.id);
          const done = stageQuestions.filter((question) => (state.progress[question.id]?.attempts ?? 0) > 0).length;
          const percent = stage.total ? Math.round((done / stage.total) * 100) : 0;
          return <div className="stage-progress__row" key={stage.id}><div className="stage-progress__name"><span>{stage.number}</span><strong>{stage.name}</strong></div><div className="stage-progress__track"><span style={{ width: `${percent}%` }} /></div><small>{done}/{stage.total}</small></div>;
        })}
      </section>
      <section className="personal-tools"><div className="section-heading section-heading--compact"><div><span className="eyebrow">PERSONAL TOOLS</span><h2>个人工具</h2></div></div>
        <p className="personal-tools__privacy">学习记录只保存在当前设备的浏览器中，不会上传。换设备时，可通过 JSON 备份迁移。</p>
        <button className="tool-row" type="button" onClick={exportData}><span className="tool-row__icon"><AppIcon name="download" /></span><span><strong>导出学习进度</strong><small>保存一份 JSON 备份</small></span><AppIcon name="arrow" size={17} /></button>
        <button className="tool-row" type="button" onClick={() => fileRef.current?.click()}><span className="tool-row__icon"><AppIcon name="upload" /></span><span><strong>导入学习备份</strong><small>预览后安全合并</small></span><AppIcon name="arrow" size={17} /></button>
        <input ref={fileRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={(event) => { void readImport(event.target.files?.[0]); }} />
        {fileError ? <p className="field-error" role="alert">{fileError}</p> : null}
        <button className="tool-row" type="button" onClick={() => setOfflineHelp((value) => !value)}><span className="tool-row__icon"><AppIcon name="wifi" /></span><span><strong>离线使用说明</strong><small>{canCacheOffline ? "题库会随应用一起缓存" : "当前局域网地址需联网使用"}</small></span><AppIcon name={offlineHelp ? "close" : "arrow"} size={17} /></button>
        {offlineHelp ? <p className="offline-note">{canCacheOffline ? "首次打开时需要网络。页面加载完成后，可以将 Java 阶梯添加到 iPhone 主屏幕；之后已缓存题目和本机进度可离线使用。" : "当前通过局域网 HTTP 地址打开，可在线练习并在本机保存进度；离线缓存需要使用 HTTPS 地址。"}</p> : null}
      </section>
      <p className="me-footer">Java 21 · 五个阶段 · 按自己的节奏学习</p>
      {preview ? <ImportPreview preview={preview} onCancel={() => setPreview(null)} onConfirm={confirmImport} /> : null}
    </section>
  );
}
