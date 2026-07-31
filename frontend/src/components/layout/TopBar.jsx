import { LogOut, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";

const TopBar = ({ fullName, role }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/60 bg-white/60 backdrop-blur-xl px-8 py-4 shadow-sm animate-slide-down">
      <div className="flex items-center gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-orange-500 font-bold opacity-80 mb-0.5">Welcome back</p>
          <p className="text-xl font-black text-slate-800 tracking-tight">{fullName}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-rose-50 rounded-full border border-orange-200 shadow-inner">
          <span className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">{role}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl text-slate-500 hover:bg-white hover:text-orange-600 transition-all duration-300 hover:shadow-md border border-transparent hover:border-slate-200">
          <Search className="h-5 w-5" />
        </button>
        <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-white hover:text-orange-600 transition-all duration-300 hover:shadow-md border border-transparent hover:border-slate-200">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1"></div>
        <button
          onClick={handleLogout}
          className="btn-premium inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)]"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline tracking-wide">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;

