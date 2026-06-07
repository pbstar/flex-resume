import type { AdaptedResume } from "../../types";
import simpleCSS from "./SimpleTemplate.css?inline";

interface Props {
  data: AdaptedResume;
}

export function SimpleTemplate({ data }: Props) {
  const { basic, skills, workExperience, projects, education, selfEvaluation } =
    data;

  return (
    <div className="resume simple-template">
      <style>{simpleCSS}</style>
      {/* 头部：姓名 + 基本信息 */}
      <h1>{basic.name}</h1>
      <div className="basic-info">
        <span>{basic.title}</span>
        <span className="sep">|</span>
        <span>{basic.gender}</span>
        <span className="sep">|</span>
        <span>{basic.age}岁</span>
        <span className="sep">|</span>
        <span>{basic.education}</span>
        <span className="sep">|</span>
        <span>{basic.yearsOfExperience}年经验</span>
        <br />
        <span>{basic.phone}（微信同号）</span>
        <span className="sep">|</span>
        <span>{basic.email}</span>
        <span className="sep">|</span>
        <span>{basic.github}</span>
      </div>

      {/* 专业技能 */}
      <h2>专业技能</h2>
      {skills.map((skill) => (
        <div key={skill.category} className="skill-group">
          <h3>{skill.category}</h3>
          <p className="skill-tags">{skill.tags.join("、")}</p>
        </div>
      ))}

      {/* 工作经历 */}
      <h2>工作经历</h2>
      {workExperience.map((work) => (
        <div key={work.id} className="block">
          <div className="block-header">
            <div className="block-title">
              <strong>{work.company}</strong>
              <span className="sep">|</span>
              <span>{work.position}</span>
            </div>
            <div className="block-date">
              {work.startDate} - {work.endDate}
            </div>
          </div>
          {work.description && <p className="block-desc">{work.description}</p>}
          {work.highlights.length > 0 && (
            <ul>
              {work.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* 项目经验 */}
      <h2>项目经验</h2>
      {projects.map((proj) => (
        <div key={proj.id} className="block">
          <div className="block-header">
            <div className="block-title">
              <strong>
                {proj.company} · {proj.name}
              </strong>
              <span className="platform-tag">
                {proj.platform === "Mobile" ? "移动端" : "PC端"}
              </span>
            </div>
          </div>
          <p className="tech-stack">
            <strong>技术要点：</strong>
            {proj.techStack.join(" + ")}
          </p>
          <p className="block-desc">
            <strong>项目描述：</strong>
            {proj.description}
          </p>
          {proj.responsibilities.length > 0 && (
            <>
              <p className="block-desc">
                <strong>项目职责：</strong>
              </p>
              <ul>
                {proj.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}
          {proj.highlights.length > 0 && (
            <ul className="highlights">
              {proj.highlights.map((h, i) => (
                <li key={i}>🏆 {h}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* 教育背景 */}
      <h2>教育背景</h2>
      <ul>
        {education.map((edu, i) => (
          <li key={i}>
            <div className="block-header">
              <div>
                <strong>{edu.school}</strong>
                <span className="sep">|</span>
                <span>{edu.major}</span>
                <span className="sep">|</span>
                <span>{edu.degree}</span>
              </div>
              <span>
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* 自我评价 */}
      <h2>自我评价</h2>
      <ul>
        {selfEvaluation.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
