import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../features/admin/api";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { Briefcase, User, Calendar, MessageSquare, CheckCircle, CreditCard } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

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
      toast.success("Payment verified and contact released!");
    },
    onError: () => {
      toast.error("Failed to verify payment.");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Teacher Applications</h1>
        <p className="text-slate-600 font-medium">Review and monitor all applications submitted by tutors for openings.</p>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100">
                <th className="py-5 px-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Teacher</th>
                <th className="py-5 px-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Requested For</th>
                <th className="py-5 px-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Date Applied</th>
                <th className="py-5 px-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Fee</th>
                <th className="py-5 px-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Payment</th>
                <th className="py-5 px-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications?.map((app, index) => (
                <tr 
                  key={app.id} 
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center text-orange-600 font-bold shadow-sm border border-orange-200">
                        {app.teacherName?.charAt(0) || "T"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{app.teacherName}</p>
                        <p className="text-xs text-slate-500">{app.teacherCity} • {app.yearsOfExperience}y Exp</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col">
                      <p className="font-bold text-slate-800">{app.postSubject}</p>
                      <p className="text-xs text-slate-500">Subject Inquiry</p>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      {new Date(app.createdAtUtc).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </td>
                  <td className="py-5 px-4 font-bold text-orange-600">
                    ${app.commissionAmount?.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-5 px-4 text-center">
                    {app.isPaymentVerified ? (
                      <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Released
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if(confirm("Verify payment and reveal parent contact to this teacher?")) {
                            verifyMutation.mutate(app.id);
                          }
                        }}
                        disabled={verifyMutation.isPending}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        {verifyMutation.isPending ? "Wait..." : "Verify"}
                      </button>
                    )}
                  </td>
                  <td className="py-5 px-4 text-right">
                    <StatusBadge status={app.status || "Pending"} />
                  </td>
                </tr>
              ))}
              {(!applications || applications.length === 0) && (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="bg-slate-50 rounded-3xl p-10 max-w-sm mx-auto border-2 border-dashed border-slate-200">
                      <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-6" />
                      <p className="text-slate-900 font-bold text-xl mb-2">No applications found.</p>
                      <p className="text-slate-500 text-sm">When tutors apply for vacancies, they will appear here for your review.</p>
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
