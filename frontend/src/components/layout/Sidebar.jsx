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
    <aside className="hidden lg:flex w-72 flex-col border-r border-white/50 glass shadow-xl">
      <div className="p-6 border-b border-orange-200 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
            <img src={logo} alt="Best Tuitions" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-orange-100 font-bold">Best</p>
            <p className="text-lg text-white font-semibold">Tuitions</p>
          </div>
        </div>
        <h2 className="text-lg font-bold text-white mt-3 capitalize">{role.toLowerCase()} Dashboard</h2>
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 transform scale-105" 
                    : "text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:translate-x-1"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={clsx(
                    "h-5 w-5 transition-transform duration-200",
                    "group-hover:scale-110"
                  )} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 rounded-xl animate-pulse"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-orange-200 bg-white/50">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
