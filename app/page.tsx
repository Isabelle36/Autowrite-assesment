import { DocumentSection } from "@/components/DocumentSection";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <DocumentSection
       title="Sample Documents"
       count="3"
       documents={[
         { name: "Document 1", status: "found" },
         { name: "Document 2", status: "outdated" },
         { name: "Document 3", status: "pending" }
       ]}
     />
    </div>
  );
}
