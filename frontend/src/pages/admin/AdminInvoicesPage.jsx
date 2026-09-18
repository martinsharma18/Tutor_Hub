import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { adminPlacementsApi } from "../../features/placements/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Receipt, RefreshCw, CheckCircle2, Send, Coins, Clock } from "lucide-react";

const STATUS_TABS = [
  { key: "Pending", label: "Unpaid" },
  { key: "Paid", label: "Paid" },
  { key: "", label: "All" },
];

const statusStyles = {
  Paid: "badge-green",
  Pending: "badge-amber",
  Overdue: "badge-red",
  Waived: "badge-slate",
};

const AdminInvoicesPage = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("Pending");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-invoices", status],
    queryFn: () => adminPlacementsApi.invoices({ status: status || undefined, pageSize: 100 }),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin-invoices"] });

  const generateMutation = useMutation({
    mutationFn: adminPlacementsApi.generateInvoices,
    onSuccess: (res) => {
      invalidate();
      toast.success(
        res.created > 0
          ? `Generated ${res.created} invoice${res.created !== 1 ? "s" : ""}.`
          : "Already up to date — no new invoices needed."
      );
    },
    onError: () => toast.error("Could not generate invoices."),
  });

  const markPaidMutation = useMutation({
    mutationFn: ({ id, reference }) => adminPlacementsApi.markInvoicePaid(id, reference),
    onSuccess: () => { invalidate(); toast.success("Payment recorded."); },
    onError: (e) => toast.error(e.response?.data?.detail ?? "Could not record payment."),
  });

  const payTeacherMutation = useMutation({
    mutationFn: (id) => adminPlacementsApi.payTeacher(id),
    onSuccess: () => { invalidate(); toast.success("Teacher payout recorded."); },
    onError: (e) => toast.error(e.response?.data?.detail ?? "Could not record payout."),
  });

  const items = data?.items ?? [];
  const collected = items.filter((i) => i.status === "Paid");
  const totalCommission = collected.reduce((sum, i) => sum + (i.commissionAmount ?? 0), 0);
  const owedToTeachers = collected
    .filter((i) => !i.teacherPaidOutAtUtc)
    .reduce((sum, i) => sum + i.teacherPayoutAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Invoices"
        subtitle="Collect from parents, pay out to teachers, keep the margin."
        icon={Receipt}
        actions={
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="btn-primary text-sm disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" />
            {generateMutation.isPending ? "Generating…" : "Generate this month"}
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Commission collected"
          value={`NPR ${totalCommission.toFixed(2)}`}
          accent="emerald"
          icon={Coins}
          subtitle={`from ${collected.length} paid invoice${collected.length !== 1 ? "s" : ""}`}
        />
        <StatCard
          label="Owed to teachers"
          value={`NPR ${owedToTeachers.toFixed(2)}`}
          accent="amber"
          icon={Clock}
          subtitle="collected but not yet paid out"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              status === tab.key
                ? "bg-primary-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SectionCard title="Invoices" subtitle={`${data?.totalCount ?? 0} total`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Subject</th>
                <th>Parent</th>
                <th>Teacher</th>
                <th>Amount</th>
                <th>Commission</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-8 text-slate-400">Loading…</td></tr>
              ) : items.length > 0 ? (
                items.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="text-sm font-medium text-slate-800">
                      {new Date(invoice.periodStart).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                    </td>
                    <td className="text-sm text-slate-600">{invoice.subject}</td>
                    <td className="text-sm text-slate-600">{invoice.parentName}</td>
                    <td className="text-sm text-slate-600">{invoice.teacherName}</td>
                    <td className="text-sm font-semibold text-slate-900">NPR {invoice.amountDue?.toFixed(2)}</td>
                    <td className="text-sm font-semibold text-emerald-700">
                      NPR {invoice.commissionAmount?.toFixed(2)}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className={statusStyles[invoice.status] ?? "badge-slate"}>{invoice.status}</span>

                        {invoice.status !== "Paid" && (
                          <button
                            onClick={() => {
                              const reference = window.prompt("Payment reference (optional)") ?? "";
                              markPaidMutation.mutate({ id: invoice.id, reference });
                            }}
                            className="flex items-center gap-1 rounded-lg border border-emerald-200 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Mark paid
                          </button>
                        )}

                        {/* Payout is only offered once the parent's money is in — the API enforces
                            this too, so the platform can't accidentally pay out of pocket. */}
                        {invoice.status === "Paid" && !invoice.teacherPaidOutAtUtc && (
                          <button
                            onClick={() => payTeacherMutation.mutate(invoice.id)}
                            className="flex items-center gap-1 rounded-lg border border-blue-200 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                          >
                            <Send className="h-3.5 w-3.5" /> Pay teacher
                          </button>
                        )}

                        {invoice.teacherPaidOutAtUtc && (
                          <span className="text-xs text-slate-400">Teacher paid</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Receipt className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No invoices here</p>
                      <p className="text-slate-400 text-sm mt-1">
                        Use "Generate this month" to bill all active placements.
                      </p>
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

export default AdminInvoicesPage;
