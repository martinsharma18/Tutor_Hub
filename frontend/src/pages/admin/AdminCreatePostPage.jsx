import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextField from "../../components/forms/TextField";
import TextAreaField from "../../components/forms/TextAreaField";
import SelectField from "../../components/forms/SelectField";
import { postsApi } from "../../features/posts/api";
import SectionCard from "../../components/ui/SectionCard";
import { PlusCircle } from "lucide-react";

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

const AdminCreatePostPage = () => {
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
      queryClient.invalidateQueries({ queryKey: ["admin-posts", "pending-posts"] });
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <PlusCircle className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Post a Vacancy</h1>
        </div>
        <p className="text-orange-100">Create a new tuition requirement</p>
      </div>

      <SectionCard title="Vacancy Details">
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
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
              Vacancy posted successfully!
            </p>
          )}
          {mutation.isError && (
            <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">Something went wrong. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full md:w-auto rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Publishing..." : "Publish Vacancy"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
};

export default AdminCreatePostPage;
