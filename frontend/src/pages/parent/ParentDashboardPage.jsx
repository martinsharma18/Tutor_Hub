import { useQuery } from "@tanstack/react-query";
import StatCard from "../../components/ui/StatCard";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { postsApi } from "../../features/posts/api";
import { demoApi } from "../../features/demo/api";
import { paymentsApi } from "../../features/payments/api";
import { format } from "date-fns";

const ParentDashboardPage = () => {
  const { data: posts } = useQuery({
    queryKey: ["parent-posts"],
    queryFn: () => postsApi.myPosts({ page: 1, pageSize: 5 }),
  });

  const { data: demos } = useQuery({
    queryKey: ["parent-demo"],
    queryFn: demoApi.parentRequests,
  });

  const { data: payments } = useQuery({
    queryKey: ["parent-payments"],
    queryFn: paymentsApi.parentPayments,
  });

  const stats = [
    {
      label: "Active Posts",
      value: posts?.items.filter((p) => p.status.toLowerCase() !== "closed").length ?? 0,
      accent: "blue",
    },
    {
      label: "Demo Requests",
      value: demos?.length ?? 0,
      accent: "emerald",
    },
    {
      label: "Pending Payments",
      value: payments?.filter((p) => p.status.toLowerCase() === "pending").length ?? 0,
      accent: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} accent={stat.accent} />
        ))}
      </div>

      <SectionCard
        title="Recent tuition posts"
        cta={
          <a href="/parent/posts" className="text-sm font-semibold text-brand-600 hover:underline">
            View all
          </a>
        }
      >
        <div className="divide-y divide-slate-100">
          {posts?.items.map((post) => (
            <div key={post.id} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900">{post.subject}</p>
                <p className="text-sm text-slate-500">
                  {post.classLevel} • {post.city} ({post.mode})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-slate-700">${post.budget.toFixed(2)}</p>
                <StatusBadge status={post.status} />
              </div>
            </div>
          )) ?? <p className="py-6 text-sm text-slate-500">No posts yet.</p>}
        </div>
      </SectionCard>

      <SectionCard title="Demo requests">
        {demos && demos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {demos.map((demo) => (
              <div key={demo.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">
                  {format(new Date(demo.selectedDate), "MMM dd")} at {demo.selectedTime}
                </p>
                <StatusBadge status={demo.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No demo requests yet.</p>
        )}
      </SectionCard>

      <SectionCard title="Commission payments">
        {payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2">Post</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Commission</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="py-3">{payment.tuitionPostId.slice(0, 6)}...</td>
                    <td className="py-3 font-semibold">${payment.amount.toFixed(2)}</td>
                    <td className="py-3 text-slate-600">${payment.commissionAmount.toFixed(2)}</td>
                    <td className="py-3">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No payments yet.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default ParentDashboardPage;

