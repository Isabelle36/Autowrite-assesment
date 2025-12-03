"use client"
import { DocumentCard } from "./DocumentCard";
import { Navbar } from "./Navbar";
import { FileUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import React, { useRef } from "react";
import { FormSection } from "./FormSection";



export const DocumentSection = ({

}) => {
  const [uploadedFiles, setUploadedFiles] = React.useState<{file: File, id: number}[]>([]);
  const fileIdRef = React.useRef(1);
  const [sectionOpen, setSectionOpen] = React.useState(true);
  const [formData, setFormData] = React.useState({
  firstName: "",
  lastName: "",
  licenseNo: "",
  expiryDate: "",
  address: "",
  dob: "",
});
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = async (file: File) => {
    console.log(file)
  setUploadedFiles((prev) => [...prev, { file, id: fileIdRef.current }]);
  fileIdRef.current += 1;

  const formDataToSend = new FormData();
  formDataToSend.append("file", file);

  try {
    const res = await fetch("/api/textextract", {
      method: "POST",
      body: formDataToSend,
    });

    const data = await res.json();
    console.log("Textract keyValuePairs:", data.keyValuePairs);

    if (!res.ok || !data.success) {
      console.error("Textract error:", data.error);
      return;
    }

    const parsed = mapLicenseData(data.keyValuePairs);
    // Log the parsed data mapped from Textract output
    console.log("Parsed form data:", parsed);
    setFormData((prev) => ({ ...prev, ...parsed }));
  } catch (e) {
    console.error("Upload or Textract failed:", e);
  }
};

function normalizeTextractFields(rawFields: Record<string, string>) {
  const fixed: Record<string, string> = {};
  const knownKeys = ["FN", "LN", "DL", "DOB", "EXP", "ISS", "CLASS", "ADDR", "ADDRESS", "NAME"];

  for (const [rawKey, rawValue] of Object.entries(rawFields)) {
    const key = rawKey.trim().toUpperCase();
    const val = rawValue?.trim() || "";

    const mergedKey = knownKeys.find(k => key.startsWith(k) && key.length > k.length);
    if (mergedKey) {
      const splitValue = key.slice(mergedKey.length).trim(); // everything after known prefix
      if (splitValue && !val.startsWith(splitValue)) {
        fixed[mergedKey] = splitValue + " " + val;
      } else {
        fixed[mergedKey] = val;
      }
    } else {
      fixed[key] = val;
    }
  }

  return fixed;
}

function toHtmlDate(str: string) {
  const match = str.match(/^(\d{2})[\/.](\d{2})[\/.](\d{4})$/);
  if (!match) return "";
  return `${match[3]}-${match[1]}-${match[2]}`;
}

function mapLicenseData(fields: Record<string, string>) {
  const cleanedFields = normalizeTextractFields(fields);

  const clean = (v: string) =>
    v.replace(/\s+/g, " ").replace(/(\d)\s+(\d)/g, "$1$2").trim();
  const entries = Object.entries(cleanedFields).map(([k, v]) => [
    k.toUpperCase(),
    clean(v),
  ]);
  const flatText = entries.map(([_, v]) => v).join(" ");

  const findValue = (patterns: string[]) => {
    const match = entries.find(([k]) =>
      patterns.some((p) => k.includes(p.toUpperCase()))
    );
    return match ? clean(match[1]) : "";
  };

  // LICENSE NUMBER
  const licenseNo =
    findValue(["DL", "LIC", "ID"]) ||
    flatText.match(/\b[A-Z]?\s?\d{5,}[A-Z0-9]*\b/)?.[0] ||
    "";

const rawText = flatText.replace(/\s+/g, " "); 

const flexibleDatePattern = /\b(\d\s*\d)[\/.](\d\s*\d)[\/.](\d\s*\d\s*\d\s*\d)\b/g;

const allDates = [];
let match;
while ((match = flexibleDatePattern.exec(rawText)) !== null) {
  const cleanedDate = match[0].replace(/\s+/g, "");
  allDates.push(cleanedDate);
}

const currentYear = new Date().getFullYear();
let dob = "";
let expiryDate = "";

for (const date of allDates) {
  const parts = date.split(/[/.]/);
  const year = parseInt(parts[2].length === 2 ? `19${parts[2]}` : parts[2]);
  if (year < currentYear - 16 && !dob) dob = date; 
  else if (year >= currentYear && !expiryDate) expiryDate = date; 
}

if (!expiryDate) expiryDate = findValue(["EXP", "EXPI"]);
if (!dob) dob = findValue(["DOB", "BIRTH"]);


  //  NAME DETECTION 
  let firstName = "";
  let lastName = "";

  const nameCandidates = entries
    .filter(([k]) => k.match(/FN|LN|NAME/))
    .map(([_, v]) => v);

  if (nameCandidates.length === 1) {
    const text = nameCandidates[0];
    const parts = text.split(/\d|STREET|ROAD|AVE/i)[0].trim().split(" ");
    if (parts.length >= 2) {
      firstName = parts.slice(1).join(" "); 
      lastName = parts[0]; 
    }
  } else if (nameCandidates.length >= 2) {
    firstName = nameCandidates[0];
    lastName = nameCandidates[1];
  } else {
    const nameMatch = flatText.match(/\b[A-Z]{3,}\s+[A-Z]{3,}(\s+[A-Z]{3,})?\b/);
    if (nameMatch) {
      const parts = nameMatch[0].split(" ");
      firstName = parts.slice(0, -1).join(" ");
      lastName = parts[parts.length - 1];
    }
  }

  // ADDRESS EXTRACTION
  let address = "";
  const addressMatch = flatText.match(
    /\d+\s+[\w\s,]+(ST|RD|ROAD|STREET|AVE|BLVD|CA|TX|NY|MI|WA|FL|OH|IL|PA)/i
  );
  if (addressMatch) address = clean(addressMatch[0]);
  address = address.replace(
    new RegExp(`${firstName}|${lastName}`, "gi"),
    ""
  ).replace(/\s+/g, " ").trim();

  return { firstName, lastName, licenseNo, expiryDate:toHtmlDate(expiryDate), dob:toHtmlDate(dob), address };
}


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
      <div className="px-12 pb-12">
        <FormSection  formData={formData} setFormData={setFormData} />
      </div>
    </div>
  );
};
