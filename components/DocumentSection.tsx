"use client"
import { DocumentCard } from "./DocumentCard";
import { Navbar } from "./Navbar";
import { FileUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import React, { useRef } from "react";

type SectionProps = {
  title: string;
  count: string;
  color?: string;
  documents: { name: string; file?: string; status: "found" | "outdated" | "pending" }[];
};

export const DocumentSection: React.FC<SectionProps> = ({
  title,
  count,
  documents,
}) => {
  const [uploadedFiles, setUploadedFiles] = React.useState<{file: File, id: number}[]>([]);
  const fileIdRef = React.useRef(1);
  const [sectionOpen, setSectionOpen] = React.useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (file: File) => {
    setUploadedFiles((prev) => [...prev, { file, id: fileIdRef.current }]);
    fileIdRef.current += 1;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "text/plain"];
    if (!allowedTypes.includes(file.type)) return;
    handleFileUpload(file);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "text/plain"];
    if (!allowedTypes.includes(file.type)) return;
    handleFileUpload(file);
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen w-full">
      <Navbar />
      <div className="flex items-center justify-between px-12 pt-10 pb-6">
        <div>
          <div className="text-gray-400 text-base mb-1">Hello John,</div>
          <div className="text-gray-800 text-lg font-semibold mb-1">Your agent has requested documents for your application.</div>
          <div className="text-gray-400 text-sm max-w-xl">
            Simply add everything you have. We'll detect each document and mark what's still missing.<br />
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
      </div>
      <div className="px-12 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Requested Documents</h2>
            <div className="flex items-center mt-3 mb-2 text-sm "
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  style={{ width: "fit-content" }}
            >
                  <span
                    className="flex items-center gap-1 group cursor-pointer"
                    onClick={() => inputRef.current?.click()}
                    tabIndex={0}
                    role="button"
                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
                  >
                    <FileUp className="text-blue-500 group-hover:opacity-80 transition-opacity" size={16} />
                    <span className="text-blue-500 font-medium group-hover:opacity-80 transition-opacity">Select files</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.txt"
                      ref={inputRef}
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                  </span>
                  <span className="text-gray-500 ml-1">to upload or drag and drop them into this space.</span>
              <span className="text-gray-500 ml-1">to upload or drag and drop them into this space.</span>
            </div>
            <div className="w-full border-b border-[1.4px] border-gray-400/30 mt-6 mb-8" />
            <div className="mt-6">
              <div className="flex items-center cursor-pointer mb-4" onClick={() => setSectionOpen((o) => !o)}>
                <span className="text-red-500 mr-2"><FileUp size={18} /></span>
                <span className="font-medium text-gray-800 flex items-center gap-1">
                  Identification (0/3)
                  <ChevronDown className={`transition-transform ${sectionOpen ? "rotate-180" : "rotate-0"} text-gray-400`} size={18} />
                </span>
                <ChevronDown className={`ml-2 transition-transform ${sectionOpen ? "rotate-180" : "rotate-0"}`} size={18} />
              </div>
              {sectionOpen && (
                <div className="flex gap-4 mt-4">
                  {uploadedFiles.map(({ file, id }) => (
                    <DocumentCard
                      key={id}
                      name={file.name}
                      file={file.name}
                      status="found"
                      id={id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
