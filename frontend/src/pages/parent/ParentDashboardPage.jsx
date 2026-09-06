import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { postsApi } from "../../features/posts/api";
import { demoApi } from "../../features/demo/api";
import { LayoutDashboard, Briefcase, Calendar, PlusCircle } from "lucide-react";

const ParentDashboardPage = () => {
  const { data: posts } = useQuery({
    queryKey: ["parent-posts"],
    queryFn: () => postsApi.myPosts({ page: 1, pageSize: 10 }),
  });
  const { data: demos } = useQuery({ queryKey: ["parent-demo"], queryFn: demoApi.parentRequests });

  const openCount = posts?.items.filter((p) => p.status === "Open" || p.status === "Approved").length ?? 0;

  const stats = [
    { label: "My Vacancies", value: posts?.totalCount ?? 0, accent: "indigo", icon: Briefcase, subtitle: `${openCount} currently open` },
    { label: "Demo Requests", value: demos?.length ?? 0, accent: "blue", icon: Calendar, subtitle: "Across all vacancies" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Parent Dashboard"
        subtitle="Post tuition requirements, review applications, and connect with teachers."
        icon={LayoutDashboard}
        actions={
          <Link to="/parent/create-post" className="btn-primary text-sm">
            <PlusCircle className="h-4 w-4" /> Post a requirement
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <SectionCard title="My Vacancies" subtitle={`${posts?.totalCount ?? 0} total`}>
        {posts && posts.items.length > 0 ? (
          <div className="space-y-3">
            {posts.items.map((post) => (
              <Link
                key={post.id}
                to={`/parent/posts/${post.id}/applications`}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-brand-300 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900">{post.subject}</p>
                  <p className="text-xs text-slate-500">{post.classLevel} · {post.city}</p>
                </div>
                <StatusBadge status={post.status} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-slate-300" />
            </div>
            <p className="font-semibold text-slate-700">No vacancies posted yet</p>
            <p className="text-slate-400 text-sm mt-1">Post your first tuition requirement to get started.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default ParentDashboardPage;
