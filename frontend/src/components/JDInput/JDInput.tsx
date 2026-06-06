import { useState } from "react";
import type { ResumeConfig, GreetingConfig } from "../../types";
import "./JDInput.css";

interface Props {
  jd: string;
  onJdChange: (jd: string) => void;
  companyIntro: string;
  onCompanyIntroChange: (intro: string) => void;
  onGenerateResume: (jd: string, config: ResumeConfig) => void;
  onGenerateGreeting: (
    jd: string,
    companyIntro: string,
    config: GreetingConfig,
  ) => void;
  loading: "resume" | "greeting" | null;
}

export function JDInput({
  jd,
  onJdChange,
  companyIntro,
  onCompanyIntroChange,
  onGenerateResume,
  onGenerateGreeting,
  loading,
}: Props) {
  const [showResumeConfig, setShowResumeConfig] = useState(false);
  const [showGreetingConfig, setShowGreetingConfig] = useState(false);

  const [resumeLength, setResumeLength] = useState("1页");
  const [resumeStyle, setResumeStyle] = useState<ResumeConfig["style"]>("专业");

  const [greetingCount, setGreetingCount] = useState(3);
  const [greetingStyle, setGreetingStyle] =
    useState<GreetingConfig["style"]>("简洁直接");
  const [greetingMaxWords, setGreetingMaxWords] =
    useState<GreetingConfig["maxWords"]>("50-150字");

  const isEmpty = !jd.trim();

  return (
    <div className="jd-input">
      <div className="jd-row">
        <div className="jd-field">
          <label className="jd-label">
            岗位描述 (JD) <span className="jd-optional">必填</span>
          </label>
          <textarea
            placeholder="粘贴目标岗位的职位描述"
            rows={5}
            value={jd}
            onChange={(e) => onJdChange(e.target.value)}
          />
        </div>
        <div className="jd-field">
          <label className="jd-label">
            公司信息 <span className="jd-optional">选填</span>
          </label>
          <textarea
            placeholder="公司名称、业务领域、规模等，用于生成更精准的打招呼话术"
            rows={5}
            value={companyIntro}
            onChange={(e) => onCompanyIntroChange(e.target.value)}
          />
        </div>
      </div>

      <div className="jd-actions">
        <div className="action-group">
          <button
            className="btn-accent"
            disabled={loading !== null || isEmpty}
            onClick={() =>
              onGenerateGreeting(jd, companyIntro, {
                count: greetingCount,
                style: greetingStyle,
                maxWords: greetingMaxWords,
              })
            }
          >
            {loading === "greeting" ? <span className="spinner" /> : null}
            {loading === "greeting" ? "生成中…" : "✨ 生成话术"}
          </button>
          <button
            className="btn-config"
            onClick={() => setShowGreetingConfig(!showGreetingConfig)}
          >
            {showGreetingConfig ? "收起 ▲" : "选项 ▼"}
          </button>
          {showGreetingConfig && (
            <div className="config-panel">
              <label>
                条数
                <select
                  value={greetingCount}
                  onChange={(e) => setGreetingCount(+e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} 条
                    </option>
                  ))}
                </select>
              </label>
              <label>
                风格
                <select
                  value={greetingStyle}
                  onChange={(e) =>
                    setGreetingStyle(e.target.value as GreetingConfig["style"])
                  }
                >
                  <option value="简洁直接">简洁直接</option>
                  <option value="专业正式">专业正式</option>
                  <option value="亲切热情">亲切热情</option>
                </select>
              </label>
              <label>
                字数
                <select
                  value={greetingMaxWords}
                  onChange={(e) =>
                    setGreetingMaxWords(
                      e.target.value as GreetingConfig["maxWords"],
                    )
                  }
                >
                  <option value="50字以内">50字以内</option>
                  <option value="50-150字">50-150字</option>
                  <option value="150字以上">150字以上</option>
                </select>
              </label>
            </div>
          )}
        </div>

        <div className="action-group">
          <button
            className="btn-primary"
            disabled={loading !== null || isEmpty}
            onClick={() =>
              onGenerateResume(jd, {
                length: resumeLength,
                style: resumeStyle,
              })
            }
          >
            {loading === "resume" ? <span className="spinner" /> : null}
            {loading === "resume" ? "AI 组装中…" : "📄 生成简历"}
          </button>
          <button
            className="btn-config"
            onClick={() => setShowResumeConfig(!showResumeConfig)}
          >
            {showResumeConfig ? "收起 ▲" : "选项 ▼"}
          </button>
          {showResumeConfig && (
            <div className="config-panel">
              <label>
                篇幅
                <select
                  value={resumeLength}
                  onChange={(e) => setResumeLength(e.target.value)}
                >
                  {["1页", "2页", "3页", "4页", "5页"].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                风格
                <select
                  value={resumeStyle}
                  onChange={(e) =>
                    setResumeStyle(e.target.value as ResumeConfig["style"])
                  }
                >
                  <option value="专业">专业</option>
                  <option value="亲和">亲和</option>
                  <option value="简洁">简洁</option>
                </select>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
