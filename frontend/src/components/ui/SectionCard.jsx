const SectionCard = ({ title, cta, children, className = "" }) => {
  return (
    <section className={`glass-panel p-6 md:p-8 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-orange-100">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="h-1 w-1 bg-orange-500 rounded-full"></span>
          {title}
        </h3>
        {cta && (
          <div className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
            {cta}
          </div>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
};

export default SectionCard;

