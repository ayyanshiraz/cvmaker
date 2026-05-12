import { CVData } from "@/components/cv-data";

export async function parseLinkedInData(linkedInUrl: string, cvData: CVData): Promise<CVData> {
  try {
    // Extract LinkedIn profile ID from URL
    const profileMatch = linkedInUrl.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/);
    if (!profileMatch) {
      throw new Error("Invalid LinkedIn URL format");
    }

    // Call your backend API endpoint
    const response = await fetch("/api/fetch-linkedin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkedInUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch LinkedIn data");
    }

    const linkedInData = await response.json();

    // Helper to safely extract strings from unpredictable API data
    const safeString = (val: any): string => {
      if (!val) return "";
      if (typeof val === "string") return val;
      return val.name || val.title || val.text || String(val);
    };

    // Merge EVERYTHING the API gives us with the existing CV data
    const updatedCVData: CVData = {
      ...cvData,
      personalInfo: {
        ...cvData.personalInfo,
        fullName: linkedInData.fullName || linkedInData.name || cvData.personalInfo.fullName,
        email: linkedInData.email || cvData.personalInfo.email,
        phone: linkedInData.phone || cvData.personalInfo.phone,
        photoUrl: linkedInData.photoUrl || linkedInData.profilePicture || cvData.personalInfo.photoUrl,
        // Map titles if available, otherwise fallback to headline
        titles: linkedInData.titles?.length 
          ? linkedInData.titles.map(safeString) 
          : (linkedInData.headline ? [linkedInData.headline] : cvData.personalInfo.titles),
        dob: linkedInData.dob || cvData.personalInfo.dob,
      },
      summary: linkedInData.summary || linkedInData.about || linkedInData.headline || cvData.summary,
      
      experience: linkedInData.experience?.length
        ? linkedInData.experience.map((exp: any) => ({
            title: exp.title || "",
            company: exp.company || "",
            dates: exp.dates || exp.duration || exp.timePeriod || "",
            description: exp.description || "",
          }))
        : cvData.experience,
        
      education: linkedInData.education?.length
        ? linkedInData.education.map((edu: any) => ({
            degree: edu.degree || "",
            subjects: edu.field || edu.fieldOfStudy || edu.subjects || "",
          }))
        : cvData.education,
        
      skills: linkedInData.skills?.length
        ? linkedInData.skills.map((skill: any) => ({
            name: safeString(skill),
            description: typeof skill === 'object' ? (skill.description || "") : "",
          }))
        : cvData.skills,
        
      certifications: linkedInData.certifications?.length
        ? linkedInData.certifications.map(safeString)
        : (linkedInData.licensesAndCertifications?.length ? linkedInData.licensesAndCertifications.map(safeString) : cvData.certifications),
        
      tools: linkedInData.tools?.length
        ? linkedInData.tools.map((tool: any) => ({
            name: safeString(tool),
            proficiency: typeof tool === 'object' ? (tool.proficiency || 5) : 5
          }))
        : cvData.tools,
        
      languages: linkedInData.languages?.length
        ? linkedInData.languages.map((lang: any) => {
            if (typeof lang === 'object' && lang !== null) {
              return {
                language: lang.language || lang.name || "",
                proficiency: ["Fluent", "Native", "Bilingual"].includes(lang.proficiency) ? lang.proficiency : "Fluent" as const
              };
            }
            return { language: String(lang), proficiency: "Fluent" as const };
          })
        : cvData.languages,
        
      interests: linkedInData.interests?.length
        ? linkedInData.interests.map(safeString)
        : cvData.interests,
        
      socialExperience: linkedInData.volunteering?.length
        ? linkedInData.volunteering.map(safeString)
        : (linkedInData.socialExperience?.length ? linkedInData.socialExperience.map(safeString) : cvData.socialExperience),
        
    };

    return updatedCVData;
  } catch (error) {
    console.error("LinkedIn parsing error:", error);
    throw error;
  }
}