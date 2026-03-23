import { useQuery } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { teacherApi } from "../../features/teachers/api";
import { format } from "date-fns";

const TeacherApplicationsPage = () => {
  const { data } = useQuery({
    queryKey: ["teacher-applications"],
    queryFn: teacherApi.myApplications,
  });

  return (
    <SectionCard title="My applications">
      {data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map((application) => (
            <div key={application.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{application.postSubject || "Tuition post"}</p>
                  <p className="text-sm text-slate-500">{application.message}</p>
                </div>
                <div className="text-right space-y-1">
                  <StatusBadge status={application.status} />
                  <p className="text-xs text-slate-500">{format(new Date(application.createdAtUtc), "MMM dd, yyyy")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">You have not applied to any posts yet.</p>
      )}
    </SectionCard>
  );
};

export default TeacherApplicationsPage;

