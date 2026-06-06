import type { HistoryEntry } from "../../types";
import "./HistoryPanel.css";

interface Props {
  history: HistoryEntry[];
  show: boolean;
  closing: boolean;
  onRestore: (entry: HistoryEntry) => void;
  onClose: () => void;
}

export function HistoryPanel({
  history,
  show,
  closing,
  onRestore,
  onClose,
}: Props) {
  if (!show) return null;

  return (
    <aside className={`history-panel${closing ? " closing" : ""}`}>
      <div className="history-panel-header">
        <h3>生成历史</h3>
        <button onClick={onClose}>✕</button>
      </div>
      {history.length === 0 ? (
        <p className="history-empty">暂无记录，生成简历或话术后会自动保存</p>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="history-item"
              onClick={() => onRestore(entry)}
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
  );
}
