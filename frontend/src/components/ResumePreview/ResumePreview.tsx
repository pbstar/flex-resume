import type { AdaptedResume } from "../../types";
import "./ResumePreview.css";
import { SimpleTemplate } from "../../templates/simple/SimpleTemplate";
import { BusinessTemplate } from "../../templates/business/BusinessTemplate";
import { CreativeTemplate } from "../../templates/creative/CreativeTemplate";

interface Props {
  data: AdaptedResume | null;
  templateId: string;
  loading: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const TEMPLATES: Record<
  string,
  React.ComponentType<{ data: AdaptedResume }>
> = {
  simple: SimpleTemplate,
  business: BusinessTemplate,
  creative: CreativeTemplate,
};

export function ResumePreview({ data, templateId, loading, ref }: Props) {
  if (!data) {
    return (
      <div className="preview-placeholder">
        <p>输入 JD 并点击「生成简历」，在此预览适配后的简历</p>
      </div>
    );
  }

  const Template = TEMPLATES[templateId] || SimpleTemplate;

  return (
    <div className="preview-wrapper" ref={ref}>
      <Template data={data} />
      {loading && (
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
    </div>
  );
}
