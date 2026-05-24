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
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 bg-[length:200%_auto] animate-[gradient_8s_ease_infinite] rounded-[2.5rem] p-8 md:p-14 text-white shadow-[0_10px_40px_-10px_rgba(249,115,22,0.6)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-white/10 rounded-full -mb-20 blur-2xl"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Platform Dashboard</h1>
          <p className="text-orange-100 text-lg md:text-xl font-medium tracking-wide">Monitor performance, manage users, and oversee vacancies across the network.</p>
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
              className="glass-panel group relative p-8 card-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-4 rounded-2xl bg-${action.color}-50 text-${action.color}-600 group-hover:bg-gradient-to-br group-hover:from-${action.color}-400 group-hover:to-${action.color}-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] group-hover:-translate-y-1`}>
                    <action.icon className="h-7 w-7" />
                  </div>
                  {action.count !== null && (
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-md text-slate-700 rounded-full text-xs font-bold shadow-sm border border-slate-100 group-hover:bg-white group-hover:text-orange-600 transition-colors">
                      {action.count} New
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-rose-600 transition-all duration-300">
                    {action.label}
                  </h3>
                  <p className="text-slate-500 mt-2 text-sm font-medium tracking-wide">Manage & Configure</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* Recent Vacancies */}
      <SectionCard 
        title="Active Vacancies"
        cta={
          <div className="flex items-center gap-3">
            <Link 
              to="/admin/create-post"
              className="group flex items-center gap-2 text-sm text-white font-bold bg-gradient-to-r from-orange-500 to-rose-500 shadow-md hover:shadow-lg px-5 py-2 rounded-full transition-all hover:-translate-y-0.5"
            >
              Post Vacancy <FileText className="h-4 w-4" />
            </Link>
            <Link 
              to="/admin/posts" 
              className="group flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-bold bg-orange-50 hover:bg-orange-100 px-5 py-2 rounded-full transition-all"
            >
              View All <TrendingUp className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        }
      >
        {allPosts && allPosts.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.items.slice(0, 3).map((post) => (
              <VacancyCard
                key={post.id}
                post={post}
                showActions={false}
                className="glass-panel !border-white/80 hover:!border-orange-200"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 glass-panel border-dashed border-2 border-slate-300/50">
            <div className="inline-flex p-6 rounded-full bg-slate-100/50 mb-6 shadow-inner">
              <Briefcase className="h-12 w-12 text-slate-400" />
            </div>
            <p className="text-2xl font-black text-slate-800 tracking-tight">No active vacancies</p>
            <p className="text-slate-500 mt-3 font-medium">Post your first tuition vacancy to attract teachers.</p>
            <Link 
              to="/admin/create-post"
              className="btn-premium inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]"
            >
              Post Vacancy <FileText className="h-5 w-5" />
            </Link>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default AdminDashboardPage;
