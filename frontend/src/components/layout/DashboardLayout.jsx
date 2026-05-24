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
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-400/10 blur-[100px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-rose-400/10 blur-[120px]"></div>
      </div>
      
      <div className="flex flex-1 overflow-hidden z-10">
        <Sidebar role={user.role} />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <TopBar fullName={user.fullName} role={user.role} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 space-y-8 animate-fade-in scroll-smooth">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

