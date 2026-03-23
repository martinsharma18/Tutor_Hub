import { LogOut, Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";

const TopBar = ({ fullName, role }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-orange-200 bg-white/95 backdrop-blur-md px-6 py-4 shadow-sm animate-slide-down">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold">Welcome back</p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{fullName}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full border border-orange-200">
          <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">{role}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 hover:scale-110">
          <Search className="h-5 w-5" />
        </button>
        <button className="relative p-2 rounded-lg text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 hover:scale-110">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full border-2 border-white"></span>
        </button>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;

