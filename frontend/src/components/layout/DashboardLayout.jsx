import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";

const DashboardLayout = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Dark Sidebar */}
      <Sidebar role={user.role} />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar fullName={user.fullName} role={user.role} />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
