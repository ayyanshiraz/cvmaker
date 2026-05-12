import React from "react";
import { CVData } from "./cv-data";

interface CvPreviewProps {
  cvData: CVData;
}

export default function CvPreview({ cvData }: CvPreviewProps) {
  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="mb-2 border-b border-gray-300 pb-0.5 text-[11pt] font-extrabold uppercase tracking-widest text-gray-500 mt-4">
      {title}
    </h2>
  );

  const safeString = (val: any) => (val && typeof val !== "object" ? String(val) : "");

  const renderSection = (sectionKey: string) => {
    if (sectionKey.startsWith("custom-")) return null;

    const title = cvData.sectionTitles[sectionKey as keyof typeof cvData.sectionTitles] || sectionKey;

    switch (sectionKey) {
      case "summary":
        return cvData.summary ? (
          <div className="mb-4 page-break-inside-avoid">
            <SectionHeader title={title} />
            <p className="text-justify text-[10pt] leading-relaxed text-gray-800">{safeString(cvData.summary)}</p>
          </div>
        ) : null;

      case "experience":
        return cvData.experience.length > 0 ? (
          <div className="mb-4">
            <SectionHeader title={title} />
            <div className="space-y-3">
              {cvData.experience.map((exp, idx) => (
                <div key={idx} className="text-[10pt] text-gray-800 page-break-inside-avoid">
                  <div className="flex justify-between font-bold">
                    <span>
                      {safeString(exp.title)}
                      {exp.company && ` | ${safeString(exp.company)}`}
                    </span>
                    <span className="font-normal text-gray-600">{safeString(exp.dates)}</span>
                  </div>
                  {exp.description && (
                    <p className="mt-0.5 text-justify text-[9.5pt] leading-relaxed whitespace-pre-wrap">
                      {safeString(exp.description)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return cvData.skills.length > 0 ? (
          <div className="mb-4 page-break-inside-avoid">
            <SectionHeader title={title} />
            <ul className="grid grid-cols-2 gap-x-8 gap-y-1">
              {cvData.skills.map((skill, idx) => (
                <li key={idx} className="flex gap-2 text-[10pt] leading-tight text-gray-800">
                  <span className="text-gray-600">✔</span>
                  <span>
                    <span className="font-bold">{safeString(skill.name)}</span>
                    {skill.description && ` – ${safeString(skill.description)}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "education":
        return cvData.education.length > 0 ? (
          <div className="mb-4">
            <SectionHeader title={title} />
            <div className="space-y-2">
              {cvData.education.map((edu, idx) => (
                <div key={idx} className="text-[10pt] text-gray-800 page-break-inside-avoid">
                  <div className="flex justify-between font-bold">
                    <span>
                      {safeString(edu.degree)}
                      {edu.institution && ` | ${safeString(edu.institution)}`}
                    </span>
                    <span className="font-normal text-gray-600">{safeString(edu.dates)}</span>
                  </div>
                  {edu.details && (
                    <div className="text-[9.5pt] mt-0.5">{safeString(edu.details)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return cvData.certifications.length > 0 ? (
          <div className="mb-4 page-break-inside-avoid">
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.certifications.map((cert, idx) => (
                <li key={idx} className="flex gap-2 text-[10pt] text-gray-800">
                  <span className="text-gray-600">✔</span>
                  <span>{safeString(cert)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "tools":
        return cvData.tools.length > 0 ? (
          <div className="mb-4 page-break-inside-avoid">
            <SectionHeader title={title} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-6">
              {cvData.tools.map((tool, idx) => (
                <div key={idx} className="flex items-center gap-3 text-[10pt] text-gray-800">
                  <span className="font-medium truncate max-w-[120px]">{safeString(tool.name)}</span>
                  <div className="flex gap-1.5 shrink-0">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full ${
                          i <= tool.proficiency ? "bg-blue-600" : "bg-gray-200"
                        }`}
                        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return cvData.interests.length > 0 ? (
          <div className="page-break-inside-avoid">
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.interests.map((interest, idx) => (
                <li key={idx} className="flex gap-2 text-[10pt] leading-tight text-gray-800">
                  <span className="text-gray-600">✔</span>
                  <span>{safeString(interest)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "socialExperience":
        return cvData.socialExperience.length > 0 ? (
          <div className="mb-4 page-break-inside-avoid">
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.socialExperience.map((exp, idx) => (
                <li key={idx} className="flex gap-2 text-[10pt] text-gray-800">
                  <span className="text-gray-600">✔</span>
                  <span>{safeString(exp)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      case "languages":
        return cvData.languages.length > 0 ? (
          <div className="page-break-inside-avoid">
            <SectionHeader title={title} />
            <ul className="space-y-1">
              {cvData.languages.map((lang, idx) => (
                <li key={idx} className="text-[10pt] leading-tight text-gray-800">
                  <span className="font-bold">{safeString(lang.language)}</span> – {safeString(lang.proficiency)}
                </li>
              ))}
            </ul>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div>
      {/* THE PAPER CONTAINER */}
      <div className="cv-a4-paper shadow-2xl bg-white mx-auto font-sans text-[10pt] leading-tight text-black">
        
        {/* HEADER SECTION */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold uppercase tracking-widest text-gray-900 mb-1">
              {safeString(cvData.personalInfo.fullName)}
            </h1>
            <div className="space-y-0 font-semibold text-gray-700">
              {cvData.personalInfo.titles.map((title, idx) => (
                <div key={idx} className="text-[11pt] leading-tight">{safeString(title)}</div>
              ))}
            </div>
          </div>
          {cvData.personalInfo.photoUrl && (
            <div className="h-32 w-24 shrink-0 overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
              <img src={cvData.personalInfo.photoUrl} alt="Profile" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* CONTACT INFO BAR */}
        <div className="mb-5 border-b-2 border-t-2 border-gray-800 py-1.5 text-[10pt] text-gray-800">
          <div className="flex justify-between px-2">
            <span><span className="font-bold">Voice:</span> {safeString(cvData.personalInfo.phone) || "______________"}</span>
            <span><span className="font-bold">Email:</span> {safeString(cvData.personalInfo.email) || "______________"}</span>
            <span><span className="font-bold">DOB:</span> {safeString(cvData.personalInfo.dob) || "______________"}</span>
          </div>
        </div>

        {/* RENDER DYNAMIC SECTIONS */}
        <div>
          {cvData.sectionOrder.map((sectionKey) => {
            if (sectionKey.startsWith("custom-")) {
              const section = cvData.customSections.find(s => s.id === sectionKey);
              if (!section) return null;
              return (
                <div key={section.id} className="mb-4 page-break-inside-avoid">
                  <SectionHeader title={section.title} />
                  <ul className="space-y-1">
                    {section.items.map((item, idx) => (
                      item && (
                        <li key={idx} className="flex gap-2 text-[10pt] text-gray-800">
                          <span className="text-gray-600">✔</span>
                          <span>{safeString(item)}</span>
                        </li>
                      )
                    ))}
                  </ul>
                </div>
              );
            }
            return <div key={sectionKey}>{renderSection(sectionKey)}</div>;
          })}
        </div>
      </div>

      {/* STRICT PRINT STYLES */}
      <style>{`
        /* Screen styling for the paper */
        .cv-a4-paper {
          width: 210mm;
          min-height: 297mm;
          padding: 15mm 20mm;
          box-sizing: border-box;
        }

        /* Print styling overriding everything */
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 0; /* Important: Prevents printer default margins from generating blank pages */
          }
          .cv-a4-paper {
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 15mm 20mm !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}