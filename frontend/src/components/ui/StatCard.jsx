import clsx from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";

const accentStyles = {
  blue:    { icon: "bg-blue-50    text-blue-600",    dot: "bg-blue-500"    },
  emerald: { icon: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  amber:   { icon: "bg-amber-50   text-amber-600",   dot: "bg-amber-500"   },
  rose:    { icon: "bg-rose-50    text-rose-600",    dot: "bg-rose-500"    },
  indigo:  { icon: "bg-primary-50 text-primary-600", dot: "bg-primary-500" },
  orange:  { icon: "bg-orange-50  text-orange-600",  dot: "bg-orange-500"  },
};

const StatCard = ({
  label,
  value,
  subtitle,
  icon: Icon,
  accent = "indigo",
  trend,          // e.g. "+12%"
  trendUp,        // boolean — true = green, false = red
}) => {
  const styles = accentStyles[accent] ?? accentStyles.indigo;

  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-card-md transition-shadow duration-200">
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between">
        <div className={clsx("flex h-10 w-10 items-center justify-center rounded-xl", styles.icon)}>
          {Icon && <Icon className="h-5 w-5" />}
        </div>
        {trend !== undefined && (
          <span className={clsx(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
            trendUp
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          )}>
            {trendUp
              ? <TrendingUp className="h-3 w-3" />
              : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>

      {/* Value + label */}
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-tight tracking-tight">
          {value ?? "—"}
        </p>
        <p className="text-sm text-slate-500 font-medium mt-0.5">{label}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatCard;
