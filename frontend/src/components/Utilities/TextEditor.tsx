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

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className}`}
      style={{ height: "auto" }}
    />
  );
}
