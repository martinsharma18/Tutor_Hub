import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../../features/applications/api";
import { demoApi } from "../../features/demo/api";
import { reviewsApi } from "../../features/reviews/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import TextField from "../../components/forms/TextField";
import TextAreaField from "../../components/forms/TextAreaField";
import { toast } from "react-hot-toast";
import { ArrowLeft, Users, Phone, Calendar, Star } from "lucide-react";

const ParentApplicationsPage = () => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [agreedAmounts, setAgreedAmounts] = useState({});
  const [demoForms, setDemoForms] = useState({});
  const [reviewForms, setReviewForms] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  const reviewMutation = useMutation({
    mutationFn: (payload) => reviewsApi.create(payload),
    onSuccess: (_data, variables) => {
      setSubmittedReviews((prev) => ({ ...prev, [variables.appId]: true }));
      toast.success("Thanks for your review!");
    },
    onError: (err) => {
      const alreadyReviewed = err.response?.status === 403;
      toast.error(alreadyReviewed ? "You've already reviewed this vacancy." : "Could not submit review.");
    },
  });

  const demoMutation = useMutation({
    mutationFn: (payload) => demoApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-demo"] });
      toast.success("Demo requested.");
    },
    onError: () => toast.error("Could not request demo."),
  });

  const { data: applications, isLoading } = useQuery({
    queryKey: ["post-applications", postId],
    queryFn: () => applicationsApi.listForPost(postId),
  });

  const statusMutation = useMutation({
    mutationFn: ({ applicationId, payload }) => applicationsApi.updateStatus(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-applications", postId] });
      toast.success("Application updated.");
    },
    onError: () => toast.error("Could not update application."),
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
      <Link to="/parent/posts" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to my vacancies
      </Link>

      <PageHeader
        title="Applications Received"
        subtitle="Shortlist, reject, or hire teachers who applied to this vacancy."
        icon={Users}
      />

      <SectionCard title="Teacher Applications" subtitle={`${applications?.length ?? 0} total`}>
        {applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{app.teacherName}</p>
                    <p className="text-xs text-slate-500">{app.teacherCity} · {app.yearsOfExperience}y experience</p>
                    {app.message && <p className="mt-2 text-sm text-slate-600">{app.message}</p>}
                  </div>
                  <StatusBadge status={app.status} />
                </div>

                {app.status === "Hired" && (
                  <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-emerald-600">Hired — commission fee ${app.commissionAmount.toFixed(2)}</span>
                    {app.parentPhoneNumber && app.parentPhoneNumber !== "********" && (
                      <a href={`tel:${app.parentPhoneNumber}`} className="flex items-center gap-1 text-emerald-700 text-sm font-semibold">
                        <Phone className="h-3.5 w-3.5" /> {app.parentPhoneNumber}
                      </a>
                    )}
                  </div>
                )}

                {app.status === "Hired" && !submittedReviews[app.id] && (
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
                    <p className="text-sm font-semibold text-slate-700">Rate this teacher</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForms((prev) => ({ ...prev, [app.id]: { ...prev[app.id], rating: star } }))}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= (reviewForms[app.id]?.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <TextAreaField
                      label="Comment (optional)"
                      rows={2}
                      value={reviewForms[app.id]?.comment ?? ""}
                      onChange={(e) => setReviewForms((prev) => ({ ...prev, [app.id]: { ...prev[app.id], comment: e.target.value } }))}
                    />
                    <button
                      onClick={() =>
                        reviewMutation.mutate({
                          appId: app.id,
                          tuitionPostId: app.tuitionPostId,
                          rating: reviewForms[app.id]?.rating ?? 0,
                          comment: reviewForms[app.id]?.comment,
                        })
                      }
                      disabled={!reviewForms[app.id]?.rating || reviewMutation.isPending}
                      className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
                    >
                      Submit review
                    </button>
                  </div>
                )}

                {app.status === "Pending" || app.status === "Shortlisted" ? (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {app.status === "Pending" && (
                      <button
                        onClick={() => statusMutation.mutate({ applicationId: app.id, payload: { status: "Shortlisted" } })}
                        className="rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        Shortlist
                      </button>
                    )}
                    <button
                      onClick={() => statusMutation.mutate({ applicationId: app.id, payload: { status: "Rejected" } })}
                      className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Reject
                    </button>
                    <div className="flex items-center gap-2">
                      <TextField
                        type="number"
                        placeholder="Agreed amount"
                        value={agreedAmounts[app.id] ?? ""}
                        onChange={(e) => setAgreedAmounts((prev) => ({ ...prev, [app.id]: e.target.value }))}
                        className="!py-2 w-32"
                      />
                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            applicationId: app.id,
                            payload: { status: "Hired", agreedAmount: Number(agreedAmounts[app.id]) || 0 },
                          })
                        }
                        disabled={!agreedAmounts[app.id]}
                        className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
                      >
                        Hire
                      </button>
                    </div>
                  </div>
                ) : null}

                {app.status === "Shortlisted" && (
                  <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3 flex flex-wrap items-end gap-3">
                    <TextField
                      label="Demo date"
                      type="date"
                      value={demoForms[app.id]?.date ?? ""}
                      onChange={(e) => setDemoForms((prev) => ({ ...prev, [app.id]: { ...prev[app.id], date: e.target.value } }))}
                      className="!py-2"
                    />
                    <TextField
                      label="Demo time"
                      type="time"
                      value={demoForms[app.id]?.time ?? ""}
                      onChange={(e) => setDemoForms((prev) => ({ ...prev, [app.id]: { ...prev[app.id], time: e.target.value } }))}
                      className="!py-2"
                    />
                    <button
                      onClick={() =>
                        demoMutation.mutate({
                          teacherProfileId: app.teacherProfileId,
                          tuitionPostId: app.tuitionPostId,
                          selectedDate: demoForms[app.id]?.date,
                          selectedTime: `${demoForms[app.id]?.time}:00`,
                        })
                      }
                      disabled={!demoForms[app.id]?.date || !demoForms[app.id]?.time || demoMutation.isPending}
                      className="flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white disabled:opacity-50"
                    >
                      <Calendar className="h-3.5 w-3.5" /> Request demo
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">No applications yet</p>
            <p className="text-slate-400 text-sm mt-1">Teachers who apply to this vacancy will appear here.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default ParentApplicationsPage;
