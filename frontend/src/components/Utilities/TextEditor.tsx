import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
}

export function TextEditor({
  value,
  onChange,
  className,
  placeholder = "",
  rows = 10,
}: TextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = textareaRef.current!;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // insert two line‑breaks for “enter spacing”
      const updated = value.slice(0, start) + "\n" + value.slice(end);
      onChange(updated);
      // move cursor between those two breaks
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      rows={rows}
      className={`resize-none ${className}`}
    />
  );
}
