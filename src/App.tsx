import { useEffect, useMemo, useRef, useState } from "react";
import { BottomNav, type PageKey } from "./components/BottomNav.tsx";
import { LearnPage } from "./pages/LearnPage.tsx";
import { MePage } from "./pages/MePage.tsx";
import { PracticePage } from "./pages/PracticePage.tsx";
import { WrongPage } from "./pages/WrongPage.tsx";
import { questionBank } from "./data/questions/index.ts";
import type { Answer, Question, StageId } from "./types/question.ts";
import type { UserState } from "./types/progress.ts";
import { emptyUserState, loadProgress, markMastered, mergeProgress, recordAnswer, saveProgress, toggleBookmark } from "./lib/progressStorage.ts";

interface PracticeScope {
  stage: StageId | "all";
  ids?: string[];
  initialQuestionId?: string;
}

export default function App() {
  const [initial] = useState(() => loadProgress());
  const [userState, setUserState] = useState<UserState>(initial.state ?? emptyUserState());
  const stateRef = useRef(userState);
  const [storageWarning, setStorageWarning] = useState(initial.warning ?? "");
  const [page, setPage] = useState<PageKey>("learn");
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const [practiceScope, setPracticeScope] = useState<PracticeScope>({ stage: "all" });
  const [toast, setToast] = useState("");

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    const result = saveProgress(userState);
    if (!result.saved && result.warning) setStorageWarning(result.warning);
    else if (result.saved && storageWarning) setStorageWarning("");
  }, [userState, storageWarning]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const practiceQuestions = useMemo(() => {
    if (practiceScope.ids) {
      const allowed = new Set(practiceScope.ids);
      return questionBank.filter((question) => allowed.has(question.id));
    }
    return practiceScope.stage === "all" ? questionBank : questionBank.filter((question) => question.stage === practiceScope.stage);
  }, [practiceScope]);

  const updateState = (update: (current: UserState) => UserState) => {
    const next = update(stateRef.current);
    stateRef.current = next;
    setUserState(next);
  };

  const startPractice = (stage: StageId | "all" = "all", questionId?: string, ids?: string[]) => {
    setPracticeScope({ stage, initialQuestionId: questionId, ...(ids ? { ids } : {}) });
    setPage("practice");
  };

  const handleAnswer = (question: Question, answer: Answer, correct: boolean) => {
    const now = Date.now();
    updateState((current) => {
      const answered = recordAnswer(current, question, answer, correct, now);
      const day = new Date(now).toLocaleDateString("en-CA");
      const sessionId = `study-${day}`;
      const existing = answered.sessions.find((session) => session.id === sessionId);
      const session = {
        id: sessionId,
        startedAt: existing?.startedAt ?? now,
        endedAt: now,
        answered: (existing?.answered ?? 0) + 1,
        correct: (existing?.correct ?? 0) + Number(correct),
      };
      return {
        ...answered,
        sessions: existing
          ? answered.sessions.map((item) => item.id === sessionId ? session : item)
          : [...answered.sessions, session],
      };
    });
    setToast(correct ? "进度已保存，继续保持。" : "已收进错题本，之后可以再练。 ");
  };

  const handleBookmark = (questionId: string) => {
    updateState((current) => toggleBookmark(current, questionId));
    setToast(userState.progress[questionId]?.bookmarked ? "已从收藏中移除。" : "已加入收藏。 ");
  };

  const handleMarkMastered = (questionId: string) => {
    updateState((current) => markMastered(current, questionId));
    setToast("已标记掌握，复习列表更新了。 ");
  };

  const handleImport = (incoming: UserState) => {
    updateState((current) => mergeProgress(current, incoming));
    setToast("备份已安全合并到本机进度。 ");
  };

  const navigate = (next: PageKey) => {
    if (next === "practice") setPracticeScope({ stage: "all" });
    setPage(next);
  };

  return (
    <div className="app-background">
      <div className="app-frame">
        {(!online || storageWarning) ? (
          <div className="system-notice" role="status">
            <span className={`system-notice__dot${online ? "" : " is-offline"}`} />
            {storageWarning || "已离线 · 缓存中的题目仍可练习"}
          </div>
        ) : null}
        <main className={`app-content app-content--${page}`}>
          {page === "learn" ? <LearnPage questions={questionBank} state={userState} onStart={(stage, id) => startPractice(stage, id)} onReview={() => setPage("wrong")} /> : null}
          {page === "practice" ? <PracticePage questions={practiceQuestions} initialQuestionId={practiceScope.initialQuestionId} initialStage={practiceScope.stage} progress={userState.progress} onAnswer={handleAnswer} onBookmark={handleBookmark} onBack={() => setPage("learn")} /> : null}
          {page === "wrong" ? <WrongPage state={userState} onPractice={(ids) => startPractice("all", ids[0], ids.length ? ids : undefined)} onMarkMastered={handleMarkMastered} /> : null}
          {page === "me" ? <MePage state={userState} onMergeImport={handleImport} /> : null}
        </main>
        {page !== "practice" ? <BottomNav active={page} onNavigate={navigate} /> : null}
        {toast ? <div className="toast" role="status">{toast}</div> : null}
      </div>
    </div>
  );
}
