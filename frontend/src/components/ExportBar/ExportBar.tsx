import "./ExportBar.css";

interface Props {
  templateId: string;
  onTemplateChange: (id: string) => void;
  exporting: boolean;
  onExport: () => void;
}

export function ExportBar({
  templateId,
  onTemplateChange,
  exporting,
  onExport,
}: Props) {
  return (
    <footer className="export-bar">
      <div className="export-bar-left">
        <span className="export-bar-label">模板风格</span>
        <select
          value={templateId}
          onChange={(e) => onTemplateChange(e.target.value)}
        >
          <option value="simple">简洁风</option>
          <option value="business">商务风</option>
          <option value="creative">创意风</option>
        </select>
      </div>
      <div className="export-bar-right">
        <button className="btn-pdf" onClick={onExport} disabled={exporting}>
          {exporting ? "⏳ 导出中…" : "📥 导出 PDF"}
        </button>
      </div>
    </footer>
  );
}
