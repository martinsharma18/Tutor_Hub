import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { GraduationCap, Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { authApi } from "../../features/auth/api";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";

const schema = z.object({
  email:    z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      const role = data.user.role;
      if (from)               { navigate(from, { replace: true }); return; }
      if (role === "Teacher")   navigate("/teacher");
      else if (role === "Admin") navigate("/admin");
      else                      navigate("/");
    },
    onError: (err) => console.error("Login error:", err),
  });

  const getError = () => {
    if (!mutation.error) return "Invalid credentials. Please try again.";
    const e = mutation.error;
    if (e.response?.data?.detail) return e.response.data.detail;
    if (e.response?.data?.title)  return e.response.data.title;
    if (e.code === "ERR_NETWORK")  return "Network error — check if the server is running.";
    return e.message ?? "An unexpected error occurred.";
  };

  return (
    <div className="flex min-h-screen bg-white">

      {/* ── Left panel — brand ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 flex-col">
        {/* Background image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-slate-900/70 z-10" />
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
            alt="Education"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-20 flex flex-col h-full p-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">Best Tuitions</span>
          </Link>

          {/* Hero text */}
          <div className="mt-auto mb-16 max-w-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full text-white/70 text-xs font-semibold mb-6 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified Educators Platform
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Unlock Your<br />
              <span className="text-primary-400">Academic Potential</span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Join thousands of expert tutors and dedicated learners in a community built on trust and educational excellence.
            </p>
            <div className="space-y-3">
              {[
                "Direct admin-verified opportunities",
                "Professional educator dashboard",
                "Secure payment & commission tracking",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-500 text-xs">© 2026 Best Tuitions. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-slate-900 text-lg font-bold">Best Tuitions</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`input pl-10 ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className={`input pl-10 ${errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Error message */}
            {mutation.isError && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{getError()}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full py-3 text-base rounded-xl mt-2"
            >
              {mutation.isPending ? (
                <span className="spinner" />
              ) : (
                <>Sign In <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register/teacher"
              className="text-primary-600 font-semibold hover:text-primary-700"
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
