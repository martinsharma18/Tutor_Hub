import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, AlertCircle } from "lucide-react";
import { authApi } from "../../features/auth/api";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const mutation = useMutation({ mutationFn: () => authApi.confirmEmail({ token }) });

  useEffect(() => {
    if (token) mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md text-center">
        {!token ? (
          <p className="text-slate-700 font-semibold">This verification link is missing its token.</p>
        ) : mutation.isPending ? (
          <span className="spinner" />
        ) : mutation.isSuccess ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
            <p className="text-slate-800 font-semibold">Your email is verified!</p>
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 text-sm">
              Continue to login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="text-slate-800 font-semibold">This link is invalid or has expired.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
