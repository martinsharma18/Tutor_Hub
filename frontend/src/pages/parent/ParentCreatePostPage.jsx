import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextField from "../../components/forms/TextField";
import TextAreaField from "../../components/forms/TextAreaField";
import LookupSelect from "../../components/forms/LookupSelect";
import { postsApi } from "../../features/posts/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
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
  parentPhoneNumber: z.string().optional(),
});

const ParentCreatePostPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: postsApi.create,
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ["parent-posts"] });
      navigate(`/parent/posts/${post.id}/applications`);
    },
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Post a Requirement"
        subtitle="Describe what you're looking for — teachers will apply, and you choose who to hire."
        icon={PlusCircle}
      />

      <SectionCard title="Requirement Details">
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
          <TextField label="Subject" {...register("subject")} error={errors.subject} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Class Level" {...register("classLevel")} error={errors.classLevel} />
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Mode
              <LookupSelect
                category="TeachingMode"
                {...register("mode")}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-brand-500"
              />
              {errors.mode && <span className="text-xs text-rose-500">{errors.mode.message}</span>}
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="City" {...register("city")} error={errors.city} />
            <TextField label="Area" {...register("area")} error={errors.area} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Budget ($)" type="number" {...register("budget", { valueAsNumber: true })} error={errors.budget} />
            <TextField label="Schedule" {...register("schedule")} error={errors.schedule} />
          </div>
          <TextField
            label="Contact phone (optional — defaults to your account phone)"
            {...register("parentPhoneNumber")}
            error={errors.parentPhoneNumber}
          />
          <TextAreaField label="Description" rows={4} {...register("description")} error={errors.description} />
          {mutation.isError && (
            <p className="rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">Something went wrong. Try again.</p>
          )}
          <button type="submit" className="btn-primary w-full md:w-auto" disabled={mutation.isPending}>
            {mutation.isPending ? "Publishing..." : "Publish Requirement"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
};

export default ParentCreatePostPage;
