export interface CVData {
  personalInfo: {
    fullName: string;
    titles: string[];
    phone: string;
    email: string;
    dob: string;
    photoUrl: string; // Now base64 encoded image
  };
  summary: string;
  experience: Array<{ title: string; company: string; dates: string; description: string }>;
  skills: Array<{ name: string; description: string }>;
  education: Array<{ degree: string; subjects: string }>;
  certifications: string[];
  tools: Array<{ name: string; proficiency: number }>;
  interests: string[];
  socialExperience: string[];
  languages: Array<{ language: string; proficiency: "Fluent" | "Native" | "Bilingual" }>;
  sectionTitles: {
    summary: string;
    experience: string;
    skills: string;
    education: string;
    certifications: string;
    tools: string;
    interests: string;
    socialExperience: string;
    languages: string;
  };
  sectionOrder: string[];
  customSections: Array<{ id: string; title: string; content: string }>;
}

export const initialData: CVData = {
  personalInfo: {
    fullName: "M S A",
    titles: [
      "Business Development Professional | Market Research",
      "HubSpot Certified Digital Marketer",
      "Lead Generation Specialist"
    ],
    phone: "",
    email: "",
    dob: "",
    photoUrl: ""
  },
  summary: "Results-driven business development professional with experience in inbound and outbound sales, B2B lead generation, and digital marketing strategies. Skilled in identifying potential clients, crafting targeted email campaigns, driving brand visibility, building professional networks and driving revenue growth. Passionate about helping businesses grow through strategic partnerships and result-oriented sales approaches. A disciplined individual and a dedicated team player with a strong work ethic, always eager to learn and deliver value.",
  experience: [],
  skills: [
    {
      name: "Inbound & Outbound Sales Expertise",
      description: "Cultivating warm leads through inbound strategies or proactively pursuing opportunities through outbound channels, I am skilled in converting prospects into loyal clients."
    },
    {
      name: "Lead Generation",
      description: "Strong command in identifying and connecting with potential clients, generating sales qualified leads and ensuring a robust pipeline that fuels business growth."
    },
    {
      name: "Email Marketing",
      description: "I excel in designing and executing outbound email campaigns that resonate with the target audience, generating sales qualified meetings"
    },
    {
      name: "Digital Marketing",
      description: "HubSpot Certified Digital Marketer. Social Media Marketing, Email Marketing, Web-based ads and PPC."
    },
    {
      name: "Expert Networking",
      description: "Continuously engaged with potential & existing clients in meetings (US, EU region), building meaningful connections and fostering long-lasting partnerships."
    }
  ],
  education: [
    { degree: "Bachelor of Business Administration (Hons)", subjects: "" },
    { degree: "A-Levels", subjects: "Physics, Chemistry, Mathematics, Information & Communication Technology" },
    { degree: "O-Levels", subjects: "Sciences" }
  ],
  certifications: [
    "HubSpot Academy – Digital Marketing (Credential ID: )"
  ],
  tools: [
    { name: "LinkedIn Sales Navigator", proficiency: 5 },
    { name: "HubSpot", proficiency: 5 },
    { name: "Snov.io", proficiency: 5 },
    { name: "MS Office", proficiency: 5 },
    { name: "Seamless.ai", proficiency: 5 },
    { name: "Salesforce", proficiency: 4 },
    { name: "Apollo.io", proficiency: 4 },
    { name: "Hunter.io", proficiency: 4 },
    { name: "Instantly", proficiency: 4 },
    { name: "Crunchbase", proficiency: 4 },
    { name: "Clay", proficiency: 3 },
    { name: "Zoho", proficiency: 2 }
  ],
  interests: [
    "Gym-Maintaining healthy lifestyle",
    "Snooker-Silver Medalist",
    "Ping Pong-Punjab Olympics",
    "Travelling-Hilly Areas",
    "Music-Can play 3 instruments",
    "Learning Digital Skills"
  ],
  socialExperience: [
    "Student Council – Sports President (O-Levels, 2013 – 2014)",
    "Snooker Head – Silver Medalist (A-Levels, 2015 – 2016)",
    "JT MUN 2016 – Worked with more than 60 members in logistics team",
    "Volunteer In Services – Covid-19 awareness campaign, WWF Nature Carnivals"
  ],
  languages: [
    { language: "English", proficiency: "Fluent" },
    { language: "Urdu", proficiency: "Fluent" },
    { language: "Seraiki", proficiency: "Native" },
    { language: "Punjabi", proficiency: "Bilingual" }
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
  customSections: []
};