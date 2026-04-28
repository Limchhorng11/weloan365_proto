import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: ReactNode;
}

export function Input({ label, prefix, className, ...rest }: InputProps) {
  return (
    <div className={cn("input-wrap", prefix && "with-prefix", className)}>
      {prefix && <span className="prefix">{prefix}</span>}
      <div className={cn(prefix && "field")}>
        {label && <label>{label}</label>}
        <input {...rest} />
      </div>
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className, ...rest }: TextareaProps) {
  return (
    <div className={cn("input-wrap", className)}>
      {label && <label>{label}</label>}
      <textarea {...rest} />
    </div>
  );
}
