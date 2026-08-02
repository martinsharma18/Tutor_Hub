const statusMap = {
  Pending:  "badge-amber",
  Approved: "badge-green",
  Open:     "badge-blue",
  Closed:   "badge-slate",
  Rejected: "badge-red",
  Active:   "badge-green",
};

const StatusBadge = ({ status }) => {
  const cls = statusMap[status] ?? "badge-slate";
  return (
    <span className={cls}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};

export default StatusBadge;
