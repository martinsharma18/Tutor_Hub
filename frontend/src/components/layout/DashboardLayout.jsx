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
      {/* Decorative background matching LandingPage */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-[40%] right-[20%] w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="flex flex-1 overflow-hidden z-10 relative p-3 md:p-4 lg:p-6 gap-4 md:gap-6">
        <Sidebar role={user.role} />
        <div className="flex-1 flex flex-col overflow-hidden relative rounded-3xl glass-panel !bg-white/40 !shadow-none border border-white/60">
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

