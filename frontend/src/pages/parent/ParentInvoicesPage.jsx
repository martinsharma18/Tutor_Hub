import { useQuery } from "@tanstack/react-query";
import { placementsApi } from "../../features/placements/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import { Receipt, AlertCircle } from "lucide-react";

const statusStyles = {
  Paid: "badge-green",
  Pending: "badge-amber",
  Overdue: "badge-red",
  Waived: "badge-slate",
};

const ParentInvoicesPage = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["parent-invoices"],
    queryFn: placementsApi.myInvoices,
  });

  const outstanding = invoices?.filter((i) => i.status === "Pending" || i.status === "Overdue") ?? [];
  const totalDue = outstanding.reduce((sum, i) => sum + (i.amountDue ?? 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader title="Invoices" subtitle="Your monthly tuition payments." icon={Receipt} />

      {totalDue > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900">
              NPR {totalDue.toFixed(2)} outstanding across {outstanding.length} invoice
              {outstanding.length !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-amber-700 mt-0.5">
              Please settle with the office — payments are recorded here once confirmed.
            </p>
          </div>
        </div>
      )}

      <SectionCard title="All Invoices" subtitle={`${invoices?.length ?? 0} total`} noPadding>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Amount</th>
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
                  <td className="text-sm text-slate-600">{invoice.teacherName}</td>
                  <td className="text-sm font-semibold text-slate-900">NPR {invoice.amountDue?.toFixed(2)}</td>
                  <td className="text-right">
                    <span className={statusStyles[invoice.status] ?? "badge-slate"}>{invoice.status}</span>
                  </td>
                </tr>
              ))}
              {(!invoices || invoices.length === 0) && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Receipt className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No invoices yet</p>
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

export default ParentInvoicesPage;
