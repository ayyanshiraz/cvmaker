"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, Plus, X, Sparkles, User, FileText, 
  Briefcase, GraduationCap, Award, Wrench, Heart, Users, Globe 
} from "lucide-react";
import { CVData } from "./cv-data";

interface CvFormProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

// --- Draggable Wrapper Component ---
function DraggableSection({ sectionKey, children }: { sectionKey: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sectionKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: isDragging ? ("relative" as const) : ("static" as const),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border bg-white shadow-sm transition-all ${
        isDragging ? "border-blue-500 shadow-xl ring-4 ring-blue-50" : "border-gray-200"
      }`}
    >
      <div className="flex">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex w-10 cursor-grab items-center justify-center rounded-l-xl bg-gray-50 border-r border-gray-100 hover:bg-gray-100 active:cursor-grabbing text-gray-400"
        >
          <GripVertical size={20} />
        </div>
        {/* Content */}
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

export default function CvForm({ cvData, setCvData }: CvFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [linkedInError, setLinkedInError] = useState("");
  const [newCustomSection, setNewCustomSection] = useState({ title: "", content: "" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Handlers ---
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, [name]: value } });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCvData({
          ...cvData,
          personalInfo: { ...cvData.personalInfo, photoUrl: event.target?.result as string },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (field: keyof CVData, newArray: any[]) => {
    setCvData({ ...cvData, [field]: newArray });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cvData.sectionOrder.indexOf(active.id as string);
      const newIndex = cvData.sectionOrder.indexOf(over.id as string);
      setCvData({ ...cvData, sectionOrder: arrayMove(cvData.sectionOrder, oldIndex, newIndex) });
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setLinkedInError("Please upload a valid PDF file.");
      return;
    }

    setLinkedInLoading(true);
    setLinkedInError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to parse PDF on the server.");

      const linkedInData = await response.json();
      
      // Merge extracted data into current CV state safely
      setCvData({
        ...cvData,
        personalInfo: {
          ...cvData.personalInfo,
          fullName: linkedInData.fullName || cvData.personalInfo.fullName,
          email: linkedInData.email || cvData.personalInfo.email,
          phone: linkedInData.phone || cvData.personalInfo.phone,
        },
        summary: linkedInData.summary || cvData.summary,
        experience: linkedInData.experience?.length ? linkedInData.experience : cvData.experience,
        skills: linkedInData.skills?.length ? linkedInData.skills : cvData.skills,
        education: linkedInData.education?.length ? linkedInData.education : cvData.education,
        languages: linkedInData.languages?.length ? linkedInData.languages : cvData.languages,
        tools: linkedInData.tools?.length ? linkedInData.tools : cvData.tools,
        certifications: linkedInData.certifications?.length ? linkedInData.certifications : cvData.certifications,
        interests: linkedInData.interests?.length ? linkedInData.interests : cvData.interests,
        socialExperience: linkedInData.socialExperience?.length ? linkedInData.socialExperience : cvData.socialExperience,
      });

      alert("PDF Successfully Parsed!");
    } catch (error) {
      setLinkedInError("Failed to read PDF. Please try again.");
    } finally {
      setLinkedInLoading(false);
    }
  };

  // --- Dynamic Form Renderer ---
  const renderSectionContent = (sectionKey: string) => {
    const title = cvData.sectionTitles[sectionKey as keyof typeof cvData.sectionTitles] || sectionKey;

    switch (sectionKey) {
      case "experience":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800"><Briefcase className="text-blue-600" /> {title}</h2>
              <button onClick={() => handleArrayChange("experience", [...cvData.experience, { title: "", company: "", dates: "", description: "" }])} className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"><Plus size={16} /> Add Job</button>
            </div>
            {cvData.experience.map((exp, idx) => (
              <div key={idx} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
                <button onClick={() => { const a = [...cvData.experience]; a.splice(idx, 1); handleArrayChange("experience", a); }} className="absolute right-3 top-3 text-gray-400 hover:text-red-500"><X size={18} /></button>
                <div className="grid gap-3 md:grid-cols-2 mb-3 pr-6">
                  <input type="text" value={exp.title} onChange={(e) => { const a = [...cvData.experience]; a[idx].title = e.target.value; handleArrayChange("experience", a); }} placeholder="Job Title" className="w-full rounded-md border p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  <input type="text" value={exp.company} onChange={(e) => { const a = [...cvData.experience]; a[idx].company = e.target.value; handleArrayChange("experience", a); }} placeholder="Company" className="w-full rounded-md border p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                  <input type="text" value={exp.dates} onChange={(e) => { const a = [...cvData.experience]; a[idx].dates = e.target.value; handleArrayChange("experience", a); }} placeholder="Dates (e.g. 2020 - Present)" className="md:col-span-2 w-full rounded-md border p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
                <textarea value={exp.description} onChange={(e) => { const a = [...cvData.experience]; a[idx].description = e.target.value; handleArrayChange("experience", a); }} placeholder="Description..." rows={3} className="w-full rounded-md border p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        );

      case "skills":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800"><Wrench className="text-blue-600" /> {title}</h2>
              <button onClick={() => handleArrayChange("skills", [...cvData.skills, { name: "", description: "" }])} className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"><Plus size={16} /> Add Skill</button>
            </div>
            {cvData.skills.map((skill, idx) => (
              <div key={idx} className="relative rounded-lg border border-gray-200 bg-gray-50 p-4">
                <button onClick={() => { const a = [...cvData.skills]; a.splice(idx, 1); handleArrayChange("skills", a); }} className="absolute right-3 top-3 text-gray-400 hover:text-red-500"><X size={18} /></button>
                <input type="text" value={skill.name} onChange={(e) => { const a = [...cvData.skills]; a[idx].name = e.target.value; handleArrayChange("skills", a); }} placeholder="Skill Name" className="mb-3 w-full pr-6 rounded-md border p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                <textarea value={skill.description} onChange={(e) => { const a = [...cvData.skills]; a[idx].description = e.target.value; handleArrayChange("skills", a); }} placeholder="Description (Optional)..." rows={2} className="w-full rounded-md border p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800"><GraduationCap className="text-blue-600" /> {title}</h2>
              <button onClick={() => handleArrayChange("education", [...cvData.education, { degree: "", subjects: "" }])} className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"><Plus size={16} /> Add Edu</button>
            </div>
            {cvData.education.map((edu, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={edu.degree} onChange={(e) => { const a = [...cvData.education]; a[idx].degree = e.target.value; handleArrayChange("education", a); }} placeholder="Degree / Certificate" className="w-1/2 rounded-md border p-2.5 text-sm outline-none focus:border-blue-500" />
                <input type="text" value={edu.subjects} onChange={(e) => { const a = [...cvData.education]; a[idx].subjects = e.target.value; handleArrayChange("education", a); }} placeholder="Subjects / Details" className="w-1/2 rounded-md border p-2.5 text-sm outline-none focus:border-blue-500" />
                <button onClick={() => { const a = [...cvData.education]; a.splice(idx, 1); handleArrayChange("education", a); }} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
              </div>
            ))}
          </div>
        );

      case "tools":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800"><Wrench className="text-blue-600" /> {title}</h2>
              <button onClick={() => handleArrayChange("tools", [...cvData.tools, { name: "", proficiency: 5 }])} className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"><Plus size={16} /> Add Tool</button>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {cvData.tools.map((tool, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-md border bg-gray-50 p-2">
                  <input type="text" value={tool.name} onChange={(e) => { const a = [...cvData.tools]; a[idx].name = e.target.value; handleArrayChange("tools", a); }} placeholder="Tool Name" className="flex-1 rounded border-none bg-transparent p-1 text-sm outline-none focus:ring-0" />
                  <select value={tool.proficiency} onChange={(e) => { const a = [...cvData.tools]; a[idx].proficiency = parseInt(e.target.value); handleArrayChange("tools", a); }} className="rounded border-gray-300 py-1 pl-2 pr-6 text-sm text-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}/5</option>)}
                  </select>
                  <button onClick={() => { const a = [...cvData.tools]; a.splice(idx, 1); handleArrayChange("tools", a); }} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        );

      case "languages":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800"><Globe className="text-blue-600" /> {title}</h2>
              <button onClick={() => handleArrayChange("languages", [...cvData.languages, { language: "", proficiency: "Fluent" as const }])} className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"><Plus size={16} /> Add Language</button>
            </div>
            {cvData.languages.map((lang, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={lang.language} onChange={(e) => { const a = [...cvData.languages]; a[idx].language = e.target.value; handleArrayChange("languages", a); }} placeholder="Language" className="flex-1 rounded-md border p-2.5 text-sm outline-none focus:border-blue-500" />
                <select 
                  value={lang.proficiency} 
                  onChange={(e) => { 
                    const a = [...cvData.languages]; 
                    a[idx].proficiency = e.target.value as "Fluent" | "Native" | "Bilingual"; 
                    handleArrayChange("languages", a); 
                  }} 
                  className="rounded-md border p-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="Native">Native</option>
                  <option value="Bilingual">Bilingual</option>
                  <option value="Fluent">Fluent</option>
                </select>
                <button onClick={() => { const a = [...cvData.languages]; a.splice(idx, 1); handleArrayChange("languages", a); }} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
              </div>
            ))}
          </div>
        );

      case "certifications":
      case "interests":
      case "socialExperience":
        const iconMap: Record<string, React.ReactNode> = { certifications: <Award className="text-blue-600"/>, interests: <Heart className="text-blue-600"/>, socialExperience: <Users className="text-blue-600"/> };
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">{iconMap[sectionKey]} {title}</h2>
              <button onClick={() => handleArrayChange(sectionKey as keyof CVData, [...(cvData[sectionKey as keyof CVData] as string[]), ""])} className="flex items-center gap-1 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"><Plus size={16} /> Add</button>
            </div>
            <div className="space-y-2">
              {(cvData[sectionKey as keyof CVData] as string[]).map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <input type="text" value={item} onChange={(e) => { const a = [...(cvData[sectionKey as keyof CVData] as string[])]; a[idx] = e.target.value; handleArrayChange(sectionKey as keyof CVData, a); }} placeholder={`Add ${title}...`} className="w-full rounded-md border p-2.5 text-sm outline-none focus:border-blue-500" />
                  <button onClick={() => { const a = [...(cvData[sectionKey as keyof CVData] as string[])]; a.splice(idx, 1); handleArrayChange(sectionKey as keyof CVData, a); }} className="p-2 text-gray-400 hover:text-red-500"><X size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      
      {/* 1. LINKEDIN PDF IMPORT */}
      <section className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-indigo-900">
          <Sparkles size={20} className="text-indigo-600" /> Auto-Fill from LinkedIn PDF
        </h2>
        <p className="mb-4 text-sm text-indigo-800">
          Save your LinkedIn profile as a PDF and upload it here to automatically populate your CV.
        </p>
        
        <div className="relative flex w-full items-center justify-center rounded-md border-2 border-dashed border-indigo-300 bg-white p-6 transition-colors hover:bg-indigo-50">
          <input
            type="file"
            accept=".pdf"
            onChange={handlePdfUpload}
            disabled={linkedInLoading}
            className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />
          <div className="text-center">
            {linkedInLoading ? (
              <p className="font-medium text-indigo-600">Extracting data from PDF...</p>
            ) : (
              <p className="font-medium text-indigo-600">
                Click to upload or drag and drop your PDF here
              </p>
            )}
          </div>
        </div>
        {linkedInError && <p className="mt-3 text-sm font-medium text-red-500">{linkedInError}</p>}
      </section>

      {/* 2. PERSONAL INFO */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800"><User className="text-blue-600" /> Personal Information</h2>
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <div className="md:col-span-2 flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-50">
              {cvData.personalInfo.photoUrl ? (
                <img src={cvData.personalInfo.photoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User size={32} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />
              )}
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 cursor-pointer opacity-0" title="Upload Photo" />
            </div>
            <div>
              <p className="font-medium text-gray-700">Profile Photo</p>
              <p className="text-sm text-gray-500">Click the circle to upload a new image.</p>
              {cvData.personalInfo.photoUrl && (
                <button onClick={() => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, photoUrl: "" } })} className="mt-1 text-xs font-semibold text-red-500 hover:underline">Remove Photo</button>
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="w-full rounded-md border p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} className="w-full rounded-md border p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="john@example.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
            <input type="tel" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full rounded-md border p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="+1 234 567 890" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="text" name="dob" value={cvData.personalInfo.dob} onChange={handlePersonalInfoChange} className="w-full rounded-md border p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="DD/MM/YYYY" />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Professional Titles</label>
            <button onClick={() => handleArrayChange("personalInfo", { ...cvData.personalInfo, titles: [...cvData.personalInfo.titles, ""] } as any)} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Add Title</button>
          </div>
          <div className="space-y-2">
            {cvData.personalInfo.titles.map((title, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={title} onChange={(e) => { const a = [...cvData.personalInfo.titles]; a[idx] = e.target.value; setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, titles: a } }); }} className="w-full rounded-md border p-2.5 text-sm outline-none focus:border-blue-500" placeholder="E.g., Senior Software Engineer" />
                <button onClick={() => { const a = [...cvData.personalInfo.titles]; a.splice(idx, 1); setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, titles: a } }); }} className="p-2 text-gray-400 hover:text-red-500"><X size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SUMMARY */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800"><FileText className="text-blue-600" /> Professional Summary</h2>
        <textarea value={cvData.summary} onChange={(e) => setCvData({ ...cvData, summary: e.target.value })} rows={5} className="w-full rounded-md border p-3 text-sm leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Write a brief, impactful summary of your career..." />
      </section>

      {/* 4. DRAG AND DROP DYNAMIC SECTIONS */}
      {isMounted && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cvData.sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {cvData.sectionOrder.map((sectionKey) => (
                <DraggableSection key={sectionKey} sectionKey={sectionKey}>
                  {renderSectionContent(sectionKey)}
                </DraggableSection>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 5. ADD CUSTOM SECTION UI */}
      <section className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <h2 className="mb-4 text-lg font-bold text-gray-700">Need another section?</h2>
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <input type="text" value={newCustomSection.title} onChange={(e) => setNewCustomSection({ ...newCustomSection, title: e.target.value })} placeholder="E.g., Publications, Awards" className="rounded-md border p-2.5 outline-none focus:border-blue-500" />
          <button onClick={() => {
            if (newCustomSection.title.trim()) {
              const id = `custom-${Date.now()}`;
              setCvData({
                ...cvData,
                customSections: [...cvData.customSections, { id, title: newCustomSection.title, content: newCustomSection.content }],
                sectionOrder: [...cvData.sectionOrder, id],
              });
              setNewCustomSection({ title: "", content: "" });
            }
          }} className="rounded-md bg-gray-800 px-4 py-2.5 font-medium text-white hover:bg-gray-900">Add Custom Section</button>
        </div>
      </section>

    </div>
  );
}