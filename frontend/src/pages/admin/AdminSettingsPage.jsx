import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import TextField from "../../components/forms/TextField";
import SelectField from "../../components/forms/SelectField";
import { adminApi } from "../../features/admin/api";

const AdminSettingsPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: adminApi.getSettings,
  });

  const { register, handleSubmit, reset } = useForm({
    values: data,
  });

  const mutation = useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
  });

  return (
    <SectionCard title="Commission & platform settings">
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Commission Percentage"
          type="number"
          step="0.1"
          {...register("commissionPercentage", { valueAsNumber: true })}
        />
        <TextField
          label="Flat Commission Amount"
          type="number"
          step="0.01"
          {...register("flatCommissionAmount", { valueAsNumber: true })}
        />
        <SelectField
          label="Auto approve teacher profiles"
          {...register("autoApproveTeachers", { setValueAs: (value) => value === "true" })}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </SelectField>
        <SelectField
          label="Auto approve parent posts"
          {...register("autoApproveParentPosts", { setValueAs: (value) => value === "true" })}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </SelectField>
        <TextField
          label="Payment instructions"
          {...register("paymentInstructions")}
          className="md:col-span-2"
        />
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            disabled={mutation.isPending}
          >
            Save settings
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </form>
    </SectionCard>
  );
};

export default AdminSettingsPage;

