import { NavLink, useNavigate } from "react-router-dom";
import {
  Home, PlusCircle, Briefcase, MessageSquare, UserCheck, Users,
  Settings, User, Files, Calendar, CreditCard, GraduationCap, LogOut,
  ChevronRight, ScrollText, ListChecks, Wallet, Receipt, Inbox,
} from "lucide-react";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout, selectCurrentUser } from "../../store/authSlice";

const teacherNav = [
  { to: "/teacher",              label: "Overview",         icon: Home        },
  { to: "/teacher/assignments",  label: "My Assignments",   icon: GraduationCap },
  { to: "/teacher/earnings",     label: "Earnings",         icon: Wallet      },
  { to: "/teacher/profile",      label: "My Profile",       icon: User        },
  { to: "/teacher/applications", label: "Applications",     icon: Files       },
  { to: "/teacher/demo",         label: "Demo Requests",    icon: Calendar    },
  { to: "/teacher/messages",     label: "Messages",         icon: MessageSquare },
];

const parentNav = [
  { to: "/parent",                label: "Overview",         icon: Home        },
  { to: "/parent/tuitions",       label: "My Tuitions",      icon: GraduationCap },
  { to: "/parent/invoices",       label: "Invoices",         icon: Receipt     },
  { to: "/parent/create-post",    label: "Post Requirement", icon: PlusCircle  },
  { to: "/parent/posts",          label: "My Vacancies",     icon: Briefcase   },
  { to: "/parent/demo",           label: "Demo Requests",    icon: Calendar    },
  { to: "/parent/messages",       label: "Messages",         icon: MessageSquare },
];

const adminNav = [
  { to: "/admin",                label: "Dashboard",        icon: Home        },
  // High in the list on purpose: with parent<->teacher chat gated behind a live placement,
  // every pre-placement conversation comes through the office.
  { to: "/admin/inbox",          label: "Inbox",            icon: Inbox       },
  { to: "/admin/placements",     label: "Placements",       icon: GraduationCap },
  { to: "/admin/invoices",       label: "Invoices",         icon: Receipt     },
  { to: "/admin/create-post",    label: "Post Vacancy",     icon: PlusCircle  },
  { to: "/admin/posts",          label: "Manage Vacancies", icon: Briefcase   },
  { to: "/admin/applications",   label: "Applications",     icon: MessageSquare },
  { to: "/admin/teachers",       label: "Teachers",         icon: UserCheck   },
  { to: "/admin/users",          label: "User Management",  icon: Users       },
  { to: "/admin/lookups",        label: "Dropdown Options", icon: ListChecks  },
  { to: "/admin/audit-log",      label: "Audit Log",        icon: ScrollText  },
  { to: "/admin/settings",       label: "Settings",         icon: Settings    },
];

const navByRole = { Teacher: teacherNav, Parent: parentNav, Admin: adminNav };

const Sidebar = ({ role }) => {
  const navItems = navByRole[role] ?? adminNav;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <aside className="hidden lg:flex w-[260px] flex-shrink-0 flex-col bg-slate-900 shadow-sidebar h-full">

      {/* ── Brand ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 shadow-sm">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-tight tracking-tight">Best Tuitions</p>
          <p className="text-slate-400 text-xs font-medium capitalize">{role} Portal</p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-4 space-y-0.5">
        <p className="px-3 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
          {role} Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/teacher" || item.to === "/parent"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150",
                    isActive
                      ? "bg-primary-600 text-white"
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-300"
                  )}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 text-primary-400 opacity-70" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div className="border-t border-slate-800 px-3 py-4 space-y-1">
        {/* Available to every role, so it lives here rather than in the role-specific nav above. */}
        <NavLink
          to="/account"
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
              isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
            )
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
            <Settings className="h-4 w-4" />
          </span>
          Account Settings
        </NavLink>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/60 transition-colors group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-slate-500 text-xs truncate">{role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
