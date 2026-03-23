import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import TextField from "../../components/forms/TextField";
import SelectField from "../../components/forms/SelectField";
import { searchApi } from "../../features/search/api";

const ParentSearchPage = () => {
  const [filters, setFilters] = useState({ page: 1, pageSize: 10 });

  const { register, handleSubmit } = useForm({
    defaultValues: filters,
  });

  const { data, isFetching } = useQuery({
    queryKey: ["search-teachers", filters],
    queryFn: () => searchApi.teachers(filters),
  });

  return (
    <div className="space-y-6">
      <SectionCard title="Search teachers">
        <form
          onSubmit={handleSubmit((values) =>
            setFilters((prev) => ({
              ...prev,
              ...values,
              minExperience: values.minExperience ? Number(values.minExperience) : undefined,
              latitude: values.latitude ? Number(values.latitude) : undefined,
              longitude: values.longitude ? Number(values.longitude) : undefined,
              radiusKm: values.radiusKm ? Number(values.radiusKm) : undefined,
            }))
          )}
          className="grid gap-4 md:grid-cols-3"
        >
          <TextField label="City" {...register("city")} />
          <TextField label="Area" {...register("area")} />
          <TextField label="Subject" {...register("subject")} />
          <TextField label="Class level" {...register("classLevel")} />
          <SelectField label="Mode" {...register("mode")}>
            <option value="">Any</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </SelectField>
          <TextField label="Min experience (years)" type="number" {...register("minExperience")} />
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 active:scale-95 md:col-span-3"
          >
            Apply Filters
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Results">
        {isFetching && <p className="text-sm text-slate-500">Searching teachers...</p>}
        {data && data.items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.items.map((teacher) => (
              <div key={teacher.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{teacher.fullName}</h3>
                  <span className="text-sm font-medium text-slate-500">{teacher.city}</span>
                </div>
                <p className="text-sm text-slate-500">
                  {teacher.subjects} • {teacher.classes}
                </p>
                <p className="mt-2 text-sm text-slate-600">{teacher.experienceSummary}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button className="flex-1 rounded-xl border-2 border-orange-200 px-4 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 transform hover:scale-105 active:scale-95">
                    Chat
                  </button>
                  <button className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 active:scale-95">
                    Request Demo
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No teachers match the filters.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default ParentSearchPage;

