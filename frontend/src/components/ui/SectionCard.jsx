/**
 * SectionCard — consistent card wrapper with optional header.
 *
 * Usage:
 *   <SectionCard title="All Users" cta={<button>Export</button>}>
 *     content...
 *   </SectionCard>
 */
const SectionCard = ({ title, subtitle, cta, children, className = "", noPadding = false }) => (
  <div className={`card overflow-hidden ${className}`}>
    {(title || cta) && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {cta && <div className="flex-shrink-0">{cta}</div>}
      </div>
    )}
    <div className={noPadding ? "" : "p-6"}>
      {children}
    </div>
  </div>
);

export default SectionCard;
