import { useQuery } from "@tanstack/react-query";
import { placementsApi } from "../../features/placements/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Wallet, CheckCircle2, Clock } from "lucide-react";

const TeacherEarningsPage = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["teacher-earnings"],
    queryFn: placementsApi.myEarnings,
  });

  // "Received" means the platform has actually released the money, which is a separate step from
  // the parent paying — so awaiting payout covers both "parent hasn't paid" and "not yet released".
  const received = invoices?.filter((i) => i.teacherPaidOutAtUtc) ?? [];
  const awaiting = invoices?.filter((i) => !i.teacherPaidOutAtUtc) ?? [];

  const totalReceived = received.reduce((sum, i) => sum + i.teacherPayoutAmount, 0);
  const totalAwaiting = awaiting.reduce((sum, i) => sum + i.teacherPayoutAmount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader title="Earnings" subtitle="What you've been paid, and what's still coming." icon={Wallet} />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Received"
          value={`NPR ${totalReceived.toFixed(2)}`}
          accent="emerald"
          icon={CheckCircle2}
          subtitle={`${received.length} payout${received.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          label="Awaiting payout"
          value={`NPR ${totalAwaiting.toFixed(2)}`}
          accent="amber"
          icon={Clock}
          subtitle={`${awaiting.length} invoice${awaiting.length !== 1 ? "s" : ""}`}
        />
      </div>

      <SectionCard title="Payment History" subtitle={`${invoices?.length ?? 0} total`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Subject</th>
                <th>Student / Parent</th>
                <th>Your payout</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="text-sm font-medium text-slate-800">
                    {new Date(invoice.periodStart).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                  </td>
                  <td className="text-sm text-slate-600">{invoice.subject}</td>
                  <td className="text-sm text-slate-600">{invoice.parentName}</td>
                  <td className="text-sm font-semibold text-emerald-700">
                    NPR {invoice.teacherPayoutAmount.toFixed(2)}
                  </td>
                  <td className="text-right">
                    {invoice.teacherPaidOutAtUtc ? (
                      <span className="badge-green">Paid to you</span>
                    ) : invoice.status === "Paid" ? (
                      <span className="badge-blue">Payout processing</span>
                    ) : (
                      <span className="badge-amber">Awaiting parent payment</span>
                    )}
                  </td>
                </tr>
              ))}
              {(!invoices || invoices.length === 0) && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Wallet className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No earnings yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

export default TeacherEarningsPage;
