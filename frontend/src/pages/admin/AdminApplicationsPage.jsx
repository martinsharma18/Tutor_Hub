import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../features/admin/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import { Briefcase, Calendar, CreditCard, CheckCircle, MessageSquare } from "lucide-react";
import { toast } from "react-hot-toast";

const statusStyles = {
  Pending:  "badge-amber",
  Approved: "badge-green",
  Rejected: "badge-red",
  Active:   "badge-blue",
};

const AdminApplicationsPage = () => {
  const queryClient = useQueryClient();

  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: adminApi.getApplications,
  });

  const verifyMutation = useMutation({
    mutationFn: adminApi.verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      toast.success("Payment verified — contact released to teacher!");
    },
    onError: () => toast.error("Failed to verify payment."),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Teacher Applications"
        subtitle="Review and monitor all applications submitted by tutors"
        icon={MessageSquare}
      />

      <SectionCard
        title={`All Applications`}
        subtitle={`${applications?.length ?? 0} total`}
        noPadding
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Vacancy / Subject</th>
                <th>Applied</th>
                <th>Fee</th>
                <th className="text-center">Payment</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications?.map((app) => (
                <tr key={app.id}>
                  {/* Teacher */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex-shrink-0">
                        {app.teacherName?.charAt(0) ?? "T"}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{app.teacherName}</p>
                        <p className="text-xs text-slate-400">
                          {app.teacherCity} · {app.yearsOfExperience}y exp
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Subject */}
                  <td>
                    <p className="font-medium text-slate-800 text-sm">{app.postSubject}</p>
                    <p className="text-xs text-slate-400">Subject Inquiry</p>
                  </td>

                  {/* Date */}
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-slate-300" />
                      {new Date(app.createdAtUtc).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </div>
                  </td>

                  {/* Fee */}
                  <td>
                    <span className="font-semibold text-slate-800 text-sm">
                      ${app.commissionAmount?.toFixed(2) ?? "0.00"}
                    </span>
                  </td>

                  {/* Payment action */}
                  <td className="text-center">
                    {app.isPaymentVerified ? (
                      <span className="badge-green">
                        <CheckCircle className="h-3 w-3" /> Released
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (confirm("Verify payment and release parent contact to teacher?")) {
                            verifyMutation.mutate(app.id);
                          }
                        }}
                        disabled={verifyMutation.isPending}
                        className="btn text-xs px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        {verifyMutation.isPending ? "Verifying…" : "Verify"}
                      </button>
                    )}
                  </td>

                  {/* Status */}
                  <td className="text-right">
                    <span className={statusStyles[app.status] ?? "badge-slate"}>
                      {app.status ?? "Pending"}
                    </span>
                  </td>
                </tr>
              ))}

              {(!applications || applications.length === 0) && (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Briefcase className="h-6 w-6 text-slate-300" />
                      </div>
                      <p className="font-semibold text-slate-700">No applications yet</p>
                      <p className="text-slate-400 text-sm mt-1">
                        When tutors apply for vacancies, they will appear here.
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

export default AdminApplicationsPage;
