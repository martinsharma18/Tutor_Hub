import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";
import logo from "../../best tuitions.png";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Find Vacancies", path: "/vacancies" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-50 transition-all duration-500 rounded-3xl lg:rounded-full ${
        isScrolled || isMobileMenuOpen
          ? "top-4 bg-white/95 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200/80 py-2"
          : "top-6 bg-white/50 backdrop-blur-md shadow-sm border border-white/80 py-3"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-slate-900 hover:text-orange-600 transition-colors"
          >
            <div className="p-1 bg-white rounded-xl shadow-md">
              <img src={logo} alt="Best Tuitions" className="h-8 w-8 object-contain" />
            </div>
            <span className="hidden sm:inline">Best Tuitions</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-slate-700 hover:text-orange-600 font-bold transition-colors relative group tracking-wide"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate(`/${user.role.toLowerCase()}`)}
                className="px-4 py-2 text-slate-700 hover:text-orange-600 font-medium transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-slate-700 hover:text-orange-600 font-bold transition-all duration-200 border-2 border-transparent hover:border-orange-200 hover:bg-orange-50/80 rounded-xl"
                >
                  Login
                </Link>
                {/* Single entry point — role is chosen on /register rather than with competing
                    header buttons. */}
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-800 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-orange-900 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-orange-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-[110%] left-0 right-0 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 py-4 px-6 lg:hidden animate-slide-down">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-slate-700 hover:text-orange-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 mt-4">
              {user ? (
                <button
                  onClick={() => {
                    navigate(`/${user.role.toLowerCase()}`);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 text-slate-700 hover:text-orange-600 font-medium transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 text-slate-700 hover:text-orange-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-2 px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-800 text-white font-semibold rounded-xl text-center"
                >
                  Sign Up
                </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;


