import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextField from "../../components/forms/TextField";
import TextAreaField from "../../components/forms/TextAreaField";
import SelectField from "../../components/forms/SelectField";
import { postsApi } from "../../features/posts/api";

const schema = z.object({
  subject: z.string().min(2),
  classLevel: z.string().min(1),
  city: z.string().min(2),
  area: z.string().min(2),
  mode: z.string().min(2),
  budget: z.number().min(0),
  schedule: z.string().min(3),
  description: z.string().min(10),
});

const CreatePostPage = () => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["parent-posts"] });
    },
  });

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Create a tuition post</h2>
          <p className="text-sm text-slate-500">Admins will review and approve before teachers can apply.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6 space-y-4">
        <TextField label="Subject" {...register("subject")} error={errors.subject} />
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Class Level" {...register("classLevel")} error={errors.classLevel} />
          <SelectField label="Mode" {...register("mode")} error={errors.mode}>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </SelectField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="City" {...register("city")} error={errors.city} />
          <TextField label="Area" {...register("area")} error={errors.area} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Budget ($)"
            type="number"
            {...register("budget", { valueAsNumber: true })}
            error={errors.budget}
          />
          <TextField label="Schedule" {...register("schedule")} error={errors.schedule} />
        </div>
        <TextAreaField label="Description" rows={4} {...register("description")} error={errors.description} />
        {mutation.isSuccess && (
          <p className="rounded-xl bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            Post submitted. We will notify you after approval.
          </p>
        )}
        {mutation.isError && (
          <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">Something went wrong. Try again.</p>
        )}
        <button
          type="submit"
          className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Publishing..." : "Publish tuition post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;

