import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { demoApi } from "../../features/demo/api";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

const ParentDemoRequestsPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["parent-demo"], queryFn: demoApi.parentRequests });

  const mutation = useMutation({
    mutationFn: (id) => demoApi.update(id, { status: "Declined" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["parent-demo"] }),
  });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Demo Requests"
        subtitle="Demo sessions requested with shortlisted teachers."
        icon={Calendar}
      />

      <SectionCard title="All Demo Requests" subtitle={`${data?.length ?? 0} total`}>
        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((demo) => (
              <div key={demo.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {format(new Date(demo.selectedDate), "MMM dd")} at {demo.selectedTime}
                    </p>
                    {demo.notes && <p className="text-sm text-slate-500">{demo.notes}</p>}
                  </div>
                  <StatusBadge status={demo.status} />
                </div>
                {demo.status === "Pending" && (
                  <button
                    onClick={() => mutation.mutate(demo.id)}
                    className="mt-3 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No demo requests yet. Shortlist a teacher and request one from their application.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default ParentDemoRequestsPage;
