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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} />
        ))}
      </div>

      <SectionCard title="Open Tuition Vacancies">
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
                    className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 transition-all duration-200 transform hover:scale-105 active:scale-95"
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

