import clsx from "clsx";
import { forwardRef } from "react";

const TextAreaField = forwardRef(({ label, error, className, ...props }, ref) => (
  <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
    {label}
    <textarea
      {...props}
      ref={ref}
      className={clsx(
        "rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-500",
        error ? "border-rose-400" : "border-slate-200",
        className
      )}
    />
    {error && <span className="text-xs text-rose-500">{error.message}</span>}
  </label>
));

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;

