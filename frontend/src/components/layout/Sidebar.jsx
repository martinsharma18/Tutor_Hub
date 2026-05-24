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
    <aside className="hidden lg:flex w-72 flex-col border-r border-white/60 glass-panel !rounded-none !border-y-0 !border-l-0 z-20 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.1)]">
      <div className="p-6 border-b border-white/20 bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex items-center gap-3 mb-3 relative z-10">
          <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-md shadow-inner border border-white/30">
            <img src={logo} alt="Best Tuitions" className="h-8 w-8 object-contain drop-shadow-md" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-orange-100 font-bold opacity-80">Best</p>
            <p className="text-xl text-white font-black tracking-tight leading-tight">Tuitions</p>
          </div>
        </div>
        <h2 className="text-sm font-semibold text-orange-100 uppercase tracking-widest mt-4 flex items-center gap-2 relative z-10">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
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
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-[0_4px_20px_-4px_rgba(249,115,22,0.5)] transform scale-[1.02]" 
                    : "text-slate-600 hover:bg-white/60 hover:text-orange-600 hover:translate-x-1 hover:shadow-sm"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={clsx(
                    "p-1.5 rounded-lg transition-colors duration-300",
                    isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-orange-100"
                  )}>
                    <Icon className={clsx(
                      "h-5 w-5 transition-transform duration-300",
                      isActive ? "text-white" : "text-slate-500 group-hover:text-orange-600",
                      "group-hover:scale-110"
                    )} />
                  </div>
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
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
