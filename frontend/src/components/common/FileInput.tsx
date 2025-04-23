import React from "react";
import { cn } from "@/lib/utils";
import { CloudUpload, FileCheck } from "lucide-react";

interface FileInputProps {
  id: string;
  accept: string;
  value: File | null;
  maxFileSize: number;
  onChange: (file: File | null) => void;
}

export function FileInput({
  id,
  accept,
  value,
  maxFileSize,
  onChange,
}: FileInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    onChange(selected);
  };

  return (
    <div
      className={cn(
        "selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        "max-w-sm md:max-w-2xs border-2 border-dashed border-muted-foreground hover:border-primary transition-all duration-200 cursor-pointer"
      )}
    >
      <label
        htmlFor={id}
        className={
          "flex justify-center text-gray-600 hover:text-primary rounded-2xl py-4 cursor-pointer transition-all duration-200"
        }
      >
        <div className="flex flex-col items-center">
          {value ? <FileCheck /> : <CloudUpload />}
          <p className="mt-2 text-sm font-medium">
            {value ? "File selected" : "Select file to upload"}
          </p>
          <p className="text-[10px]">
            {value ? `${value.name}` : `(Max. Size ${maxFileSize} MB)`}
          </p>
        </div>
      </label>
      <input
        type="file"
        id={id}
        className="hidden"
        onChange={(e) => handleFileChange(e)}
        accept={accept}
      />
    </div>
  );
}
