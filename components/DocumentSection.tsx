"use client";
import React from "react";
import { Navbar } from "./Navbar";
import { ChevronDown, FileUp } from "lucide-react";
import { DocumentCard } from "./DocumentCard";
import { FileUpload } from "./FileUpload";
import { UploadStatusToast } from "./UploadStatusToast";
import { extractCleanData } from "@/lib/extractCleanData";
import { FormSection } from "./FormSection";

export const DocumentSection = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<{ file: File; id: number }[]>([]);
  const [sectionOpen, setSectionOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    licenseNo: "",
    expiryDate: "",
    address: "",
    dob: "",
  });
  const [formStatus, setFormStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = React.useState("");

  const handleFileUpload = async (file: File) => {
    setFormStatus("loading");
    setStatusMessage("Analyzing document...");
    setUploadedFiles((prev) => [...prev, { file, id: Date.now() }]);

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const res = await fetch("/api/textextract", { method: "POST", body: formDataToSend });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Textract failed");

      const parsed = extractCleanData(data.keyValuePairs);
      setFormData((prev) => ({ ...prev, ...parsed }));

      setFormStatus("success");
      setStatusMessage("Details extracted successfully!");
    } catch (err) {
      console.error(err);
      setFormStatus("error");
      setStatusMessage("Extraction failed");
    } finally {
      setTimeout(() => setFormStatus("idle"), 2500);
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen w-full">
      <UploadStatusToast formStatus={formStatus} statusMessage={statusMessage} />
      <Navbar />

      <header className="flex items-center justify-between px-12 pt-10 pb-6">
        <div>
          <div className="text-gray-400 text-base mb-1">Hello John,</div>
          <div className="text-gray-800 text-lg font-semibold mb-1">Your agent has requested documents for your application.</div>
          <div className="text-gray-400 text-sm max-w-xl">
            Simply add everything you have. We'll detect each document and mark what's still missing.
            Adding all documents will reduce the need to fill out additional information.
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="absolute top-0 left-0" width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="44" stroke="#e9f5ee" strokeWidth="8" fill="none" />
              <circle cx="48" cy="48" r="44" stroke="#3ecf8e" strokeWidth="8" fill="none" strokeDasharray="276.46" strokeDashoffset="40" strokeLinecap="round" />
            </svg>
            <div className="flex flex-col items-center justify-center">
              <span className="text-gray-700 text-xl font-semibold">86%</span>
              <span className="text-gray-400 text-xs">Completed</span>
            </div>
          </div>
        </div>
      </header>

      <section className="px-12 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Requested Documents</h2>
          <FileUpload onFileSelect={handleFileUpload} />
          <div className="border-b border-gray-300/80 border-[1.4px] mt-6 mb-8" />
          <div className="flex items-center cursor-pointer mb-4" onClick={() => setSectionOpen(!sectionOpen)}>
            <FileUp className="text-red-500 mr-2" size={18} />
            <span className="font-medium text-gray-800 flex items-center gap-1">
              Identification (1/3)
            </span>
            <ChevronDown
              className={`ml-2 opacity-50 transition-transform ${sectionOpen ? "rotate-180" : "rotate-0"}`}
              size={18}
            />
          </div>
          {sectionOpen && (
            <div className="flex gap-4 mt-4">
              {uploadedFiles.map(({ file, id }) => (
                <DocumentCard key={id} name={file.name} file={file.name} status="found" id={id} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-12 pb-12">
        <FormSection formData={formData} setFormData={setFormData} />
      </section>
    </div>
  );
};
