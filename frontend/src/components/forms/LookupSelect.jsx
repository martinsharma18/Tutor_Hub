import { forwardRef } from "react";
import { useLookup } from "../../features/metadata/useMetadata";

/**
 * A <select> whose options come from the admin-managed lookup table rather than hardcoded
 * <option> tags. Drop-in replacement for a plain select — forwards ref/props so it still works
 * with react-hook-form's {...register(...)}.
 *
 * `placeholder` renders a leading empty-value option (for optional/filter selects); omit it when
 * the field is required and should default to the first real option.
 */
const LookupSelect = forwardRef(({ category, placeholder, className = "", ...props }, ref) => {
  const { options, isLoading } = useLookup(category);

  return (
    <select {...props} ref={ref} className={className} disabled={props.disabled || isLoading}>
      {placeholder && <option value="">{isLoading ? "Loading…" : placeholder}</option>}
      {options.map((option) => (
        <option key={option.id} value={option.code}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

LookupSelect.displayName = "LookupSelect";

export default LookupSelect;
