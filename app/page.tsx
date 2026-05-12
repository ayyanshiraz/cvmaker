"use client";
import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Document, Packer, Paragraph, TextRun, BorderStyle, Table, TableCell, TableRow, WidthType, convertInchesToTwip } from "docx";
import { CVData, initialData } from "@/components/cv-data";
import CvForm from "@/components/CvForm";
import CvPreview from "@/components/CvPreview";

export default function Home() {
  const [cvData, setCvData] = useState<CVData>(initialData);

  const cvRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: `${cvData.personalInfo.fullName}_CV`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0;
        padding: 0;
      }
      body {
        margin: 0;
        padding: 0;
      }
    `,
  });

  const handleWordExport = async () => {
    const paragraphs: Paragraph[] = [];

    // Header with name
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: cvData.personalInfo.fullName,
            bold: true,
            size: 32,
          }),
        ],
        alignment: "center",
      })
    );

    // Titles
    cvData.personalInfo.titles.forEach((title) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 22,
            }),
          ],
          alignment: "center",
        })
      );
    });

    // Contact info
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
          top: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    paragraphs.push(new Paragraph({ text: "" }));

    // Summary
    if (cvData.summary) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.summary,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.summary,
              size: 20,
            }),
          ],
        })
      );

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Skills
    if (cvData.skills.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.skills,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.skills.forEach((skill) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: skill.name,
                bold: true,
                size: 20,
              }),
            ],
            spacing: { before: 100, after: 0 },
          })
        );
        if (skill.description) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: skill.description,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      });

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Education
    if (cvData.education.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.education,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.education.forEach((edu) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree + (edu.subjects ? ` (${edu.subjects})` : ""),
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Certifications
    if (cvData.certifications.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.certifications,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.certifications.forEach((cert) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert,
                size: 20,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      });

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Tools
    if (cvData.tools.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.tools,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.tools.forEach((tool) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: tool.name,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        );
      });

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Experience
    if (cvData.experience.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.experience,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.experience.forEach((exp) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.title + (exp.company ? ` | ${exp.company}` : ""),
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: ` ${exp.dates}`,
                size: 20,
              }),
            ],
            spacing: { before: 100, after: 0 },
          })
        );
        if (exp.description) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.description,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      });

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Interests
    if (cvData.interests.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.interests,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.interests.forEach((interest) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `✔ ${interest}`,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        );
      });

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Languages
    if (cvData.languages.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.languages,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.languages.forEach((lang) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: lang.language,
                bold: true,
                size: 20,
              }),
              new TextRun({
                text: ` – ${lang.proficiency}`,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        );
      });

      paragraphs.push(new Paragraph({ text: "" }));
    }

    // Social Experience
    if (cvData.socialExperience.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cvData.sectionTitles.socialExperience,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      cvData.socialExperience.forEach((exp) => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `✔ ${exp}`,
                size: 20,
              }),
            ],
            spacing: { after: 50 },
          })
        );
      });
    }

    // Custom sections
    cvData.customSections.forEach((section) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.title,
              bold: true,
              size: 26,
            }),
          ],
          border: {
            bottom: {
              color: "000000",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: section.content,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })
      );
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cvData.personalInfo.fullName}_CV.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  return (
    <main className="flex h-screen bg-gray-100">
      {/* LEFT SIDE: Input Form */}
      <section className="w-1/2 overflow-y-auto bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Enter Your Details</h1>
        <CvForm cvData={cvData} setCvData={setCvData} />
      </section>

      {/* RIGHT SIDE: Live Template Preview */}
      <section className="flex w-1/2 flex-col items-center overflow-y-auto bg-gray-100 p-8">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handlePrint()}
            className="rounded bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            📄 Download PDF
          </button>
          <button
            onClick={handleWordExport}
            className="rounded bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 transition-colors"
          >
            📥 Download Word
          </button>
        </div>

        {/* A4 CV Template Container */}
        <div
          ref={cvRef}
          className="w-[210mm] min-h-[297mm] bg-white p-10 shadow-2xl"
          style={{ boxSizing: "border-box" }}
        >
          <CvPreview cvData={cvData} />
        </div>
      </section>
    </main>
  );
}