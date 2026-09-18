import { useQuery } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { paymentsApi } from "../../features/payments/api";
import { CreditCard } from "lucide-react";

const ParentPaymentsPage = () => {
  const { data } = useQuery({ queryKey: ["parent-payments"], queryFn: paymentsApi.parentPayments });

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Payment History"
        subtitle="Commission payments recorded against your hired teachers."
        icon={CreditCard}
      />

      <SectionCard title="Payments" subtitle={`${data?.length ?? 0} total`}>
        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((payment) => (
              <div key={payment.id} className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">${payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-slate-500">Commission ${payment.commissionAmount.toFixed(2)}</p>
                </div>
                <StatusBadge status={payment.status} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No payments recorded yet.</p>
        )}
      </SectionCard>
    </div>
  );
};

export default ParentPaymentsPage;
