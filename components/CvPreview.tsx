import { CVData } from "./cv-data";

interface CvPreviewProps {
  cvData: CVData;
}

export default function CvPreview({ cvData }: CvPreviewProps) {
  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="mb-2 border-b border-black pb-0.5 text-[13pt] font-bold uppercase tracking-wide">
      {title}
    </h2>
  );

  const renderSection = (sectionKey: string) => {
    const title = cvData.sectionTitles[sectionKey as keyof typeof cvData.sectionTitles];

    switch (sectionKey) {
      case "summary":
        return cvData.summary ? (
          <div className="mb-3">
            <SectionHeader title={title} />
            <p className="text-justify text-[10pt] leading-snug">{cvData.summary}</p>
          </div>
        ) : null;

      case "experience":
        return cvData.experience.length > 0 ? (
          <div className="mb-3">
            <SectionHeader title={title} />
            <div className="space-y-2">
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="text-justify text-[10pt]">
                  <div className="flex justify-between font-bold">
                    <span>
                      {exp.title}
                      {exp.company && ` | ${exp.company}`}
                    </span>
                    <span className="font-normal">{exp.dates}</span>
                  </div>
                  {exp.description && (
                    <p className="mt-0.5 text-justify text-[9.5pt]">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return cvData.skills.length > 0 ? (
          <div className="mb-3">
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.skills.map((skill, idx) => (
                <li key={idx} className="flex gap-2 text-justify text-[10pt] leading-tight">
                  <span className="mt-0.5 shrink-0 text-green-600">✔</span>
                  <span>
                    <span className="font-bold">{skill.name}</span>
                    {skill.description && ` – ${skill.description}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "education":
        return cvData.education.length > 0 ? (
          <div className="mb-3">
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.education.map((edu, idx) => (
                <li key={idx} className="text-[10pt] leading-tight">
                  <span className="font-bold">{edu.degree}</span>
                  {edu.subjects && <span> ({edu.subjects})</span>}
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "certifications":
        return cvData.certifications.length > 0 ? (
          <div className="mb-3">
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.certifications.map((cert, idx) => (
                <li key={idx} className="flex gap-2 text-[10pt]">
                  <span className="text-green-600">✔</span>
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "tools":
        return cvData.tools.length > 0 ? (
          <div className="mb-3">
            <SectionHeader title={title} />
            <div className="space-y-1">
              {cvData.tools.map((tool, idx) => (
                <div key={idx} className="flex items-center justify-between text-[10pt]">
                  <span className="flex-1">{tool.name}</span>
                  <span className="ml-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          i <= tool.proficiency ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return cvData.interests.length > 0 ? (
          <div>
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.interests.map((interest, idx) => (
                <li key={idx} className="flex gap-2 text-[10pt] leading-tight">
                  <span className="mt-0.5 text-green-600">✔</span>
                  <span>{interest}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "socialExperience":
        return cvData.socialExperience.length > 0 ? (
          <div>
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.socialExperience.map((exp, idx) => (
                <li key={idx} className="flex gap-2 text-[10pt]">
                  <span className="text-green-600">✔</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "languages":
        return cvData.languages.length > 0 ? (
          <div>
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.languages.map((lang, idx) => (
                <li key={idx} className="text-[10pt] leading-tight">
                  <span className="font-bold">{lang.language}</span> – {lang.proficiency}
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Generate content to render
  const renderAllContent = () => {
    return (
      <>
        {/* HEADER SECTION WITH NAME AND PHOTO */}
        <div className="mb-3 flex items-start justify-between gap-4">
          {/* Left: Name and Titles */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold uppercase tracking-wider">
              {cvData.personalInfo.fullName}
            </h1>
            <div className="mt-1 space-y-0 font-semibold text-gray-900">
              {cvData.personalInfo.titles.map((title, idx) => (
                <div key={idx} className="text-[11pt] leading-tight">
                  {title}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo Box */}
          <div className="h-32 w-24 shrink-0 overflow-hidden border-2 border-gray-800 bg-gray-100 flex items-center justify-center">
            {cvData.personalInfo.photoUrl ? (
              <img
                src={cvData.personalInfo.photoUrl}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">Photo</span>
            )}
          </div>
        </div>

        {/* CONTACT INFO BAR */}
        <div className="mb-3 border-b border-t border-black py-1 text-[10pt]">
          <div className="flex gap-8">
            <span>
              <span className="font-bold">Voice:</span> {cvData.personalInfo.phone || "______________"}
            </span>
            <span>
              <span className="font-bold">Email:</span> {cvData.personalInfo.email || "______________"}
            </span>
            <span>
              <span className="font-bold">DOB:</span> {cvData.personalInfo.dob || "______________"}
            </span>
          </div>
        </div>

        {/* RENDER SECTIONS IN ORDER */}
        <div>
          {cvData.sectionOrder.map((sectionKey) => (
            <div key={sectionKey}>{renderSection(sectionKey)}</div>
          ))}
        </div>

        {/* TWO-COLUMN LAYOUT FOR INTERESTS AND LANGUAGES */}
        {(cvData.interests.length > 0 || cvData.languages.length > 0) && (
          <div className="mt-3 grid grid-cols-2 gap-6">
            {cvData.interests.length > 0 && (
              <div>{renderSection("interests")}</div>
            )}
            {cvData.languages.length > 0 && (
              <div>{renderSection("languages")}</div>
            )}
          </div>
        )}

        {/* CUSTOM SECTIONS */}
        {cvData.customSections.map((section) => (
          <div key={section.id} className="mb-3">
            <SectionHeader title={section.title} />
            <p className="whitespace-pre-wrap text-justify text-[10pt] leading-snug">{section.content}</p>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="space-y-0">
      {/* A4 PAGE CONTAINER WITH PAGINATION SUPPORT */}
      <div
        className="font-serif text-[10pt] leading-tight text-black mx-auto bg-white"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "20mm",
          boxSizing: "border-box",
          pageBreakAfter: "always",
          breakAfter: "page",
        }}
      >
        {renderAllContent()}
      </div>

      {/* PRINT STYLES FOR PAGINATION */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4;
            margin: 0;
          }
          div[style*="page-break"] {
            page-break-after: always;
            break-after: page;
          }
        }
      `}</style>
    </div>
  );
}