import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { teacherApi } from "../../features/teachers/api";
import { postsApi } from "../../features/posts/api";
import { demoApi } from "../../features/demo/api";
import TextAreaField from "../../components/forms/TextAreaField";
import { useState } from "react";

const TeacherDashboardPage = () => {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState({});

  const { data: profile } = useQuery({
    queryKey: ["teacher-profile"],
    queryFn: teacherApi.me,
  });

  const { data: posts } = useQuery({
    queryKey: ["open-posts"],
    queryFn: () => postsApi.openPosts({ page: 1, pageSize: 10 }),
  });

  const { data: demos } = useQuery({
    queryKey: ["teacher-demo"],
    queryFn: demoApi.teacherRequests,
  });

  const applyMutation = useMutation({
    mutationFn: teacherApi.applyToPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-applications"] });
    },
  });

  const { data: myApplications } = useQuery({
    queryKey: ["teacher-applications"],
    queryFn: teacherApi.myApplications,
  });

  const stats = [
    {
      label: "Profile status",
      value: profile?.isApproved ? "Approved" : "Pending approval",
      accent: profile?.isApproved ? "emerald" : "amber",
    },
    {
      label: "Featured",
      value: profile?.isFeatured ? "Featured" : "Standard",
      accent: profile?.isFeatured ? "blue" : "rose",
    },
    {
      label: "Demo requests",
      value: demos?.length ?? 0,
      accent: "blue",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-orange-200 via-orange-100 to-orange-200 rounded-[2.5rem] p-8 md:p-14 shadow-xl border border-white/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/40 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-white/30 rounded-full -mb-20 blur-2xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight text-slate-900">Teacher Dashboard</h1>
          <p className="text-slate-700 text-lg md:text-xl font-medium tracking-wide">Manage your applications, handle demo requests, and find new tuition opportunities.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} />
        ))}
      </div>

      <SectionCard title="My Applied Tuitions">
        {myApplications && myApplications.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {myApplications.map((app) => (
              <div 
                key={app.id} 
                className="glass-panel p-8 group relative card-hover"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">{app.tuitionPost.subject}</h4>
                    <p className="text-sm text-slate-500">{app.tuitionPost.classLevel} - {app.tuitionPost.city}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    app.isPaymentVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {app.isPaymentVerified ? "Contact Unlocked" : "Payment Pending"}
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-slate-50 mb-4">
                  <div className="text-sm">
                    <span className="text-slate-400 block uppercase text-[10px] font-bold">Budget</span>
                    <span className="font-bold text-slate-700">${app.tuitionPost.budget}</span>
                  </div>
                  <div className="text-sm text-right">
                    <span className="text-slate-400 block uppercase text-[10px] font-bold">Unlock Fee</span>
                    <span className="font-bold text-orange-600">${app.tuitionPost.commissionAmount}</span>
                  </div>
                </div>

                {!app.isPaymentVerified ? (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500 italic">
                      Step 1: Pay the unlock fee. <br/>
                      Step 2: Send screenshot to Admin on WhatsApp.
                    </p>
                    <a 
                      href={`https://wa.me/9779800000000?text=Hi+Admin,+I+have+applied+for+${encodeURIComponent(app.tuitionPost.subject)}+in+${app.tuitionPost.city}+ID:+${app.id}.+I+want+to+unlock+the+contact.`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-premium inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all"
                    >
                      Unlock Contact (WhatsApp)
                    </a>
                  </div>
                ) : (
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-4">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block mb-1">Parent Phone Number</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-mono font-bold text-emerald-700">
                        {app.tuitionPost.parentPhoneNumber || "Contact Hidden"}
                      </span>
                      <a 
                        href={`tel:${app.tuitionPost.parentPhoneNumber}`}
                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        <Clock className="h-5 w-5" /> {/* Using Clock icon as a placeholder for phone since it was imported */}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">You haven't applied to any tuitions yet.</p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Available Tuition Vacancies">
        {posts && posts.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.items.map((post) => (
              <div key={post.id} className="space-y-4">
                <VacancyCard
                  post={post}
                  onApply={() => {
                    const message = messages[post.id] ?? "";
                    if (message.trim()) {
                      applyMutation.mutate({ tuitionPostId: post.id, message });
                    } else {
                      alert("Please enter a message to the parent");
                    }
                  }}
                  showActions={false}
                />
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <TextAreaField
                    label="Message to parent"
                    rows={3}
                    value={messages[post.id] ?? ""}
                    onChange={(e) => setMessages((prev) => ({ ...prev, [post.id]: e.target.value }))}
                    className="mb-3"
                  />
                  <button
                    onClick={() => applyMutation.mutate({ tuitionPostId: post.id, message: messages[post.id] ?? "" })}
                    className="btn-premium w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg disabled:opacity-60 transition-all"
                    disabled={applyMutation.isPending || !messages[post.id]?.trim()}
                  >
                    {applyMutation.isPending ? "Applying..." : "Apply to this post"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No open vacancies right now.</p>
            <p className="text-slate-400 text-sm mt-2">Check back later for new opportunities!</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default TeacherDashboardPage;

