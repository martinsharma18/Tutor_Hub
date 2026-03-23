import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import VacancyCard from "../../components/ui/VacancyCard";
import { adminApi } from "../../features/admin/api";
import { postsApi } from "../../features/posts/api";
import { Users, TrendingUp, AlertCircle, CheckCircle2, DollarSign, FileText } from "lucide-react";

const AdminDashboardPage = () => {
  const { data: summary } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.dashboard,
  });

  const { data: pendingPosts } = useQuery({
    queryKey: ["pending-posts"],
    queryFn: () => postsApi.pendingPosts({ page: 1, pageSize: 6 }),
  });

  const stats = [
    { 
      label: "Total Users", 
      value: summary?.totalUsers ?? 0, 
      accent: "blue",
      icon: Users,
      trend: "+12% this month"
    },
    { 
      label: "Parents", 
      value: summary?.totalParents ?? 0, 
      accent: "emerald",
      icon: Users,
      trend: "Active"
    },
    { 
      label: "Teachers", 
      value: summary?.totalTeachers ?? 0, 
      accent: "amber",
      icon: Users,
      trend: "Registered"
    },
    { 
      label: "Commission Earned", 
      value: `$${summary?.totalCommissionEarned?.toFixed(2) ?? "0.00"}`, 
      accent: "orange",
      icon: DollarSign,
      trend: "Total revenue"
    },
  ];

  const quickActions = [
    { label: "Pending Posts", count: pendingPosts?.items.length ?? 0, to: "/admin/pending-posts", icon: FileText, color: "orange" },
    { label: "User Management", count: summary?.totalUsers ?? 0, to: "/admin/users", icon: Users, color: "blue" },
    { label: "Teacher Approval", count: 0, to: "/admin/teachers", icon: CheckCircle2, color: "emerald" },
    { label: "Analytics", count: null, to: "/admin/analytics", icon: TrendingUp, color: "amber" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-orange-100 text-lg">Manage your platform, users, and content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <SectionCard title="Quick Actions">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group relative bg-gradient-to-br from-white to-orange-50 rounded-xl border-2 border-orange-200 p-6 hover:border-orange-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${action.color}-100`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                {action.count !== null && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                    {action.count}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                {action.label}
              </h3>
              <p className="text-sm text-slate-500 mt-1">Click to manage</p>
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* Pending Posts */}
      <SectionCard 
        title="Pending Posts Requiring Approval"
        cta={
          pendingPosts && pendingPosts.items.length > 0 ? (
            <Link 
              to="/admin/pending-posts" 
              className="text-orange-600 hover:text-orange-700 font-semibold hover:underline"
            >
              View All ({pendingPosts.items.length})
            </Link>
          ) : null
        }
      >
        {pendingPosts && pendingPosts.items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingPosts.items.map((post) => (
              <VacancyCard
                key={post.id}
                post={post}
                showActions={false}
                className="border-2 border-amber-200 bg-amber-50/50"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-200">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-700">All caught up!</p>
            <p className="text-sm text-green-600 mt-2">No pending posts requiring approval</p>
          </div>
        )}
      </SectionCard>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="System Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-700">System Online</span>
              </div>
              <span className="text-sm text-green-600">All services operational</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-blue-700">Database</span>
              </div>
              <span className="text-sm text-blue-600">Connected</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="h-2 w-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">New posts pending review</p>
                <p className="text-xs text-slate-500 mt-1">Just now</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">System backup completed</p>
                <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

