import type { Greeting } from "../../types";
import "./GreetingPanel.css";

interface Props {
  greetings: Greeting[];
  loading: boolean;
  onCopy: (text: string) => void;
}

export function GreetingPanel({ greetings, loading, onCopy }: Props) {
  if (!loading && greetings.length === 0) return null;

  return (
    <section className="greeting-section container">
      <h3>打招呼话术</h3>
      {loading ? (
        <div className="loading-area greeting-loading">
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
          <p>AI 正在为你生成多风格打招呼话术…</p>
        </div>
      ) : (
        <div className="greeting-list">
          {greetings.map((g, i) => (
            <div key={i} className="greeting-card">
              <div className="greeting-top">
                <span className="greeting-label">{g.label}</span>
                <button className="btn-copy-sm" onClick={() => onCopy(g.text)}>
                  复制
                </button>
              </div>
              <p>{g.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
