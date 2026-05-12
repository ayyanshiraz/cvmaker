"use client";

import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Document, Packer, Paragraph, TextRun, BorderStyle } from "docx";
import { CVData, initialData } from "@/components/cv-data";
import CvForm from "@/components/CvForm";
import CvPreview from "@/components/CvPreview";

export default function Home() {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const cvRef = useRef(null);

  // --- PDF EXPORT LOGIC ---
  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `${cvData.personalInfo.fullName}_CV`,
    // We let CvPreview.tsx handle the heavy lifting for print styles, 
    // but we inject this to guarantee no browser margins are added.
    pageStyle: `
      @page { size: A4 portrait; margin: 0; }
      body { margin: 0; padding: 0; background: white; }
    `,
  });

  // --- WORD (DOCX) EXPORT LOGIC ---
  const handleWordExport = async () => {
    const paragraphs: Paragraph[] = [];

    // 1. Header (Name)
    paragraphs.push(
      new Paragraph({
        children: [new TextRun({ text: cvData.personalInfo.fullName, bold: true, size: 32 })],
        alignment: "center",
      })
    );

    // 2. Titles
    cvData.personalInfo.titles.forEach((title) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: title, bold: true, size: 22 })],
          alignment: "center",
        })
      );
    });

    // 3. Contact Info
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Voice: ${cvData.personalInfo.phone || "N/A"} | Email: ${cvData.personalInfo.email || "N/A"} | DOB: ${cvData.personalInfo.dob || "N/A"}`,
            size: 20,
          }),
        ],
        alignment: "center",
        border: {
          top: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 },
          bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 },
        },
        spacing: { before: 100, after: 200 },
      })
    );

    // Helper to generate section headers
    const addSectionHeader = (title: string) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 26, color: "555555" })],
          border: { bottom: { color: "CCCCCC", space: 1, style: BorderStyle.SINGLE, size: 6 } },
          spacing: { before: 200, after: 100 },
        })
      );
    };

    // 4. Render Native Sections dynamically based on sectionOrder
    cvData.sectionOrder.forEach((sectionKey) => {
      const title = cvData.sectionTitles[sectionKey as keyof typeof cvData.sectionTitles] || sectionKey;

      if (sectionKey.startsWith("custom-")) {
        const section = cvData.customSections.find(s => s.id === sectionKey);
        if (section) {
          addSectionHeader(section.title);
          section.items.forEach(item => {
            if (item) paragraphs.push(new Paragraph({ children: [new TextRun({ text: `✔ ${item}`, size: 20 })] }));
          });
        }
        return;
      }

      switch (sectionKey) {
        case "summary":
          if (cvData.summary) {
            addSectionHeader(title);
            paragraphs.push(new Paragraph({ children: [new TextRun({ text: cvData.summary, size: 20 })] }));
          }
          break;

        case "experience":
          if (cvData.experience.length > 0) {
            addSectionHeader(title);
            cvData.experience.forEach((exp) => {
              paragraphs.push(new Paragraph({
                children: [
                  new TextRun({ text: `${exp.title}${exp.company ? ` | ${exp.company}` : ""}`, bold: true, size: 20 }),
                  new TextRun({ text: `   (${exp.dates})`, size: 18, color: "555555" }),
                ],
                spacing: { before: 100 }
              }));
              if (exp.description) paragraphs.push(new Paragraph({ children: [new TextRun({ text: exp.description, size: 20 })] }));
            });
          }
          break;

        case "skills":
          if (cvData.skills.length > 0) {
            addSectionHeader(title);
            cvData.skills.forEach((skill) => {
              paragraphs.push(new Paragraph({
                children: [
                  new TextRun({ text: `✔ ${skill.name}`, bold: true, size: 20 }),
                  ...(skill.description ? [new TextRun({ text: ` – ${skill.description}`, size: 20 })] : [])
                ]
              }));
            });
          }
          break;

        case "education":
          if (cvData.education.length > 0) {
            addSectionHeader(title);
            cvData.education.forEach((edu) => {
              paragraphs.push(new Paragraph({
                children: [
                  new TextRun({ text: `${edu.degree}${edu.institution ? ` | ${edu.institution}` : ""}`, bold: true, size: 20 }),
                  new TextRun({ text: `   (${edu.dates})`, size: 18, color: "555555" }),
                ],
                spacing: { before: 100 }
              }));
              if (edu.details) paragraphs.push(new Paragraph({ children: [new TextRun({ text: edu.details, size: 20 })] }));
            });
          }
          break;

        case "certifications":
          if (cvData.certifications.length > 0) {
            addSectionHeader(title);
            cvData.certifications.forEach((cert) => {
              paragraphs.push(new Paragraph({ children: [new TextRun({ text: `✔ ${cert}`, size: 20 })] }));
            });
          }
          break;

        case "tools":
          if (cvData.tools.length > 0) {
            addSectionHeader(title);
            cvData.tools.forEach((tool) => {
              paragraphs.push(new Paragraph({ children: [new TextRun({ text: `• ${tool.name} (${tool.proficiency}/5)`, size: 20 })] }));
            });
          }
          break;

        case "interests":
        case "socialExperience":
          const items = cvData[sectionKey as "interests" | "socialExperience"];
          if (items.length > 0) {
            addSectionHeader(title);
            items.forEach((item) => {
              paragraphs.push(new Paragraph({ children: [new TextRun({ text: `✔ ${item}`, size: 20 })] }));
            });
          }
          break;

        case "languages":
          if (cvData.languages.length > 0) {
            addSectionHeader(title);
            cvData.languages.forEach((lang) => {
              paragraphs.push(new Paragraph({
                children: [
                  new TextRun({ text: lang.language, bold: true, size: 20 }),
                  new TextRun({ text: ` – ${lang.proficiency}`, size: 20 })
                ]
              }));
            });
          }
          break;
      }
    });

    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  return (
    <main className="flex h-screen bg-gray-100 font-sans">
      {/* LEFT SIDE: Input Form */}
      <section className="w-1/2 overflow-y-auto bg-white p-8 shadow-xl z-10 relative">
        <h1 className="mb-8 text-3xl font-extrabold text-gray-900 tracking-tight">CV Builder</h1>
        <CvForm cvData={cvData} setCvData={setCvData} />
      </section>

      {/* RIGHT SIDE: Live Template Preview */}
      <section className="flex w-1/2 flex-col items-center overflow-y-auto bg-gray-200 p-8">
        
        {/* Sticky Action Bar */}
        <div className="flex gap-4 mb-6 sticky top-0 z-50 bg-gray-200/90 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-300">
          <button
            onClick={() => handlePrint()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95"
          >
            📄 Download PDF
          </button>
          <button
            onClick={handleWordExport}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all active:scale-95"
          >
            📥 Download Word
          </button>
        </div>

        <div className="w-full flex justify-center pb-20">
          {/* THE FIX: 
            1. This OUTER div has the shadow-2xl. It is ONLY for the screen. 
            2. The INNER div has the cvRef. The printer will only grab the inner div.
            Because the shadow is on the outside, the printer never sees it!
          */}
          <div className="shadow-2xl ring-1 ring-gray-300 bg-white overflow-hidden">
            <div ref={cvRef} className="bg-white">
              <CvPreview cvData={cvData} />
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}