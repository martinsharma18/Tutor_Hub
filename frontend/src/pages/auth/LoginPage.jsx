import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import TextField from "../../components/forms/TextField";
import { authApi } from "../../features/auth/api";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
      if (role === "Parent") navigate("/parent");
      else if (role === "Teacher") navigate("/teacher");
      else navigate("/admin");
    },
    onError: (error) => {
      // Log detailed error information for debugging
      console.error("Login error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        },
      });
    },
  });

  const getErrorMessage = () => {
    if (!mutation.error) return "Unable to login. Check credentials.";
    const error = mutation.error;
    
    // Network errors (connection refused, timeout, etc.)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      return "Cannot connect to server. Please ensure the backend is running on http://localhost:5083";
    }
    
    // CORS errors
    if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
      return "CORS error: Check backend CORS configuration";
    }
    
    // Backend error responses
    if (error.response?.data?.title) {
      return error.response.data.title;
    }
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    
    // HTTP status errors
    if (error.response?.status) {
      if (error.response.status === 404) {
        return "API endpoint not found. Check backend URL configuration.";
      }
      if (error.response.status >= 500) {
        return "Server error. Please try again later.";
      }
    }
    
    // Generic error message
    if (error.message) {
      return error.message;
    }
    
    return "Unable to login. Check credentials.";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-10 px-4 py-10 md:flex-row">
        <div className="flex-1 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Home Tuition Platform</p>
          <h1 className="text-4xl font-bold text-slate-900">Welcome back 👋</h1>
          <p className="text-slate-600">
            Sign in to manage tuition posts, approve teachers, send messages, and keep commissions on track.
          </p>
          <div className="flex gap-4 text-sm">
            <Link className="text-brand-600 hover:underline" to="/register/parent">
              Register as Parent
            </Link>
            <Link className="text-brand-600 hover:underline" to="/register/teacher">
              Register as Teacher
            </Link>
          </div>
        </div>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="glass-panel flex-1 space-y-4 p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-900">Login</h2>
          <TextField type="email" label="Email" placeholder="you@email.com" {...register("email")} error={errors.email} />
          <TextField type="password" label="Password" placeholder="••••••" {...register("password")} error={errors.password} />
          {mutation.isError && (
            <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">{getErrorMessage()}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-600 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

