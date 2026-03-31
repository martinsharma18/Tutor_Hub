import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import { adminApi } from "../../features/admin/api";
import { postsApi } from "../../features/posts/api";
import { Users, TrendingUp, CheckCircle2, DollarSign, FileText, MessageSquare, Briefcase } from "lucide-react";

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
    { 
      label: "Total Users", 
      value: summary?.totalUsers ?? 0, 
      accent: "blue",
      icon: Users,
      trend: "Total registered"
    },
    { 
      label: "Total Teachers", 
      value: summary?.totalTeachers ?? 0, 
      accent: "amber",
      icon: Users,
      trend: "Active profiles"
    },
    { 
      label: "Available Vacancies", 
      value: summary?.availableVacancies ?? 0, 
      accent: "emerald",
      icon: Briefcase,
      trend: "Current openings"
    },
    { 
      label: "Earnings", 
      value: `$${summary?.totalCommissionEarned?.toFixed(2) ?? "0.00"}`, 
      accent: "orange",
      icon: DollarSign,
      trend: "Platfrom revenue"
    },
  ];

  const quickActions = [
    { label: "Post Vacancy", count: null, to: "/admin/create-post", icon: FileText, color: "orange" },
    { label: "Manage Vacancies", count: summary?.availableVacancies ?? 0, to: "/admin/posts", icon: Briefcase, color: "blue" },
    { label: "Teacher Applications", count: null, to: "/admin/applications", icon: MessageSquare, color: "rose" },
    { label: "Teacher Approval", count: 0, to: "/admin/teachers", icon: CheckCircle2, color: "emerald" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Dashboard</h1>
          <p className="text-orange-100 text-xl font-medium">Platform Management & Overview</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard 
            key={stat.label} 
            label={stat.label} 
            value={stat.value} 
            accent={stat.accent}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <SectionCard title="Administration Controls">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group relative bg-white rounded-2xl border-2 border-slate-100 p-8 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-${action.color}-50 text-${action.color}-600 group-hover:bg-orange-500 group-hover:text-white transition-colors`}>
                  <action.icon className="h-8 w-8" />
                </div>
                {action.count !== null && (
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-bold group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors">
                    {action.count}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                {action.label}
              </h3>
              <p className="text-slate-500 mt-2 font-medium">Access dedicated tools</p>
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* Recent Vacancies */}
      <SectionCard 
        title="Active Vacancies"
        cta={
          <Link 
            to="/admin/posts" 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold hover:gap-3 transition-all"
          >
            Manage All <TrendingUp className="h-5 w-5" />
          </Link>
        }
      >
        {allPosts && allPosts.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.items.slice(0, 3).map((post) => (
              <VacancyCard
                key={post.id}
                post={post}
                showActions={false}
                className="border-2 border-slate-100 bg-white hover:border-orange-200"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-6" />
            <p className="text-xl font-bold text-slate-900">No vacancies posted yet</p>
            <p className="text-slate-500 mt-2">Start by creating your first tuition vacancy</p>
            <Link 
              to="/admin/create-post"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg"
            >
              Create Now <FileText className="h-5 w-5" />
            </Link>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminDashboardPage;
