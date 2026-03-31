import clsx from "clsx";

const statusStyles = {
  available: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  closed: "bg-slate-200 text-slate-600 border border-slate-300",
};

const StatusBadge = ({ status }) => {
  const normalized = status.toLowerCase();
  const style = statusStyles[normalized] ?? "bg-slate-100 text-slate-600 border border-slate-200";
  
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider shadow-sm transition-all",
        style
      )}
    >
      <span className={clsx(
        "h-2 w-2 rounded-full mr-2 animate-pulse",
        normalized === "available" ? "bg-emerald-500" : "bg-slate-400"
      )}></span>
      {status}
    </span>
  );
};

export default StatusBadge;
