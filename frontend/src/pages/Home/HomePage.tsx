import { useState, useRef } from "react";
import { JDInput } from "../../components/JDInput/JDInput";
import { TemplateRenderer } from "../../components/TemplateRenderer/TemplateRenderer";
import { useToast } from "../../components/Toast/ToastProvider";
import { useResume } from "../../hooks/useResume";
import { useGreeting } from "../../hooks/useGreeting";
import { useHistory } from "../../hooks/useHistory";
import { usePDFExport } from "../../hooks/usePDFExport";
import type { ResumeConfig, GreetingConfig, HistoryEntry } from "../../types";
import "./HomePage.css";

export function HomePage() {
  const [jd, setJd] = useState("");
  const [companyIntro, setCompanyIntro] = useState("");
  const [templateId, setTemplateId] = useState("simple");
  const templateRef = useRef<HTMLDivElement>(null);

  const resume = useResume();
  const greeting = useGreeting();
  const history = useHistory();
  const pdf = usePDFExport(resume.adaptedResume);
  const { toast } = useToast();

  // 加载指示：任一正在生成即为 true
  const isBusy = resume.loading || greeting.loading;

  // 生成简历
  const handleGenerateResume = async (jdText: string, config: ResumeConfig) => {
    try {
      const result = await resume.generate(jdText, config);
      if (result) {
        history.save("resume", jdText, result);
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "请求失败", "error");
    }
  };

  // 生成话术
  const handleGenerateGreeting = async (
    jdText: string,
    company: string,
    config: GreetingConfig,
  ) => {
    try {
      const result = await greeting.generate(jdText, company, config);
      if (result) {
        history.save("greeting", jdText, result);
      }
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "请求失败", "error");
    }
  };

  // 导出 PDF
  const handleExportPDF = async () => {
    if (!templateRef.current) return;
    try {
      await pdf.download(templateRef.current.innerHTML);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "PDF 导出失败", "error");
    }
  };

  // 恢复历史记录
  const handleRestore = (entry: HistoryEntry) => {
    setJd(entry.jd);
    if (entry.type === "resume") {
      resume.setAdaptedResume(entry.result as typeof resume.adaptedResume);
      greeting.clear();
    } else {
      greeting.setGreetings(entry.result as typeof greeting.greetings);
      resume.clear();
    }
    history.close();
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
          loading={isBusy ? (resume.loading ? "resume" : "greeting") : null}
        />
      </header>

      {/* 话术结果 */}
      {(greeting.greetings.length > 0 || greeting.loading) && (
        <section className="greeting-section container">
          <h3>💬 打招呼话术</h3>
          {greeting.loading ? (
            <div className="loading-area loading-sm">
              <div className="loading-dots">
                <span />
                <span />
                <span />
              </div>
              <p>AI 正在为你生成多风格打招呼话术…</p>
            </div>
          ) : (
            <div className="greeting-list">
              {greeting.greetings.map((g, i) => (
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
          )}
        </section>
      )}

      {/* 简历预览 */}
      <main className="home-main container">
        <div ref={templateRef}>
          <TemplateRenderer
            data={resume.adaptedResume}
            templateId={templateId}
          />
        </div>

        {resume.loading && (
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
        onClick={history.toggle}
        title="生成历史"
      >
        🕐
      </button>

      {/* 历史记录面板 */}
      {history.showPanel && (
        <aside className={`history-panel${history.closing ? " closing" : ""}`}>
          <div className="history-panel-header">
            <h3>生成历史</h3>
            <button onClick={history.close}>✕</button>
          </div>
          {history.history.length === 0 ? (
            <p className="history-empty">
              暂无记录，生成简历或话术后会自动保存
            </p>
          ) : (
            <div className="history-list">
              {history.history.map((entry) => (
                <div
                  key={entry.id}
                  className="history-item"
                  onClick={() => handleRestore(entry)}
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
      {resume.adaptedResume && (
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
              onClick={handleExportPDF}
              disabled={pdf.exporting}
            >
              {pdf.exporting ? "⏳ 导出中…" : "📥 导出 PDF"}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
