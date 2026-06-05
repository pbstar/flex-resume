import type { AdaptedResume } from "../../types";
import bizCSS from "./BusinessTemplate.css?inline";

interface Props {
  data: AdaptedResume;
}

export function BusinessTemplate({ data }: Props) {
  const { basic, skills, workExperience, projects, education, selfEvaluation } =
    data;

  return (
    <div className="resume business-template">
      <style>{bizCSS}</style>
      {/* 顶部：姓名 + 职位 */}
      <header className="biz-header">
        <div className="biz-header-left">
          <h1>{basic.name}</h1>
          <p className="biz-title">{basic.title}</p>
        </div>
        <div className="biz-header-right">
          <span>{basic.phone}</span>
          <span>{basic.email}</span>
          <span>{basic.github}</span>
        </div>
      </header>

      <div className="biz-body">
        {/* 左侧栏 */}
        <aside className="biz-sidebar">
          <div className="biz-section">
            <h3>基本信息</h3>
            <ul className="biz-info-list">
              <li>
                <span className="biz-label">性别</span>
                <span>{basic.gender}</span>
              </li>
              <li>
                <span className="biz-label">年龄</span>
                <span>{basic.age}岁</span>
              </li>
              <li>
                <span className="biz-label">学历</span>
                <span>{basic.education}</span>
              </li>
              <li>
                <span className="biz-label">经验</span>
                <span>{basic.yearsOfExperience}年</span>
              </li>
            </ul>
          </div>

          <div className="biz-section">
            <h3>专业技能</h3>
            {skills.map((s) => (
              <div key={s.category} className="biz-skill-block">
                <p className="biz-skill-cat">{s.category}</p>
                <div className="biz-tags">
                  {s.tags.map((t) => (
                    <span key={t} className="biz-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="biz-section">
            <h3>教育背景</h3>
            {education.map((e, i) => (
              <div key={i} className="biz-edu-item">
                <p className="biz-edu-school">{e.school}</p>
                <p className="biz-edu-major">
                  {e.major} · {e.degree}
                </p>
                <p className="biz-edu-date">
                  {e.startDate} - {e.endDate}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* 右侧主体 */}
        <main className="biz-main">
          <div className="biz-section">
            <h3>工作经历</h3>
            {workExperience.map((w) => (
              <div key={w.id} className="biz-block">
                <div className="biz-block-head">
                  <strong>{w.company}</strong>
                  <span className="biz-role">{w.position}</span>
                  <span className="biz-date">
                    {w.startDate} - {w.endDate}
                  </span>
                </div>
                {w.description && <p className="biz-desc">{w.description}</p>}
                {w.highlights.length > 0 && (
                  <ul>
                    {w.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="biz-section">
            <h3>项目经验</h3>
            {projects.map((p) => (
              <div key={p.id} className="biz-block">
                <div className="biz-block-head">
                  <strong>{p.name}</strong>
                  <span className="biz-company">{p.company}</span>
                  <span className="biz-date">
                    {p.startDate} - {p.endDate}
                  </span>
                </div>
                <p className="biz-tech">技术栈：{p.techStack.join(" + ")}</p>
                <p className="biz-desc">{p.description}</p>
                {p.responsibilities.length > 0 && (
                  <ul>
                    {p.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="biz-section">
            <h3>自我评价</h3>
            <ul>
              {selfEvaluation.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
