"use client";
import type { ChangeEventHandler } from "react";

export function Switch({
  checked,
  onChange,
  defaultChecked,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <span className="switch-slider" />
    </label>
  );
}
