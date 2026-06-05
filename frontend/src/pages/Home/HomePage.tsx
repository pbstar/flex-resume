import { useState, useRef, useEffect, useCallback } from "react";
import { JDInput } from "../../components/JDInput/JDInput";
import { TemplateRenderer } from "../../components/TemplateRenderer/TemplateRenderer";
import { useToast } from "../../components/Toast/ToastProvider";
import type {
  AdaptedResume,
  Greeting,
  ResumeConfig,
  GreetingConfig,
} from "../../types";
import "./HomePage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface HistoryEntry {
  id: string;
  type: "resume" | "greeting";
  jd: string;
  result: unknown;
  createdAt: string;
}

export function HomePage() {
  const [jd, setJd] = useState("");
  const [companyIntro, setCompanyIntro] = useState("");
  const [adaptedResume, setAdaptedResume] = useState<AdaptedResume | null>(
    null,
  );
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [loading, setLoading] = useState<"resume" | "greeting" | null>(null);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [templateId, setTemplateId] = useState("simple");
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const templateRef = useRef<HTMLDivElement>(null);

  // 加载历史记录
  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history`);
      const data = await res.json();
      setHistory(data.entries || []);
    } catch {
      // 静默失败
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // 恢复历史记录
  const restoreHistory = (entry: HistoryEntry) => {
    setJd(entry.jd);
    if (entry.type === "resume") {
      setAdaptedResume(entry.result as AdaptedResume);
      setGreetings([]);
    } else {
      setGreetings(entry.result as Greeting[]);
      setAdaptedResume(null);
    }
    setShowHistory(false);
  };

  const handleGenerateResume = async (jdText: string, config: ResumeConfig) => {
    setLoading("resume");
    try {
      const res = await fetch(`${API_BASE_URL}/api/resume/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: jdText, config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "请求失败");
      setAdaptedResume(data.adaptedResume);

      // 保存历史
      fetch(`${API_BASE_URL}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "resume",
          jd: jdText,
          result: data.adaptedResume,
        }),
      }).catch(() => {});
      loadHistory();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "请求失败", "error");
    } finally {
      setLoading(null);
    }
  };

  const handleGenerateGreeting = async (
    jdText: string,
    company: string,
    config: GreetingConfig,
  ) => {
    setLoading("greeting");
    try {
      const res = await fetch(`${API_BASE_URL}/api/greeting/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd: jdText,
          companyIntro: company || undefined,
          config,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "请求失败");
      setGreetings(data.greetings || []);

      // 保存历史
      fetch(`${API_BASE_URL}/api/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "greeting",
          jd: jdText,
          result: data.greetings,
        }),
      }).catch(() => {});
      loadHistory();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "请求失败", "error");
    } finally {
      setLoading(null);
    }
  };

  const exportPDF = async () => {
    if (!templateRef.current) return;
    setExportingPDF(true);
    try {
      // HTML 已自带模板 <style> 标签，无需额外收集 CSS
      const html = templateRef.current.innerHTML;

      const res = await fetch(`${API_BASE_URL}/api/pdf/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html }),
      });
      if (!res.ok) throw new Error("PDF 导出失败");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const name = adaptedResume?.basic?.name || "简历";
      a.download = `${name}_简历.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "PDF 导出失败", "error");
    } finally {
      setExportingPDF(false);
    }
  };

  return (
    <div className="home-page">
      {/* 顶栏 */}
      <header className="home-header container">
        <JDInput
          jd={jd}
          onJdChange={setJd}
          companyIntro={companyIntro}
          onCompanyIntroChange={setCompanyIntro}
          onGenerateResume={handleGenerateResume}
          onGenerateGreeting={handleGenerateGreeting}
          loading={loading}
        />
      </header>

      {/* 话术结果 */}
      {greetings.length > 0 && (
        <section className="greeting-section container">
          <h3>💬 打招呼话术</h3>
          <div className="greeting-list">
            {greetings.map((g, i) => (
              <div key={i} className="greeting-card">
                <div className="greeting-top">
                  <span className="greeting-label">{g.label}</span>
                  <button
                    className="btn-copy-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(g.text).then(
                        () => toast("已复制到剪贴板", "success"),
                        () => toast("复制失败", "error"),
                      );
                    }}
                  >
                    复制
                  </button>
                </div>
                <p>{g.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 简历预览 */}
      <main className="home-main container">
        <div ref={templateRef}>
          <TemplateRenderer data={adaptedResume} templateId={templateId} />
        </div>

        {loading === "resume" && (
          <div className="loading-overlay">
            <div className="loading-area">
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
              <p>AI 正在分析 JD、筛选匹配技能与项目、优化描述…</p>
            </div>
          </div>
        )}
      </main>

      {/* 历史记录按钮 */}
      <button
        className="history-toggle"
        onClick={() => setShowHistory(!showHistory)}
        title="生成历史"
      >
        🕐
      </button>

      {/* 历史记录面板 */}
      {showHistory && (
        <aside className="history-panel">
          <div className="history-panel-header">
            <h3>生成历史</h3>
            <button onClick={() => setShowHistory(false)}>✕</button>
          </div>
          {history.length === 0 ? (
            <p className="history-empty">
              暂无记录，生成简历或话术后会自动保存
            </p>
          ) : (
            <div className="history-list">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="history-item"
                  onClick={() => restoreHistory(entry)}
                >
                  <div className="history-meta">
                    <span
                      className={`history-badge ${entry.type === "resume" ? "badge-resume" : "badge-greeting"}`}
                    >
                      {entry.type === "resume" ? "简历" : "话术"}
                    </span>
                    <span className="history-time">
                      {new Date(entry.createdAt).toLocaleString("zh-CN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="history-jd">{entry.jd}</p>
                </div>
              ))}
            </div>
          )}
        </aside>
      )}

      {/* 底栏 */}
      {adaptedResume && (
        <footer className="home-footer">
          <div className="footer-left">
            <span className="footer-label">模板风格</span>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              <option value="simple">简洁风</option>
              <option value="business">商务风</option>
              <option value="creative">创意风</option>
            </select>
          </div>
          <div className="footer-right">
            <button
              className="btn-pdf"
              onClick={exportPDF}
              disabled={exportingPDF}
            >
              {exportingPDF ? "⏳ 导出中…" : "📥 导出 PDF"}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
