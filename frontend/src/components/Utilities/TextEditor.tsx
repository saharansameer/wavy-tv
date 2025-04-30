import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function TextEditor({
  value,
  onChange,
  className,
  placeholder = "",
}: TextEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Adjusts the textarea height based on its scrollHeight
  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  // Ensure height is adjusted whenever the value changes
  React.useLayoutEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = textareaRef.current!;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // insert a single line-break (auto-resize will handle spacing)
      const updated = value.slice(0, start) + "\n" + value.slice(end);
      onChange(updated);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
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
      className={`resize-none overflow-hidden ${className}`}
      style={{ height: "auto" }}
    />
  );
}
