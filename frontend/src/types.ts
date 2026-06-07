/** 与 raw-resume.json 结构一致的简历数据 */
export interface AdaptedResume {
  basic: {
    name: string;
    title: string;
    gender: string;
    age: number;
    education: string;
    yearsOfExperience: number;
    phone: string;
    email: string;
    github: string;
    blog: string;
  };
  skills: {
    category: string;
    tags: string[];
  }[];
  workExperience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    highlights: string[];
    tags: string[];
  }[];
  projects: {
    id: string;
    company: string;
    name: string;
    platform: string;
    techStack: string[];
    description: string;
    responsibilities: string[];
    highlights: string[];
    tags: string[];
  }[];
  education: {
    school: string;
    major: string;
    degree: string;
    startDate: string;
    endDate: string;
  }[];
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
