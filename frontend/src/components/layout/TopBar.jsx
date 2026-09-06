import { useLocation } from "react-router-dom";
import NotificationBell from "./NotificationBell";

// Map routes to human-readable page titles
const pageTitles = {
  "/admin":              "Dashboard",
  "/admin/create-post":  "Post Vacancy",
  "/admin/posts":        "Manage Vacancies",
  "/admin/applications": "Applications",
  "/admin/teachers":     "Teacher Management",
  "/admin/users":        "User Management",
  "/admin/settings":     "Settings",
  "/admin/inbox":        "Inbox",
  "/admin/lookups":      "Dropdown Options",
  "/admin/audit-log":    "Audit Log",
  "/admin/placements":   "Placements",
  "/admin/invoices":     "Invoices",
  "/teacher/assignments": "My Assignments",
  "/teacher/earnings":   "Earnings",
  "/parent/tuitions":    "My Tuitions",
  "/parent/invoices":    "Invoices",
  "/teacher":            "Overview",
  "/teacher/profile":    "My Profile",
  "/teacher/applications": "My Applications",
  "/teacher/demo":       "Demo Requests",
  "/teacher/payments":   "Payments",
  "/teacher/messages":   "Messages",
  "/parent":             "Overview",
  "/parent/create-post": "Post Requirement",
  "/parent/posts":       "My Vacancies",
  "/parent/demo":        "Demo Requests",
  "/parent/payments":    "Payments",
  "/parent/messages":    "Messages",
};

const TopBar = ({ fullName, role }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Dashboard";

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-100 px-6 py-3.5 shadow-sm flex-shrink-0">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-xs text-slate-400 font-medium">
          Welcome back, <span className="text-slate-600 font-semibold">{fullName}</span>
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Notification bell — was a static, non-functional placeholder */}
        <NotificationBell />

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{fullName}</p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
