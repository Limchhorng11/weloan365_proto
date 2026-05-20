import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Omit `prefix` because the HTML attribute is `string`, but our prefix is a
// ReactNode (e.g. an icon or flag). Same idea for any other native attribute
// you ever want to repurpose on this component.
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
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

interface SelectOption {
  value: string;
  label: string;
  hint?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  /** Optional placeholder shown when value is empty. */
  placeholder?: string;
}

/**
 * Styled dropdown that visually matches <Input>. Uses the same `.input-wrap`
 * shell as text inputs, with a trailing chevron icon that overlays the
 * native select arrow (which is hidden via appearance-none).
 */
export function Select({
  label,
  options,
  placeholder,
  className,
  ...rest
}: SelectProps) {
  return (
    <div className={cn("input-wrap relative", className)}>
      {label && <label>{label}</label>}
      <select {...rest} className="appearance-none pr-7">
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.hint ? ` — ${o.hint}` : ""}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: "var(--text-3)" }}
      />
    </div>
  );
}
