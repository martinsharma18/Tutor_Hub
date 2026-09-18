import { forwardRef, useEffect, useRef } from "react";
import { useLookup } from "../../features/metadata/useMetadata";

/**
 * A <select> whose options come from the admin-managed lookup table rather than hardcoded
 * <option> tags. Drop-in replacement for a plain select — forwards ref/props so it still works
 * with react-hook-form's {...register(...)}.
 *
 * `placeholder` renders a leading empty-value option (for optional/filter selects); omit it when
 * the field is required and should default to the first real option.
 */
const LookupSelect = forwardRef(({ category, placeholder, className = "", onChange, ...props }, ref) => {
  const { options, isLoading } = useLookup(category);
  const selectRef = useRef(null);

  useEffect(() => {
    // Options load asynchronously, so on first render (required field, no placeholder) the
    // <select> has no <option>s yet. Once they arrive the browser auto-selects the first one,
    // but that DOM mutation fires no change event — react-hook-form's tracked value for this
    // field is left undefined, and submitting without ever opening the dropdown fails
    // validation even though a value is visibly selected. Sync it once options land.
    if (!placeholder && !isLoading && options.length > 0 && selectRef.current) {
      onChange?.({ target: selectRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, options.length, placeholder]);

  return (
    <select
      {...props}
      onChange={onChange}
      ref={(node) => {
        selectRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={className}
      disabled={props.disabled || isLoading}
    >
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
