export interface CVData {
  personalInfo: {
    fullName: string;
    titles: string[];
    phone: string;
    email: string;
    dob: string;
    photoUrl: string;
  };
  summary: string;
  experience: Array<{ title: string; company: string; dates: string; description: string }>;
  skills: Array<{ name: string; description: string }>;
  education: Array<{ degree: string; institution: string; dates: string; details: string }>;
  certifications: string[];
  tools: Array<{ name: string; proficiency: number }>;
  interests: string[];
  socialExperience: string[];
  languages: Array<{ language: string; proficiency: "Native" | "Bilingual" | "Fluent" | "Proficient" | "Conversational" }>;
  sectionOrder: string[];
  sectionTitles: Record<string, string>;
  customSections: Array<{ id: string; title: string; items: string[] }>;
}

export const initialData: CVData = {
  personalInfo: {
    fullName: "",
    titles: [""],
    phone: "",
    email: "",
    dob: "",
    photoUrl: ""
  },
  summary: "",
  experience: [],
  skills: [],
  education: [],
  certifications: [],
  tools: [],
  interests: [],
  socialExperience: [],
  languages: [],
  sectionOrder: [
    "summary",
    "experience",
    "skills",
    "education",
    "certifications",
    "tools",
    "interests",
    "socialExperience",
    "languages"
  ],
  sectionTitles: {
    summary: "Summary",
    experience: "Professional Experience",
    skills: "Key Skills Profile",
    education: "Education",
    certifications: "Certifications",
    tools: "Tools & Proficiency Levels",
    interests: "Personal Interests",
    socialExperience: "Social Experience",
    languages: "Languages"
  },
  customSections: []
};