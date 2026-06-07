import type { AdaptedResume } from "../../types";
import "./ResumePreview.css";
import { SimpleTemplate } from "../../templates/simple/SimpleTemplate";
import { BusinessTemplate } from "../../templates/business/BusinessTemplate";
import { CreativeTemplate } from "../../templates/creative/CreativeTemplate";

interface Props {
  data: AdaptedResume | null;
  templateId: string;
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

export function ResumePreview({ data, templateId, ref }: Props) {
  if (!data) return null;

  const Template = TEMPLATES[templateId] || SimpleTemplate;

  return (
    <div className="preview-wrapper" ref={ref}>
      <Template data={data} />
    </div>
  );
}
