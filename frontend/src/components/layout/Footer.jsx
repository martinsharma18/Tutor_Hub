import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Find Teachers", path: "/teachers" },
    { label: "Find Vacancies", path: "/vacancies" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Cookie Policy", path: "/cookies" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="mt-auto border-t border-white/60 bg-white/30 backdrop-blur-xl relative z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-gradient-to-br from-orange-500 to-rose-500 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-black text-slate-800 tracking-tight">Best Tuitions</span>
            </Link>
            <span className="text-slate-300 hidden sm:block text-xs">|</span>
            <p className="text-slate-500 text-xs font-medium">
              © {currentYear} All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 hidden md:flex">
            {quickLinks.slice(0, 3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/contact" className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors">Contact</Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-lg bg-white shadow-sm border border-white/60 text-slate-400 hover:text-orange-600 hover:border-orange-200 hover:-translate-y-0.5 transition-all"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



