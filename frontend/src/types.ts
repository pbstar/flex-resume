/** 与 raw-resume.json 结构一致的简历数据 */
export interface AdaptedResume {
  /** 基本信息 */
  basic: {
    /** 姓名 */
    name: string;
    /** 当前职位/头衔 */
    title: string;
    /** 性别 */
    gender: string;
    /** 年龄 */
    age: number;
    /** 学历（如"本科"、"硕士"） */
    education: string;
    /** 工作年限 */
    yearsOfExperience: number;
    /** 手机号 */
    phone: string;
    /** 邮箱 */
    email: string;
    /** GitHub 主页地址 */
    github: string;
    /** 个人博客地址 */
    blog: string;
  };
  /** 技能列表，按分类组织 */
  skills: {
    /** 技能分类名称（如"前端"、"后端"、"工具"） */
    category: string;
    /** 该分类下的技能标签 */
    tags: string[];
  }[];
  /** 工作经历 */
  workExperience: {
    /** 唯一标识 */
    id: string;
    /** 公司名称 */
    company: string;
    /** 职位名称 */
    position: string;
    /** 入职日期（YYYY-MM） */
    startDate: string;
    /** 离职日期（YYYY-MM 或 "至今"） */
    endDate: string;
    /** 工作概述 */
    description: string;
    /** 工作亮点/成果 */
    highlights: string[];
    /** AI 匹配标签 */
    tags: string[];
  }[];
  /** 项目经历 */
  projects: {
    /** 唯一标识 */
    id: string;
    /** 所属公司 */
    company: string;
    /** 项目名称 */
    name: string;
    /** 所属平台（如"Web"、"小程序"、"App"） */
    platform: string;
    /** 技术栈列表 */
    techStack: string[];
    /** 项目概述 */
    description: string;
    /** 职责描述 */
    responsibilities: string[];
    /** 项目亮点/成果 */
    highlights: string[];
    /** AI 匹配标签 */
    tags: string[];
  }[];
  /** 教育经历 */
  education: {
    /** 学校名称 */
    school: string;
    /** 专业名称 */
    major: string;
    /** 学历（如"本科"、"硕士"） */
    level: string;
    /** 入学日期（YYYY-MM） */
    startDate: string;
    /** 毕业日期（YYYY-MM） */
    endDate: string;
  }[];
  /** 自我评价，多条要点 */
  selfEvaluation: string[];
}

export interface Greeting {
  text: string;
  label: string;
}

export interface ResumeConfig {
  length: string; // '1页' ~ '5页'
  style: "专业" | "亲和" | "简洁";
}

export interface GreetingConfig {
  count: number;
  style: "亲切热情" | "专业正式" | "简洁直接";
  maxWords: "50字以内" | "50-150字" | "150字以上";
}

export interface HistoryEntry {
  id: string;
  type: "resume" | "greeting";
  jd: string;
  result: unknown;
  createdAt: string;
}
