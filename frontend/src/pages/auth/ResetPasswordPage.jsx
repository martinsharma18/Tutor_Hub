import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { authApi } from "../../features/auth/api";

const schema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (values) => authApi.resetPassword({ token, ...values }),
    onSuccess: () => setTimeout(() => navigate("/login"), 1500),
  });

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
        <div className="text-center">
          <p className="text-slate-700 font-semibold">This reset link is missing its token.</p>
          <Link to="/forgot-password" className="text-primary-600 font-semibold hover:text-primary-700 text-sm">
            Request a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Set a new password</h1>
        <p className="text-slate-500 text-sm mt-1 mb-8">Choose a new password for your account.</p>

        {mutation.isSuccess ? (
          <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-4">
            Password reset! Redirecting you to login…
          </p>
        ) : (
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input {...register("newPassword")} type="password" placeholder="••••••••" className="input pl-10" />
              </div>
              {errors.newPassword && <p className="text-xs text-red-500 font-medium">{errors.newPassword.message}</p>}
            </div>
            {mutation.isError && (
              <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">This link is invalid or has expired.</p>
              </div>
            )}
            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full py-3 rounded-xl">
              {mutation.isPending ? <span className="spinner" /> : <>Reset password <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
