import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Footer from "./Footer";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";

const DashboardLayout = () => {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 text-slate-900 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user.role} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar fullName={user.fullName} role={user.role} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 animate-fade-in">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

