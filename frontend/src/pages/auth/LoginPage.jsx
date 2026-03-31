import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { GraduationCap, Mail, Lock, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import TextField from "../../components/forms/TextField";
import { authApi } from "../../features/auth/api";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      const role = data.user.role;
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      if (role === "Teacher") navigate("/teacher");
      else if (role === "Admin") navigate("/admin");
      else navigate("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const getErrorMessage = () => {
    if (!mutation.error) return "Invalid credentials. Please try again.";
    const error = mutation.error;
    if (error.response?.data?.detail) return error.response.data.detail;
    if (error.response?.data?.title) return error.response.data.title;
    if (error.code === 'ERR_NETWORK') return "Network error. Check if the server is running.";
    return error.message || "An unexpected error occurred.";
  };

  return (
    <div className="flex min-h-screen bg-white font-inter">
      {/* Left side - Visual & Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          {/* Static pattern background since the image path is dynamic and hard to hardcode perfectly */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-slate-900/60 z-10" />
          <div className="absolute inset-0 scale-110 blur-sm opacity-50 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="relative z-20 w-full flex flex-col justify-between p-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white group">
            <div className="p-2 bg-orange-500 rounded-xl group-hover:scale-110 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            TuitionHub
          </Link>

          <div className="max-w-md animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-orange-400 text-sm font-bold mb-6 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4" />
              Verified Educators Platform
            </div>
            <h2 className="text-5xl font-black text-white mb-6 leading-tight">
              Unlock Your <br />
              <span className="text-orange-500">Academic Potential</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Join thousands of expert tutors and dedicated learners in a community built on trust and educational excellence.
            </p>

            <div className="space-y-4">
              {[
                "Direct admin-verified opportunities",
                "Professional educator dashboard",
                "Secure payment and commission tracking"
              ].map((item, id) => (
                <div key={id} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-slate-400 text-sm">
            © 2026 TuitionHub. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50/50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-slate-500">Sign in to your account to continue</p>
          </div>

          <form
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.email ? "border-rose-400 focus:border-rose-500 bg-rose-50/30" : "border-slate-100 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    }`}
                />
              </div>
              {errors.email && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <Link to="/forgot-password" title="Coming soon!" className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${errors.password ? "border-rose-400 focus:border-rose-500 bg-rose-50/30" : "border-slate-100 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    }`}
                />
              </div>
              {errors.password && <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {mutation.isError && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex gap-3 items-center">
                <div className="bg-rose-500 rounded-full p-1 shadow-md shadow-rose-200">
                  <ArrowRight className="h-3 w-3 text-white rotate-180" />
                </div>
                <p className="text-sm font-bold text-rose-600">{getErrorMessage()}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full group bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-orange-600 hover:shadow-orange-200 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register/teacher"
              className="text-orange-600 font-black hover:text-orange-700 hover:underline transition-all"
            >
              Register as a Teacher
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
