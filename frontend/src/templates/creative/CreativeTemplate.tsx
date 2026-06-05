import type { AdaptedResume } from "../../types";
import ctCSS from "./CreativeTemplate.css?inline";

export function CreativeTemplate({ data }: { data: AdaptedResume }) {
  const { basic, skills, workExperience, projects, education, selfEvaluation } =
    data;

  return (
    <div className="resume creative-template">
      <style>{ctCSS}</style>
      {/* 顶部渐变条 */}
      <header className="ct-header">
        <div className="ct-header-bar" />
        <div className="ct-header-content">
          <div className="ct-avatar">{basic.name.charAt(0)}</div>
          <div>
            <h1>{basic.name}</h1>
            <p className="ct-role">{basic.title}</p>
          </div>
        </div>
        <div className="ct-contact">
          <span>{basic.phone}</span>
          <span>{basic.email}</span>
          <span>{basic.github}</span>
        </div>
      </header>

      <div className="ct-body">
        {/* 技能云 */}
        <section className="ct-section">
          <h2>专业技能</h2>
          {skills.map((s) => (
            <div key={s.category} className="ct-skill-cat">
              <span className="ct-skill-label">{s.category}</span>
              <div className="ct-tag-cloud">
                {s.tags.map((t) => (
                  <span key={t} className="ct-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* 工作经历 — 卡片式 */}
        <section className="ct-section">
          <h2>工作经历</h2>
          <div className="ct-timeline">
            {workExperience.map((w) => (
              <div key={w.id} className="ct-card">
                <div className="ct-card-meta">
                  <span className="ct-card-date">
                    {w.startDate} - {w.endDate}
                  </span>
                </div>
                <h3>
                  {w.company} · {w.position}
                </h3>
                {w.description && <p>{w.description}</p>}
                {w.highlights.length > 0 && (
                  <ul className="ct-list">
                    {w.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 项目经验 */}
        <section className="ct-section">
          <h2>项目经验</h2>
          <div className="ct-grid">
            {projects.map((p) => (
              <div key={p.id} className="ct-card ct-project-card">
                <div className="ct-card-top">
                  <h3>{p.name}</h3>
                  <span className="ct-platform">
                    {p.platform === "Mobile" ? "📱 移动端" : "🖥 PC端"}
                  </span>
                </div>
                <p className="ct-card-sub">
                  {p.company} · {p.startDate} - {p.endDate}
                </p>
                <div className="ct-tag-cloud ct-tech-tags">
                  {p.techStack.map((t) => (
                    <span key={t} className="ct-tag ct-tag-tech">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="ct-card-desc">{p.description}</p>
                {p.responsibilities.length > 0 && (
                  <ul className="ct-list">
                    {p.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 教育 + 自我评价 */}
        <div className="ct-bottom-row">
          <section className="ct-section ct-half">
            <h2>教育背景</h2>
            {education.map((e, i) => (
              <div key={i} className="ct-edu-item">
                <strong>{e.school}</strong>
                <p>
                  {e.major} · {e.degree} · {e.startDate} - {e.endDate}
                </p>
              </div>
            ))}
          </section>

          <section className="ct-section ct-half">
            <h2>自我评价</h2>
            <ul className="ct-list">
              {selfEvaluation.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
