import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { paymentsApi } from "../../features/payments/api";
import TextField from "../../components/forms/TextField";

const TeacherPaymentsPage = () => {
  const queryClient = useQueryClient();
  const [references, setReferences] = useState({});

  const { data } = useQuery({
    queryKey: ["teacher-payments"],
    queryFn: paymentsApi.teacherPayments,
  });

  const mutation = useMutation({
    mutationFn: ({ id, reference }) => paymentsApi.markPaid(id, reference),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["teacher-payments"] }),
  });

  return (
    <SectionCard title="Commission payments">
      {data && data.length > 0 ? (
        <div className="space-y-4">
          {data.map((payment) => (
            <div key={payment.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900">${payment.amount.toFixed(2)}</p>
                  <p className="text-sm text-slate-500">Commission ${payment.commissionAmount.toFixed(2)}</p>
                </div>
                <StatusBadge status={payment.status} />
              </div>
              {payment.status.toLowerCase() === "pending" && (
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
                  <TextField
                    label="Payment reference"
                    value={references[payment.id] ?? ""}
                    onChange={(e) => setReferences((prev) => ({ ...prev, [payment.id]: e.target.value }))}
                  />
                  <button
                    onClick={() => mutation.mutate({ id: payment.id, reference: references[payment.id] })}
                    className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                  >
                    Mark as Paid
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">No payments assigned.</p>
      )}
    </SectionCard>
  );
};

export default TeacherPaymentsPage;

