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
    <div className="glass-panel group relative p-6 overflow-hidden">
      <div className={clsx(
        "absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 blur-2xl opacity-50 transition-transform duration-500 group-hover:scale-150",
        accentMap[accent] || accentMap.orange
      )}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={clsx(
            "p-3.5 rounded-2xl bg-white shadow-sm border border-white/50 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110",
            `text-${accent}-600`
          )}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm text-slate-600">
              {trend}
            </span>
          )}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{label}</p>
          <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

