import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import TextField from "../../components/forms/TextField";
import TextAreaField from "../../components/forms/TextAreaField";
import SelectField from "../../components/forms/SelectField";
import { authApi } from "../../features/auth/api";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  phoneNumber: z.string().optional(),
  qualification: z.string().min(3),
  experienceSummary: z.string().min(5),
  yearsOfExperience: z.number().min(0),
  subjects: z.string().min(2),
  classes: z.string().min(2),
  preferredMode: z.string().min(2),
  bio: z.string().min(10),
  city: z.string().min(2),
  area: z.string().min(2),
  hourlyRate: z.number().optional(),
});

const RegisterTeacherPage = () => {
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
    mutationFn: authApi.registerTeacher,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate("/teacher");
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 text-center space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Tutors</p>
          <h1 className="text-4xl font-bold text-slate-900">Register as a teacher</h1>
          <p className="text-slate-600">Share qualification, expertise, and preferred mode to get discovered quickly.</p>
          <Link className="text-sm text-brand-600 hover:underline" to="/login">
            Already onboard? Login
          </Link>
        </div>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="glass-panel space-y-6 p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Full name" {...register("fullName")} error={errors.fullName} />
            <TextField label="Email" type="email" {...register("email")} error={errors.email} />
            <TextField label="Password" type="password" {...register("password")} error={errors.password} />
            <TextField label="Phone number" {...register("phoneNumber")} error={errors.phoneNumber} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Qualification" {...register("qualification")} error={errors.qualification} />
            <TextField
              label="Years of experience"
              type="number"
              {...register("yearsOfExperience", { valueAsNumber: true })}
              error={errors.yearsOfExperience}
            />
          </div>
          <TextAreaField label="Experience summary" rows={3} {...register("experienceSummary")} error={errors.experienceSummary} />
          <TextAreaField label="Bio" rows={3} {...register("bio")} error={errors.bio} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Subjects (comma separated)" {...register("subjects")} error={errors.subjects} />
            <TextField label="Classes (comma separated)" {...register("classes")} error={errors.classes} />
          </div>
          <SelectField label="Preferred mode" {...register("preferredMode")} error={errors.preferredMode}>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </SelectField>
          <div className="grid gap-4 md:grid-cols-3">
            <TextField label="City" {...register("city")} error={errors.city} />
            <TextField label="Area" {...register("area")} error={errors.area} />
            <TextField
              label="Hourly Rate (optional)"
              type="number"
              {...register("hourlyRate", {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
              error={errors.hourlyRate}
            />
          </div>
          {mutation.isError && (
            <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">Unable to register teacher. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-600 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Register as teacher"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTeacherPage;

