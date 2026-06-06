import type { AdaptedResume } from "../../types";
import { SimpleTemplate } from "../../templates/simple/SimpleTemplate";
import { BusinessTemplate } from "../../templates/business/BusinessTemplate";
import { CreativeTemplate } from "../../templates/creative/CreativeTemplate";
import "./TemplateRenderer.css";

interface Props {
  data: AdaptedResume | null;
  templateId: string;
}

const TEMPLATES: Record<
  string,
  React.ComponentType<{ data: AdaptedResume }>
> = {
  simple: SimpleTemplate,
  business: BusinessTemplate,
  creative: CreativeTemplate,
};

export function TemplateRenderer({ data, templateId }: Props) {
  if (!data) {
    return (
      <div className="preview-placeholder">
        <p>输入 JD 并点击「生成简历」，在此预览适配后的简历</p>
      </div>
    );
  }

  const Template = TEMPLATES[templateId] || SimpleTemplate;

  return (
    <div className="template-container">
      <Template data={data} />
    </div>
  );
}
