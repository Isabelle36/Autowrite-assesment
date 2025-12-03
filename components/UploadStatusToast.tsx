"use client";
import { Button } from "./ui/button";
import { Loader, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  formStatus: "idle" | "loading" | "success" | "error";
  statusMessage: string;
}

export const UploadStatusToast = ({ formStatus, statusMessage }: Props) => {
  if (formStatus === "idle") return null;

  const color =
    formStatus === "success" ? "#16a34a" :
    formStatus === "error" ? "#dc2626" :
    "#004CD3";

  const Icon =
    formStatus === "success" ? CheckCircle2 :
    formStatus === "error" ? XCircle :
    Loader;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <Button
        className="flex items-center gap-2 px-4 py-2 min-w-40 shadow-lg border-none text-white"
        style={{ backgroundColor: color }}
        disabled={formStatus === "loading"}
      >
        <Icon className={`${formStatus === "loading" && "animate-spin"} text-white`} size={18} />
        <span className="text-sm">{statusMessage}</span>
      </Button>
    </div>
  );
};
