import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { placementsApi } from "../../features/placements/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { GraduationCap, Video, Calendar, MapPin, Receipt } from "lucide-react";

const ParentTuitionsPage = () => {
  const { data: placements, isLoading } = useQuery({
    queryKey: ["parent-tuitions"],
    queryFn: placementsApi.myTuitions,
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
        title="My Tuitions"
        subtitle="Your ongoing classes, schedules, and teachers."
        icon={GraduationCap}
        actions={
          <Link to="/parent/invoices" className="btn text-sm border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50">
            <Receipt className="h-4 w-4" /> View invoices
          </Link>
        }
      />

      {placements && placements.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {placements.map((p) => (
            <SectionCard key={p.id} title={p.subject} subtitle={`${p.classLevel} · ${p.mode}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Teacher</span>
                  <span className="font-semibold text-slate-900">{p.teacherName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Monthly fee</span>
                  <span className="font-semibold text-slate-900">NPR {p.monthlyFee?.toFixed(2)}</span>
                </div>
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

                {/* Online placements are run entirely through the platform — this link is the class. */}
                {p.mode === "Online" && p.meetingLink && p.status === "Active" && (
                  <a
                    href={p.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Video className="h-4 w-4" /> Join class
                  </a>
                )}

                {p.mode !== "Online" && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="h-3.5 w-3.5" /> Home tuition — your teacher comes to you
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
              <GraduationCap className="h-6 w-6 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">No active tuitions yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Once we match you with a teacher, your classes will appear here.
            </p>
            <Link to="/parent/create-post" className="btn-primary text-sm mt-4">
              Post a requirement
            </Link>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ParentTuitionsPage;
