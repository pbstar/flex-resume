import type { AdaptedResume } from "../../types";
import ctCSS from "./CreativeTemplate.css?inline";

export function CreativeTemplate({ data }: { data: AdaptedResume }) {
  const { basic, skills, workExperience, projects, education, selfEvaluation } =
    data;

  return (
    <div className="resume creative-template">
      <style>{ctCSS}</style>

      {/* 头部 */}
      <header className="ct-header">
        <h1>{basic.name}</h1>
        <p className="ct-title">{basic.title}</p>
        <div className="ct-meta-row">
          <span>
            {basic.gender} · {basic.age} · {basic.education} · {basic.workYears}
            经验
          </span>
        </div>
        <div className="ct-contact-row">
          <span>{basic.phone}</span>
          <span className="ct-dot">·</span>
          <span>{basic.email}</span>
          <span className="ct-dot">·</span>
          <span>{basic.github}</span>
        </div>
      </header>

      {/* 技能 — 标签云 */}
      <section className="ct-section">
        <h2>专业技能</h2>
        {skills.map((s) => (
          <div key={s.category} className="ct-skill-group">
            <span className="ct-skill-cat">{s.category}</span>
            <div className="ct-chips">
              {s.tags.map((t) => (
                <span key={t} className="ct-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 工作经历 — 时间线 */}
      <section className="ct-section">
        <h2>工作经历</h2>
        <div className="ct-timeline">
          {workExperience.map((w, i) => (
            <div key={w.id} className="ct-tl-item">
              <div className="ct-tl-marker">
                <span className="ct-tl-dot" />
                {i < workExperience.length - 1 && (
                  <span className="ct-tl-line" />
                )}
              </div>
              <div className="ct-tl-body">
                <div className="ct-tl-head">
                  <h3>{w.company}</h3>
                  <span className="ct-tl-role">{w.position}</span>
                  <span className="ct-tl-date">
                    {w.startDate} — {w.endDate}
                  </span>
                </div>
                {w.description && <p className="ct-desc">{w.description}</p>}
                {w.highlights.length > 0 && (
                  <ul>
                    {w.highlights.map((h, j) => (
                      <li key={j}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 项目经验 — 卡片 */}
      <section className="ct-section">
        <h2>项目经验</h2>
        <div className="ct-projects">
          {projects.map((p) => (
            <div key={p.id} className="ct-proj-card">
              <div className="ct-proj-top">
                <h3>{p.name}</h3>
                <span className="ct-proj-company">{p.company}</span>
              </div>
              <div className="ct-proj-tech">
                {p.techStack.map((t) => (
                  <span key={t} className="ct-chip ct-chip-tech">
                    {t}
                  </span>
                ))}
              </div>
              <p className="ct-desc">{p.description}</p>
              {p.responsibilities.length > 0 && (
                <ul>
                  {p.responsibilities.map((r, j) => (
                    <li key={j}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 教育 + 自我评价 */}
      <div className="ct-bottom">
        <section className="ct-section ct-half">
          <h2>教育背景</h2>
          {education.map((e, i) => (
            <div key={i} className="ct-edu">
              <strong>{e.school}</strong>
              <p>
                {e.major} · {e.level} · {e.startDate} — {e.endDate}
              </p>
            </div>
          ))}
        </section>
        <section className="ct-section ct-half">
          <h2>自我评价</h2>
          <ul>
            {selfEvaluation.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
