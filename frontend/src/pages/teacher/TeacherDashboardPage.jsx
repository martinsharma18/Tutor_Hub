import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import PageHeader from "../../components/ui/PageHeader";
import { teacherApi } from "../../features/teachers/api";
import { postsApi } from "../../features/posts/api";
import { demoApi } from "../../features/demo/api";
import TextAreaField from "../../components/forms/TextAreaField";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  CheckCircle2, Star, Calendar, Briefcase, Phone, ExternalLink, LayoutDashboard,
} from "lucide-react";

const TeacherDashboardPage = () => {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState({});

  const { data: profile } = useQuery({ queryKey: ["teacher-profile"], queryFn: teacherApi.me });
  const { data: posts }   = useQuery({ queryKey: ["open-posts"],      queryFn: () => postsApi.openPosts({ page: 1, pageSize: 10 }) });
  const { data: demos }   = useQuery({ queryKey: ["teacher-demo"],    queryFn: demoApi.teacherRequests });
  const { data: myApplications } = useQuery({ queryKey: ["teacher-applications"], queryFn: teacherApi.myApplications });

  const applyMutation = useMutation({
    mutationFn: teacherApi.applyToPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher-applications"] });
      setMessages((prev) => ({ ...prev, [variables.tuitionPostId]: "" }));
      toast.success("Application sent!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail ?? "Could not send your application. Please try again.");
    },
  });

  const appliedPostIds = new Set((myApplications ?? []).map((app) => app.tuitionPostId));

  const stats = [
    {
      label:    "Profile Status",
      value:    profile?.isApproved ? "Approved" : "Pending",
      accent:   profile?.isApproved ? "emerald" : "amber",
      icon:     CheckCircle2,
      subtitle: profile?.isApproved ? "Visible to parents" : "Awaiting review",
    },
    {
      label:    "Featured",
      value:    profile?.isFeatured ? "Featured" : "Standard",
      accent:   profile?.isFeatured ? "indigo" : "rose",
      icon:     Star,
      subtitle: profile?.isFeatured ? "Priority listing" : "Normal listing",
    },
    {
      label:    "Demo Requests",
      value:    demos?.length ?? 0,
      accent:   "blue",
      icon:     Calendar,
      subtitle: "Pending demo calls",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Manage your applications, handle demo requests, and find new tuition opportunities."
        icon={LayoutDashboard}
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* My applications */}
      <SectionCard title="My Applied Tuitions" subtitle={`${myApplications?.length ?? 0} applications`}>
        {myApplications && myApplications.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {myApplications.map((app) => (
              <div key={app.id} className="card p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">{app.tuitionPost.subject}</h4>
                    <p className="text-xs text-slate-500">{app.tuitionPost.classLevel} · {app.tuitionPost.city}</p>
                  </div>
                  <span className={app.isPaymentVerified ? "badge-green" : "badge-amber"}>
                    {app.isPaymentVerified ? "Unlocked" : "Pending"}
                  </span>
                </div>

                {/* Fees */}
                <div className="flex gap-4 py-3 border-y border-slate-100">
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Budget</p>
                    <p className="font-semibold text-slate-800 text-sm">${app.tuitionPost.budget}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Unlock Fee</p>
                    <p className="font-semibold text-brand-600 text-sm">${app.tuitionPost.commissionAmount}</p>
                  </div>
                </div>

                {/* Action */}
                {!app.isPaymentVerified ? (
                  <div>
                    <p className="text-xs text-slate-400 mb-3">
                      Pay the unlock fee → Send screenshot to Admin on WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/9779800000000?text=Hi+Admin,+I+have+applied+for+${encodeURIComponent(app.tuitionPost.subject)}+in+${app.tuitionPost.city}+ID:+${app.id}.+I+want+to+unlock+the+contact.`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-success w-full text-sm py-2.5"
                    >
                      <ExternalLink className="h-4 w-4" /> Unlock via WhatsApp
                    </a>
                  </div>
                ) : (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                    <p className="text-[10px] uppercase font-semibold text-emerald-600 mb-1">Parent Contact</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-800 font-mono text-lg">
                        {app.parentPhoneNumber ?? "—"}
                      </span>
                      {app.parentPhoneNumber && (
                        <a
                          href={`tel:${app.parentPhoneNumber}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">No applications yet</p>
            <p className="text-slate-400 text-sm mt-1">Browse vacancies below and apply!</p>
          </div>
        )}
      </SectionCard>

      {/* Available vacancies */}
      <SectionCard title="Available Vacancies" subtitle="Open tuition positions you can apply for">
        {posts && posts.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.items.map((post) => {
              const alreadyApplied = appliedPostIds.has(post.id);
              return (
                <div key={post.id} className="flex flex-col gap-3">
                  <VacancyCard post={post} showActions={false} />

                  <div className="card p-4 bg-slate-50 border-slate-100">
                    {alreadyApplied ? (
                      <div className="badge-green w-full justify-center py-2 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Already applied
                      </div>
                    ) : (
                      <>
                        <TextAreaField
                          label="Message to parent"
                          rows={3}
                          value={messages[post.id] ?? ""}
                          onChange={(e) =>
                            setMessages((prev) => ({ ...prev, [post.id]: e.target.value }))
                          }
                          className="mb-3"
                        />
                        <button
                          onClick={() =>
                            applyMutation.mutate({ tuitionPostId: post.id, message: messages[post.id] ?? "" })
                          }
                          className="btn-primary w-full text-sm"
                          disabled={applyMutation.isPending || !messages[post.id]?.trim()}
                        >
                          {applyMutation.isPending ? "Applying…" : "Apply to this post"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">No open vacancies right now</p>
            <p className="text-slate-400 text-sm mt-1">Check back later for new opportunities!</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default TeacherDashboardPage;
