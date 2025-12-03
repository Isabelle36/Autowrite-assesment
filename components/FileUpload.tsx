"use client";
import React, { useRef } from "react";
import { FileUp } from "lucide-react";

export const FileUpload = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const file = files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "text/plain"];
    if (!allowedTypes.includes(file.type)) return;
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files?.length) return;
    const file = files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "text/plain"];
    if (!allowedTypes.includes(file.type)) return;
    onFileSelect(file);
  };

  return (
    <div
      className="flex items-center mt-3 mb-2 text-sm"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <span
        className="flex items-center gap-1 group cursor-pointer"
        onClick={() => inputRef.current?.click()}
        tabIndex={0}
        role="button"
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <FileUp className="text-blue-500 group-hover:opacity-80 transition-opacity" size={16} />
        <span className="text-blue-500 font-medium group-hover:opacity-80 transition-opacity">
          Select files
        </span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.txt"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </span>
      <span className="text-gray-500 ml-1">to upload or drag and drop them into this space.</span>
    </div>
  );
};
