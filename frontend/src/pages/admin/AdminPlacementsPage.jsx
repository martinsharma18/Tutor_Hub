import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { adminPlacementsApi } from "../../features/placements/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import TextAreaField from "../../components/forms/TextAreaField";
import { Users, Pause, Play, XCircle, MessageSquarePlus, Star } from "lucide-react";

const STATUS_TABS = [
  { key: "Active", label: "Active" },
  { key: "Paused", label: "Paused" },
  { key: "Ended", label: "Ended" },
];

const AdminPlacementsPage = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("Active");
  const [feedbackFor, setFeedbackFor] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, notes: "", isAtRisk: false });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-placements", status],
    queryFn: () => adminPlacementsApi.list({ status, pageSize: 50 }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-placements"] });

  const statusMutation = useMutation({
    mutationFn: ({ id, action }) =>
      action === "pause" ? adminPlacementsApi.pause(id) : adminPlacementsApi.resume(id),
    onSuccess: () => { invalidate(); toast.success("Placement updated."); },
    onError: (e) => toast.error(e.response?.data?.detail ?? "Could not update placement."),
  });

  const endMutation = useMutation({
    mutationFn: ({ id, endReason, endNotes }) => adminPlacementsApi.end(id, { endReason, endNotes }),
    onSuccess: () => { invalidate(); toast.success("Placement ended."); },
    onError: (e) => toast.error(e.response?.data?.detail ?? "Could not end placement."),
  });

  const feedbackMutation = useMutation({
    mutationFn: ({ placementId, payload }) => adminPlacementsApi.addFeedback(placementId, payload),
    onSuccess: () => {
      setFeedbackFor(null);
      setFeedbackForm({ rating: 0, notes: "", isAtRisk: false });
      toast.success("Feedback recorded.");
    },
    onError: (e) => toast.error(e.response?.data?.detail ?? "Could not save feedback."),
  });

  const handleEnd = (placement) => {
    const reason = window.prompt(
      "Why is this ending? (TeacherLeft, ParentStopped, CourseCompleted, ReplacedTeacher, Other)",
      "ParentStopped"
    );
    if (!reason) return;
    const notes = window.prompt("Any notes? (optional)") ?? "";
    endMutation.mutate({ id: placement.id, endReason: reason, endNotes: notes });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Placements"
        subtitle="Every ongoing tuition the platform manages."
        icon={Users}
      />

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              status === tab.key
                ? "bg-primary-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SectionCard title={`${status} placements`} subtitle={`${data?.totalCount ?? 0} total`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Parent</th>
                <th>Teacher</th>
                <th>Fee / Commission</th>
                <th>Mode</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading…</td></tr>
              ) : data && data.items.length > 0 ? (
                data.items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <p className="font-semibold text-slate-900 text-sm">{p.subject}</p>
                      <p className="text-xs text-slate-400">{p.classLevel}</p>
                    </td>
                    <td className="text-sm text-slate-600">{p.parentName}</td>
                    <td className="text-sm text-slate-600">{p.teacherName}</td>
                    <td className="text-sm">
                      <span className="font-semibold text-slate-800">NPR {p.monthlyFee?.toFixed(2)}</span>
                      <span className="text-xs text-emerald-600 block">
                        +{p.commissionAmount?.toFixed(2)} commission
                      </span>
                    </td>
                    <td>
                      <span className={p.mode === "Online" ? "badge-blue" : "badge-slate"}>{p.mode}</span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setFeedbackFor(feedbackFor === p.id ? null : p.id)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          <MessageSquarePlus className="h-3.5 w-3.5" /> Feedback
                        </button>
                        {p.status === "Active" && (
                          <button
                            onClick={() => statusMutation.mutate({ id: p.id, action: "pause" })}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            <Pause className="h-3.5 w-3.5" /> Pause
                          </button>
                        )}
                        {p.status === "Paused" && (
                          <button
                            onClick={() => statusMutation.mutate({ id: p.id, action: "resume" })}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                          >
                            <Play className="h-3.5 w-3.5" /> Resume
                          </button>
                        )}
                        {p.status !== "Ended" && (
                          <button
                            onClick={() => handleEnd(p)}
                            className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            <XCircle className="h-3.5 w-3.5" /> End
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Users className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No {status.toLowerCase()} placements</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {feedbackFor && (
        <SectionCard title="Record parent feedback" subtitle="Your monthly check-in call">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">How happy is the parent?</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setFeedbackForm((f) => ({ ...f, rating: star }))}>
                    <Star className={`h-7 w-7 ${star <= feedbackForm.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
            </div>

            <TextAreaField
              label="Notes from the call"
              rows={3}
              value={feedbackForm.notes}
              onChange={(e) => setFeedbackForm((f) => ({ ...f, notes: e.target.value }))}
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={feedbackForm.isAtRisk}
                onChange={(e) => setFeedbackForm((f) => ({ ...f, isAtRisk: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span className="text-sm text-slate-700">
                Flag as at risk — parent may stop
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => feedbackMutation.mutate({ placementId: feedbackFor, payload: feedbackForm })}
                disabled={!feedbackForm.rating || feedbackMutation.isPending}
                className="btn-primary text-sm disabled:opacity-50"
              >
                Save feedback
              </button>
              <button
                onClick={() => setFeedbackFor(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default AdminPlacementsPage;
