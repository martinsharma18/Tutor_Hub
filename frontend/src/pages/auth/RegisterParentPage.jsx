import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import TextField from "../../components/forms/TextField";
import { authApi } from "../../features/auth/api";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().optional(),
  city: z.string().min(2),
  area: z.string().min(2),
});

const RegisterParentPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: authApi.registerParent,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate("/parent");
    },
  });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 md:flex-row">
        <div className="flex-1 space-y-4">
          <p className="text-sm uppercase tracking-widest text-white/70">For families</p>
          <h1 className="text-4xl font-bold">Create tuition posts in minutes</h1>
          <p className="text-white/80">
            Describe your requirements, shortlist teachers, schedule demos, and unlock contact details after commission is
            confirmed.
          </p>
          <Link className="text-brand-200 hover:underline" to="/login">
            Already have an account? Login
          </Link>
        </div>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="glass-panel flex-1 space-y-4 bg-white text-slate-900"
        >
          <div className="p-6">
            <h2 className="text-2xl font-semibold">Parent Registration</h2>
          </div>
          <div className="space-y-4 border-t border-slate-100 p-6">
            <TextField label="Full name" {...register("fullName")} error={errors.fullName} />
            <TextField label="Email" type="email" {...register("email")} error={errors.email} />
            <TextField label="Password" type="password" {...register("password")} error={errors.password} />
            <TextField label="Phone number" {...register("phoneNumber")} error={errors.phoneNumber} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="City" {...register("city")} error={errors.city} />
              <TextField label="Area" {...register("area")} error={errors.area} />
            </div>
            {mutation.isError && (
              <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">Unable to register. Try again later.</p>
            )}
            <button
              type="submit"
              className="w-full rounded-2xl bg-brand-600 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating account..." : "Create parent account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterParentPage;

