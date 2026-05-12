"use client";

import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X, Sparkles, User, FileText, Briefcase, GraduationCap, Award, Wrench, Heart, Users, Globe } from "lucide-react";
import { CVData } from "./cv-data";

interface CvFormProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
}

function DraggableSection({ sectionKey, children }: { sectionKey: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sectionKey });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 1, position: isDragging ? ("relative" as const) : ("static" as const) };
  return (
    <div ref={setNodeRef} style={style} className={`rounded-xl border bg-white shadow-sm transition-all ${isDragging ? "border-blue-500 shadow-xl ring-4 ring-blue-50" : "border-gray-200"}`}>
      <div className="flex">
        <div {...attributes} {...listeners} className="flex w-10 cursor-grab items-center justify-center rounded-l-xl bg-gray-50 border-r border-gray-100 hover:bg-gray-100 text-gray-400"><GripVertical size={20} /></div>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}

export default function CvForm({ cvData, setCvData }: CvFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [linkedInLoading, setLinkedInLoading] = useState(false);
  const [linkedInError, setLinkedInError] = useState("");
  const [newCustomSection, setNewCustomSection] = useState({ title: "" });

  useEffect(() => setIsMounted(true), []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  // --- Handlers ---
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, [e.target.name]: e.target.value } });
  
  // RESTORED: Photo Upload Handler
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

  const handleArrayChange = (field: keyof CVData, newArray: any[]) => setCvData({ ...cvData, [field]: newArray });
  
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
    setLinkedInLoading(true); setLinkedInError("");
    const formData = new FormData(); formData.append("file", file);
    try {
      const response = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Failed to parse");
      const linkedInData = await response.json();
      alert("PDF Parsed successfully!");
    } catch (err) { setLinkedInError("Failed to read PDF."); } finally { setLinkedInLoading(false); }
  };

  const renderSectionContent = (sectionKey: string) => {
    const title = cvData.sectionTitles[sectionKey as keyof typeof cvData.sectionTitles] || sectionKey;

    switch (sectionKey) {
      case "experience":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="flex items-center gap-2 text-xl font-bold"><Briefcase className="text-blue-600" /> {title}</h2><button onClick={() => handleArrayChange("experience", [...cvData.experience, { title: "", company: "", dates: "", description: "" }])} className="text-blue-600 text-sm font-bold">+ Add Job</button></div>
            {cvData.experience.map((exp, idx) => (
              <div key={idx} className="relative rounded border bg-gray-50 p-4">
                <button onClick={() => { const a = [...cvData.experience]; a.splice(idx, 1); handleArrayChange("experience", a); }} className="absolute right-2 top-2 text-red-500"><X size={16} /></button>
                <div className="grid grid-cols-2 gap-2 mb-2 pr-6">
                  <input type="text" value={exp.title} onChange={(e) => { const a = [...cvData.experience]; a[idx].title = e.target.value; handleArrayChange("experience", a); }} placeholder="Job Title" className="border p-2 rounded text-sm w-full" />
                  <input type="text" value={exp.company} onChange={(e) => { const a = [...cvData.experience]; a[idx].company = e.target.value; handleArrayChange("experience", a); }} placeholder="Company" className="border p-2 rounded text-sm w-full" />
                  <input type="text" value={exp.dates} onChange={(e) => { const a = [...cvData.experience]; a[idx].dates = e.target.value; handleArrayChange("experience", a); }} placeholder="Dates (e.g. Jan 2020 - Present)" className="border p-2 rounded text-sm w-full col-span-2" />
                </div>
                <textarea value={exp.description} onChange={(e) => { const a = [...cvData.experience]; a[idx].description = e.target.value; handleArrayChange("experience", a); }} placeholder="Description" rows={3} className="border p-2 rounded text-sm w-full" />
              </div>
            ))}
          </div>
        );
      case "education":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="flex items-center gap-2 text-xl font-bold"><GraduationCap className="text-blue-600" /> {title}</h2><button onClick={() => handleArrayChange("education", [...cvData.education, { degree: "", institution: "", dates: "", details: "" }])} className="text-blue-600 text-sm font-bold">+ Add Edu</button></div>
            {cvData.education.map((edu, idx) => (
              <div key={idx} className="relative rounded border bg-gray-50 p-4">
                <button onClick={() => { const a = [...cvData.education]; a.splice(idx, 1); handleArrayChange("education", a); }} className="absolute right-2 top-2 text-red-500"><X size={16} /></button>
                <div className="grid grid-cols-2 gap-2 mb-2 pr-6">
                  <input type="text" value={edu.degree} onChange={(e) => { const a = [...cvData.education]; a[idx].degree = e.target.value; handleArrayChange("education", a); }} placeholder="Degree / Program" className="border p-2 rounded text-sm w-full" />
                  <input type="text" value={edu.institution} onChange={(e) => { const a = [...cvData.education]; a[idx].institution = e.target.value; handleArrayChange("education", a); }} placeholder="University / School" className="border p-2 rounded text-sm w-full" />
                  <input type="text" value={edu.dates} onChange={(e) => { const a = [...cvData.education]; a[idx].dates = e.target.value; handleArrayChange("education", a); }} placeholder="Dates (e.g. 2021 - 2025)" className="border p-2 rounded text-sm w-full col-span-2" />
                </div>
                <input type="text" value={edu.details} onChange={(e) => { const a = [...cvData.education]; a[idx].details = e.target.value; handleArrayChange("education", a); }} placeholder="Additional Details (e.g. GPA, Major)" className="border p-2 rounded text-sm w-full" />
              </div>
            ))}
          </div>
        );
      case "skills":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="flex items-center gap-2 text-xl font-bold"><Wrench className="text-blue-600" /> {title}</h2><button onClick={() => handleArrayChange("skills", [...cvData.skills, { name: "", description: "" }])} className="text-blue-600 text-sm font-bold">+ Add Skill</button></div>
            {cvData.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={skill.name} onChange={(e) => { const a = [...cvData.skills]; a[idx].name = e.target.value; handleArrayChange("skills", a); }} placeholder="Skill" className="border p-2 rounded text-sm w-1/3" />
                <input type="text" value={skill.description} onChange={(e) => { const a = [...cvData.skills]; a[idx].description = e.target.value; handleArrayChange("skills", a); }} placeholder="Description (Optional)" className="border p-2 rounded text-sm flex-1" />
                <button onClick={() => { const a = [...cvData.skills]; a.splice(idx, 1); handleArrayChange("skills", a); }} className="text-red-500 px-2"><X size={18} /></button>
              </div>
            ))}
          </div>
        );
      case "tools":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="flex items-center gap-2 text-xl font-bold"><Wrench className="text-blue-600" /> {title}</h2><button onClick={() => handleArrayChange("tools", [...cvData.tools, { name: "", proficiency: 5 }])} className="text-blue-600 text-sm font-bold">+ Add Tool</button></div>
            <div className="grid grid-cols-2 gap-2">
              {cvData.tools.map((tool, idx) => (
                <div key={idx} className="flex items-center gap-2 border p-2 rounded bg-gray-50">
                  <input type="text" value={tool.name} onChange={(e) => { const a = [...cvData.tools]; a[idx].name = e.target.value; handleArrayChange("tools", a); }} placeholder="Tool Name" className="flex-1 bg-transparent border-none text-sm outline-none" />
                  <select value={tool.proficiency} onChange={(e) => { const a = [...cvData.tools]; a[idx].proficiency = parseInt(e.target.value); handleArrayChange("tools", a); }} className="border rounded text-sm py-1">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}/5</option>)}
                  </select>
                  <button onClick={() => { const a = [...cvData.tools]; a.splice(idx, 1); handleArrayChange("tools", a); }} className="text-red-500"><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case "languages":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="flex items-center gap-2 text-xl font-bold"><Globe className="text-blue-600" /> {title}</h2><button onClick={() => handleArrayChange("languages", [...cvData.languages, { language: "", proficiency: "Fluent" }])} className="text-blue-600 text-sm font-bold">+ Add Language</button></div>
            {cvData.languages.map((lang, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={lang.language} onChange={(e) => { const a = [...cvData.languages]; a[idx].language = e.target.value; handleArrayChange("languages", a); }} placeholder="Language" className="border p-2 rounded text-sm flex-1" />
                <select value={lang.proficiency} onChange={(e) => { const a = [...cvData.languages]; a[idx].proficiency = e.target.value as any; handleArrayChange("languages", a); }} className="border p-2 rounded text-sm">
                  <option value="Native">Native</option><option value="Bilingual">Bilingual</option><option value="Fluent">Fluent</option><option value="Proficient">Proficient</option><option value="Conversational">Conversational</option>
                </select>
                <button onClick={() => { const a = [...cvData.languages]; a.splice(idx, 1); handleArrayChange("languages", a); }} className="text-red-500 px-2"><X size={18} /></button>
              </div>
            ))}
          </div>
        );
      case "certifications":
      case "interests":
      case "socialExperience":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center"><h2 className="text-xl font-bold text-gray-800 capitalize">{title}</h2><button onClick={() => handleArrayChange(sectionKey as keyof CVData, [...(cvData[sectionKey as keyof CVData] as string[]), ""])} className="text-blue-600 text-sm font-bold">+ Add</button></div>
            {(cvData[sectionKey as keyof CVData] as string[]).map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={item} onChange={(e) => { const a = [...(cvData[sectionKey as keyof CVData] as string[])]; a[idx] = e.target.value; handleArrayChange(sectionKey as keyof CVData, a); }} className="border p-2 rounded text-sm w-full" placeholder={`Add ${title}...`} />
                <button onClick={() => { const a = [...(cvData[sectionKey as keyof CVData] as string[])]; a.splice(idx, 1); handleArrayChange(sectionKey as keyof CVData, a); }} className="text-red-500 px-2"><X size={18} /></button>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      
      {/* LINKEDIN PDF UPLOAD */}
      <section className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-indigo-900">
          <Sparkles size={20} className="text-indigo-600" /> Auto-Fill from LinkedIn PDF
        </h2>
        <div className="relative flex w-full items-center justify-center rounded-md border-2 border-dashed border-indigo-300 bg-white p-6 transition-colors hover:bg-indigo-50">
          <input type="file" accept=".pdf" onChange={handlePdfUpload} disabled={linkedInLoading} className="absolute inset-0 z-50 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed" />
          <div className="text-center">
            <p className="font-medium text-indigo-600">{linkedInLoading ? "Extracting data from PDF..." : "Click to upload or drag and drop your PDF here"}</p>
          </div>
        </div>
        {linkedInError && <p className="mt-3 text-sm font-medium text-red-500">{linkedInError}</p>}
      </section>

      {/* RESTORED: PERSONAL INFORMATION */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-800"><User className="text-blue-600" /> Personal Information</h2>
        
        {/* Photo Upload Area */}
        <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-6">
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

        {/* Basic Info */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <input type="text" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} placeholder="Full Name" className="border p-2.5 rounded text-sm w-full outline-none focus:border-blue-500" />
          <input type="email" name="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email" className="border p-2.5 rounded text-sm w-full outline-none focus:border-blue-500" />
          <input type="tel" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="Phone" className="border p-2.5 rounded text-sm w-full outline-none focus:border-blue-500" />
          <input type="text" name="dob" value={cvData.personalInfo.dob} onChange={handlePersonalInfoChange} placeholder="Date of Birth" className="border p-2.5 rounded text-sm w-full outline-none focus:border-blue-500" />
        </div>

        {/* Professional Titles */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Professional Titles</label>
            <button onClick={() => setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, titles: [...cvData.personalInfo.titles, ""] }})} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Add Title</button>
          </div>
          <div className="space-y-2">
            {cvData.personalInfo.titles.map((title, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={title} onChange={(e) => { const a = [...cvData.personalInfo.titles]; a[idx] = e.target.value; setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, titles: a } }); }} className="w-full rounded border p-2 text-sm outline-none focus:border-blue-500" placeholder="E.g., CTO @ BLACK ZERO" />
                <button onClick={() => { const a = [...cvData.personalInfo.titles]; a.splice(idx, 1); setCvData({ ...cvData, personalInfo: { ...cvData.personalInfo, titles: a } }); }} className="p-2 text-gray-400 hover:text-red-500"><X size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold"><FileText className="inline text-blue-600 mr-2" /> Professional Summary</h2>
        <textarea value={cvData.summary} onChange={(e) => setCvData({ ...cvData, summary: e.target.value })} rows={5} className="w-full border p-3 rounded text-sm outline-none focus:border-blue-500" placeholder="Write a brief, impactful summary..." />
      </section>

      {/* DRAG AND DROP NATIVE SECTIONS */}
      {isMounted && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cvData.sectionOrder} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {cvData.sectionOrder.map((sectionKey) => {
                if (sectionKey.startsWith("custom-")) return null; // Customs handled separately below
                return <DraggableSection key={sectionKey} sectionKey={sectionKey}>{renderSectionContent(sectionKey)}</DraggableSection>
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* ADVANCED CUSTOM SECTIONS */}
      <section className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6">
        <h2 className="mb-4 text-lg font-bold text-gray-700">Add a Custom Section</h2>
        <div className="flex gap-2 mb-4">
          <input type="text" value={newCustomSection.title} onChange={(e) => setNewCustomSection({ title: e.target.value })} placeholder="Section Title (e.g. Awards)" className="border p-2 rounded flex-1 outline-none focus:border-blue-500" />
          <button onClick={() => {
            if (newCustomSection.title.trim()) {
              const id = `custom-${Date.now()}`;
              setCvData({ ...cvData, customSections: [...cvData.customSections, { id, title: newCustomSection.title, items: [""] }], sectionOrder: [...cvData.sectionOrder, id] });
              setNewCustomSection({ title: "" });
            }
          }} className="bg-gray-800 text-white px-4 py-2 rounded font-medium hover:bg-gray-900">Add Section</button>
        </div>
        
        {cvData.customSections.map((section, sIdx) => (
          <div key={section.id} className="bg-white border rounded p-4 mb-4 shadow-sm">
            <div className="flex justify-between font-bold mb-3">
              <input type="text" value={section.title} onChange={(e) => { const a = [...cvData.customSections]; a[sIdx].title = e.target.value; setCvData({ ...cvData, customSections: a }); }} className="border-b outline-none font-bold text-lg text-gray-800" />
              <button onClick={() => { const a = [...cvData.customSections]; a.splice(sIdx, 1); setCvData({ ...cvData, customSections: a, sectionOrder: cvData.sectionOrder.filter(id => id !== section.id) }); }} className="text-red-500 text-sm font-medium hover:underline">Delete Section</button>
            </div>
            {section.items.map((item, iIdx) => (
              <div key={iIdx} className="flex gap-2 mb-2">
                <input type="text" value={item} onChange={(e) => { const a = [...cvData.customSections]; a[sIdx].items[iIdx] = e.target.value; setCvData({ ...cvData, customSections: a }); }} placeholder="Bullet point detail..." className="border p-2.5 rounded text-sm flex-1 outline-none focus:border-blue-500" />
                <button onClick={() => { const a = [...cvData.customSections]; a[sIdx].items.splice(iIdx, 1); setCvData({ ...cvData, customSections: a }); }} className="text-red-500"><X size={18} /></button>
              </div>
            ))}
            <button onClick={() => { const a = [...cvData.customSections]; a[sIdx].items.push(""); setCvData({ ...cvData, customSections: a }); }} className="text-blue-600 text-sm font-bold mt-2 hover:underline">+ Add Item</button>
          </div>
        ))}
      </section>

    </div>
  );
}