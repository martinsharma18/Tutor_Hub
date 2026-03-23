import clsx from "clsx";

const statusStyles = {
  pending: "bg-orange-100 text-orange-700 border border-orange-200",
  approved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  open: "bg-blue-100 text-blue-700 border border-blue-200",
  closed: "bg-slate-200 text-slate-600 border border-slate-300",
  shortlisted: "bg-purple-100 text-purple-700 border border-purple-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
  hired: "bg-green-100 text-green-800 border border-green-200",
  paid: "bg-emerald-100 text-emerald-800 border border-emerald-200",
};

const StatusBadge = ({ status }) => {
  const normalized = status.toLowerCase();
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize shadow-sm",
        statusStyles[normalized] ?? "bg-slate-100 text-slate-600 border border-slate-200"
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

