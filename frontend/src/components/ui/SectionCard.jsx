const SectionCard = ({ title, cta, children, className = "" }) => {
  return (
    <section className={`glass-panel p-6 md:p-10 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200/50">
        <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
          <span className="h-2 w-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
          {title}
        </h3>
        {cta && (
          <div className="relative z-10">
            {cta}
          </div>
        )}
      </div>
      <div className="relative z-0">{children}</div>
    </section>
  );
};

export default SectionCard;

