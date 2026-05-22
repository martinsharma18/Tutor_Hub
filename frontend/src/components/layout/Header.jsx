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
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled
          ? "top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-full glass shadow-xl border border-white/60 py-1"
          : "top-0 left-0 right-0 w-full bg-transparent py-4"
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
                <Link
                  to="/register/teacher"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 animate-slide-down">
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
                  to="/register/teacher"
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


