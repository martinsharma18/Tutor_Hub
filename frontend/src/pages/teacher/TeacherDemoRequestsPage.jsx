import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { demoApi } from "../../features/demo/api";
import { format } from "date-fns";

const TeacherDemoRequestsPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["teacher-demo"],
    queryFn: demoApi.teacherRequests,
  });

  const mutation = useMutation({
    mutationFn: (payload) => demoApi.update(payload.id, { status: payload.status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-demo"] }),
  });

  return (
    <SectionCard title="Demo requests">
      {data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map((demo) => (
            <div key={demo.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {format(new Date(demo.selectedDate), "MMM dd")} at {demo.selectedTime}
                  </p>
                  <p className="text-sm text-slate-500">Post {demo.tuitionPostId.slice(0, 6)}</p>
                </div>
                <StatusBadge status={demo.status} />
              </div>
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => mutation.mutate({ id: demo.id, status: "approved" })}
                  className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => mutation.mutate({ id: demo.id, status: "declined" })}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No demo requests currently.</p>
      )}
    </SectionCard>
  );
};

export default TeacherDemoRequestsPage;

