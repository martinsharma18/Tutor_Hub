import { NavLink } from "react-router-dom";
import { Home, PlusCircle, Files, Users, Calendar, Search, MessageSquare, CreditCard, Settings, Shield, UserCheck, User, Briefcase } from "lucide-react";
import clsx from "clsx";
import logo from "../../best tuitions.png";

const teacherNav = [
  { to: "/teacher", label: "Overview", icon: Home },
  { to: "/teacher/profile", label: "My Profile", icon: User },
  { to: "/teacher/applications", label: "My Applications", icon: Files },
  { to: "/teacher/demo", label: "Demo Requests", icon: Calendar },
  { to: "/teacher/payments", label: "Payments", icon: CreditCard },
  { to: "/teacher/messages", label: "Messages", icon: MessageSquare },
];

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/create-post", label: "Post Vacancy", icon: PlusCircle },
  { to: "/admin/posts", label: "Manage Vacancies", icon: Briefcase },
  { to: "/admin/applications", label: "Applications", icon: MessageSquare },
  { to: "/admin/teachers", label: "Teachers", icon: UserCheck },
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ role }) => {
  const navItems = role === "Teacher" ? teacherNav : adminNav;

  return (
    <aside className="hidden lg:flex w-72 flex-col glass-panel shadow-[0_8px_32px_-4px_rgba(234,88,12,0.15)] z-20 overflow-hidden">
      <div className="p-8 pb-6 border-b border-white/40 bg-gradient-to-br from-white/60 to-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex items-center gap-4 mb-4 relative z-10">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl shadow-md border border-orange-400/30">
            <img src={logo} alt="Best Tuitions" className="h-8 w-8 object-contain drop-shadow-sm filter brightness-0 invert" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-orange-600 font-black opacity-90 mb-0.5">Best</p>
            <p className="text-xl text-slate-800 font-black tracking-tight leading-none">Tuitions</p>
          </div>
        </div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 flex items-center gap-2 relative z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          {role} Panel
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-white shadow-sm border border-white/60 text-orange-600 transform scale-[1.02]" 
                    : "text-slate-500 hover:bg-white/40 hover:text-orange-600 hover:translate-x-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={clsx(
                    "p-1.5 rounded-xl transition-all duration-300",
                    isActive ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500"
                  )}>
                    <Icon className={clsx(
                      "h-5 w-5 transition-transform duration-300",
                      "group-hover:scale-110"
                    )} />
                  </div>
                  <span className="relative z-10 tracking-wide">{item.label}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-500 to-rose-500 rounded-r-full"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-5 border-t border-white/40 bg-white/30 backdrop-blur-md">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600 bg-white/50 px-4 py-2.5 rounded-xl border border-white/60 shadow-sm">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
          <span>System Optimized</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
