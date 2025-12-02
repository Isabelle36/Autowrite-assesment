import React from "react";
import { IdCard } from "lucide-react";

type DocumentCardProps = {
  name: string;
  file?: string;
  status: "found" | "outdated" | "pending";
  id?: string | number;
};

export const DocumentCard: React.FC<DocumentCardProps> = ({ name, file, status, id }) => {
  const baseClasses =
    status === "found"
      ? "rounded-xl border border-green-300 bg-green-50 flex items-center px-4 py-3 gap-4 w-full max-w-xs"
      : status === "outdated"
      ? "rounded-xl border border-red-300 bg-red-50 flex items-center px-4 py-3 gap-4 w-full max-w-xs"
      : "rounded-xl border border-gray-200 bg-gray-50 flex items-center px-4 py-3 gap-4 w-full max-w-xs";

  const baseName = file ? file.split('.')[0] : name;

  return (
    <div className={baseClasses + " max-w-[340px] min-w-[340px]"}>
      <div className={`flex items-center justify-center bg-white rounded-full w-10 h-10 ${status === "found" ? "" : status === "outdated" ? "" : ""}`}>
        <IdCard className={status === "found" ? "text-green-400" : status === "outdated" ? "text-red-400" : "text-gray-400"} size={24} />
      </div>
      <div className="flex flex-col flex-1">
        <div className="font-bold text-gray-900 text-[1rem] leading-tight flex items-center gap-2 truncate">
          <span className="truncate">Document {baseName}</span>
          {id !== undefined && (
            <span className="text-xs text-gray-400 font-mono">#{id}</span>
          )}
        </div>
        {file && (
          <div className="mt-1">
            <span className=" text-gray-400 text-xs font-normal block max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
              (<span  className=" max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">{file}</span>)
            </span>
          </div>
        )}
        {status === "found" && (
          <div className="text-green-400 text-xs mt-1 font-medium">File found</div>
        )}
        {status === "outdated" && (
          <div className="text-red-400 text-xs mt-1 font-medium">Outdated file, re-upload notes here</div>
        )}
        {status === "pending" && (
          <div className="text-gray-400 text-xs mt-1 font-medium">Pending</div>
        )}
      </div>
    </div>
  );
};
