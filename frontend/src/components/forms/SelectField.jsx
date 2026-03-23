import clsx from "clsx";
import { forwardRef } from "react";

const SelectField = forwardRef(({ label, error, children, className, ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
    {label}
    <select
      {...props}
      ref={ref}
      className={clsx(
        "rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-500",
        error ? "border-rose-400" : "border-slate-200",
        className
      )}
    >
      {children}
    </select>
    {error && <span className="text-xs text-rose-500">{error.message}</span>}
  </label>
));

SelectField.displayName = "SelectField";

export default SelectField;

