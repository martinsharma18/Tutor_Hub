import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { placementsApi } from "../../features/placements/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { Briefcase, Video, Calendar, MapPin, Wallet } from "lucide-react";

const TeacherAssignmentsPage = () => {
  const { data: placements, isLoading } = useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: placementsApi.myAssignments,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="My Assignments"
        subtitle="Your ongoing tuitions and class schedules."
        icon={Briefcase}
        actions={
          <Link to="/teacher/earnings" className="btn text-sm border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50">
            <Wallet className="h-4 w-4" /> View earnings
          </Link>
        }
      />

      {placements && placements.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {placements.map((p) => (
            <SectionCard key={p.id} title={p.subject} subtitle={`${p.classLevel} · ${p.mode}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Student / Parent</span>
                  <span className="font-semibold text-slate-900">{p.parentName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">You earn / month</span>
                  <span className="font-semibold text-emerald-700">NPR {p.teacherPayoutAmount.toFixed(2)}</span>
                </div>

                {/* monthlyFee is null for online placements — the API withholds it (PlacementVisibility). */}
                {p.monthlyFee != null && (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Parent pays NPR {p.monthlyFee.toFixed(2)}</span>
                    <span>Platform fee NPR {p.commissionAmount?.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-500 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Schedule
                  </span>
                  <span className="text-sm text-slate-700 text-right">{p.schedule || "—"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <StatusBadge status={p.status} />
                </div>

                {p.mode === "Online" && p.meetingLink && p.status === "Active" && (
                  <a
                    href={p.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Video className="h-4 w-4" /> Start class
                  </a>
                )}

                {p.mode !== "Online" && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5" /> Home tuition
                  </p>
                )}
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <SectionCard>
          <div className="empty-state">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">No assignments yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Apply to open vacancies — confirmed tuitions will appear here.
            </p>
            <Link to="/teacher" className="btn-primary text-sm mt-4">
              Browse vacancies
            </Link>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default TeacherAssignmentsPage;
