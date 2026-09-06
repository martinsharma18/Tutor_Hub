import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { authApi } from "../../features/auth/api";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({ mutationFn: authApi.forgotPassword });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot your password?</h1>
        <p className="text-slate-500 text-sm mt-1 mb-8">
          Enter your email and we'll send you a link to reset it.
        </p>

        {mutation.isSuccess ? (
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700">
              If that email is registered, a reset link has been sent. Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input {...register("email")} type="email" placeholder="you@example.com" className="input pl-10" />
              </div>
              {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full py-3 rounded-xl">
              {mutation.isPending ? <span className="spinner" /> : <>Send reset link <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-slate-500 text-sm">
          <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
