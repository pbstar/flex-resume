import { useState, useRef } from "react";
import { JDInput } from "../../components/JDInput/JDInput";
import { ResumePreview } from "../../components/ResumePreview/ResumePreview";
import { GreetingPanel } from "../../components/GreetingPanel/GreetingPanel";
import { HistoryPanel } from "../../components/HistoryPanel/HistoryPanel";
import { ExportBar } from "../../components/ExportBar/ExportBar";
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

  const handleGenerateResume = async (jdText: string, config: ResumeConfig) => {
    try {
      const result = await resume.generate(jdText, config);
      if (result) history.save("resume", jdText, result);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "请求失败", "error");
    }
  };

  const handleGenerateGreeting = async (
    jdText: string,
    company: string,
    config: GreetingConfig,
  ) => {
    try {
      const result = await greeting.generate(jdText, company, config);
      if (result) history.save("greeting", jdText, result);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "请求失败", "error");
    }
  };

  const handleExportPDF = async () => {
    if (!templateRef.current) return;
    try {
      await pdf.download(templateRef.current.innerHTML);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "PDF 导出失败", "error");
    }
  };

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => toast("已复制到剪贴板", "success"),
      () => toast("复制失败", "error"),
    );
  };

  return (
    <div className="home-page">
      <header className="home-header container">
        <JDInput
          jd={jd}
          onJdChange={setJd}
          companyIntro={companyIntro}
          onCompanyIntroChange={setCompanyIntro}
          onGenerateResume={handleGenerateResume}
          onGenerateGreeting={handleGenerateGreeting}
          resumeLoading={resume.loading}
          greetingLoading={greeting.loading}
        />
      </header>

      <main className="home-main container">
        <GreetingPanel greetings={greeting.greetings} onCopy={handleCopy} />
        <ResumePreview
          ref={templateRef}
          data={resume.adaptedResume}
          templateId={templateId}
        />
      </main>

      <button
        className="history-toggle"
        onClick={history.toggle}
        title="生成历史"
      >
        🕐
      </button>

      <HistoryPanel
        history={history.history}
        show={history.showPanel}
        closing={history.closing}
        onRestore={handleRestore}
        onClose={history.close}
      />

      {resume.adaptedResume && (
        <ExportBar
          templateId={templateId}
          onTemplateChange={setTemplateId}
          exporting={pdf.exporting}
          onExport={handleExportPDF}
        />
      )}
    </div>
  );
}
