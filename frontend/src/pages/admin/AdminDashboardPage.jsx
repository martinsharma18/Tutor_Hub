import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import PageHeader from "../../components/ui/PageHeader";
import { adminApi } from "../../features/admin/api";
import { postsApi } from "../../features/posts/api";
import {
  Users, DollarSign, Briefcase, MessageSquare, FileText,
  CheckCircle2, PlusCircle, ArrowRight, LayoutDashboard,
} from "lucide-react";

const AdminDashboardPage = () => {
  const { data: summary } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.dashboard,
  });

  const { data: allPosts } = useQuery({
    queryKey: ["all-posts"],
    queryFn: () => postsApi.allPosts({ page: 1, pageSize: 6 }),
  });

  const stats = [
    { label: "Total Users",        value: summary?.totalUsers ?? 0,       accent: "indigo", icon: Users,     subtitle: "Registered accounts" },
    { label: "Total Teachers",     value: summary?.totalTeachers ?? 0,    accent: "blue",   icon: Users,     subtitle: "Active profiles"      },
    { label: "Open Vacancies",     value: summary?.availableVacancies ?? 0, accent: "emerald", icon: Briefcase, subtitle: "Current openings"   },
    { label: "Platform Earnings",  value: `$${(summary?.totalCommissionEarned ?? 0).toFixed(2)}`, accent: "amber", icon: DollarSign, subtitle: "Total commission" },
  ];

  const quickActions = [
    { label: "Post Vacancy",       to: "/admin/create-post",    icon: PlusCircle,   color: "text-primary-600 bg-primary-50",   desc: "Create a new tuition opening"          },
    { label: "Manage Vacancies",   to: "/admin/posts",          icon: Briefcase,    color: "text-blue-600 bg-blue-50",         desc: `${summary?.availableVacancies ?? 0} active` },
    { label: "Applications",       to: "/admin/applications",   icon: MessageSquare, color: "text-rose-600 bg-rose-50",         desc: "Review submitted applications"         },
    { label: "Teacher Approval",   to: "/admin/teachers",       icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50",   desc: "Approve pending teachers"              },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Platform Dashboard"
        subtitle="Monitor performance, manage users, and oversee vacancies."
        icon={LayoutDashboard}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick Actions */}
      <SectionCard title="Administration Controls" subtitle="Quick access to common tasks">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.to}
                className="group flex flex-col gap-3 p-5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-card-md transition-all duration-200"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-primary-700 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all mt-auto self-end" />
              </Link>
            );
          })}
        </div>
      </SectionCard>

      {/* Recent Vacancies */}
      <SectionCard
        title="Active Vacancies"
        subtitle="Most recently posted openings"
        cta={
          <div className="flex items-center gap-2">
            <Link
              to="/admin/create-post"
              className="btn-primary text-xs px-3 py-2"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Post Vacancy
            </Link>
            <Link
              to="/admin/posts"
              className="btn-secondary text-xs px-3 py-2"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
      >
        {allPosts && allPosts.items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.items.slice(0, 3).map((post) => (
              <VacancyCard key={post.id} post={post} showActions={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-slate-700 font-semibold">No active vacancies yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-6">Post your first tuition vacancy to attract teachers.</p>
            <Link to="/admin/create-post" className="btn-primary">
              <PlusCircle className="h-4 w-4" /> Post Vacancy
            </Link>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminDashboardPage;
