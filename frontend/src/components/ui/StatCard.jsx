import clsx from "clsx";
import { TrendingUp, Users, DollarSign, FileText } from "lucide-react";

const accentMap = {
  blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
  emerald: "from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700",
  amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-700",
  rose: "from-rose-50 to-rose-100 border-rose-200 text-rose-700",
  orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
};

const iconMap = {
  blue: TrendingUp,
  emerald: Users,
  amber: FileText,
  rose: DollarSign,
  orange: DollarSign,
};

const StatCard = ({ label, value, trend, accent = "orange", icon: CustomIcon }) => {
  const Icon = CustomIcon || iconMap[accent] || TrendingUp;
  
  return (
    <div className={clsx(
      "rounded-2xl border-2 bg-gradient-to-br p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 card-hover animate-scale-in",
      accentMap[accent] || accentMap.orange
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/50 backdrop-blur-sm">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50">
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-2">{label}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;

