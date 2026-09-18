import { Fragment, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../features/admin/api";
import { adminPlacementsApi } from "../../features/placements/api";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import LookupSelect from "../../components/forms/LookupSelect";
import { Briefcase, Calendar, CreditCard, CheckCircle, MessageSquare, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";

const statusStyles = {
  Pending:     "badge-amber",
  Shortlisted: "badge-blue",
  Hired:       "badge-green",
  Rejected:    "badge-red",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const AdminApplicationsPage = () => {
  const queryClient = useQueryClient();
  const [placementFor, setPlacementFor] = useState(null);
  const [placementForm, setPlacementForm] = useState({ mode: "", schedule: "", monthlyFee: "", startDate: todayIso() });

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

  const createPlacementMutation = useMutation({
    mutationFn: ({ applicationId, payload }) =>
      adminPlacementsApi.create({ teacherApplicationId: applicationId, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-applications"] });
      queryClient.invalidateQueries({ queryKey: ["admin-placements"] });
      setPlacementFor(null);
      setPlacementForm({ mode: "", schedule: "", monthlyFee: "", startDate: todayIso() });
      toast.success("Placement created — billing starts now.");
    },
    onError: (e) => toast.error(e.response?.data?.detail ?? "Could not create the placement."),
  });

  const handleCreatePlacement = (applicationId) => {
    createPlacementMutation.mutate({
      applicationId,
      payload: {
        mode: placementForm.mode,
        schedule: placementForm.schedule,
        monthlyFee: Number(placementForm.monthlyFee),
        startDate: placementForm.startDate,
      },
    });
  };

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
                <th className="text-right">Placement</th>
              </tr>
            </thead>
            <tbody>
              {applications?.map((app) => {
                const canPlace = app.status === "Hired" && !app.hasPlacement;
                return (
                <Fragment key={app.id}>
                <tr>
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
                    <p className="text-xs text-slate-400">
                      {app.tuitionPost?.classLevel}
                      {app.tuitionPost?.city ? ` · ${app.tuitionPost.city}` : ""}
                    </p>
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

                  {/* Placement */}
                  <td className="text-right">
                    {!canPlace ? (
                      app.status === "Hired" ? (
                        <span className="text-xs text-slate-400">Placed</span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )
                    ) : (
                      <button
                        onClick={() => setPlacementFor(placementFor === app.id ? null : app.id)}
                        className="btn text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        {placementFor === app.id ? "Cancel" : "Create Placement"}
                      </button>
                    )}
                  </td>
                </tr>

                {placementFor === app.id && (
                  <tr>
                    <td colSpan={6} className="bg-slate-50">
                      <div className="flex flex-wrap items-end gap-3 py-3">
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                          Mode
                          <LookupSelect
                            category="TeachingMode"
                            value={placementForm.mode}
                            onChange={(e) => setPlacementForm((f) => ({ ...f, mode: e.target.value }))}
                            placeholder="Select…"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                          Schedule
                          <input
                            type="text"
                            placeholder="e.g. Mon/Wed/Fri 5-6pm"
                            value={placementForm.schedule}
                            onChange={(e) => setPlacementForm((f) => ({ ...f, schedule: e.target.value }))}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                          Monthly fee
                          <input
                            type="number"
                            min="1"
                            value={placementForm.monthlyFee}
                            onChange={(e) => setPlacementForm((f) => ({ ...f, monthlyFee: e.target.value }))}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-28"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
                          Start date
                          <input
                            type="date"
                            value={placementForm.startDate}
                            onChange={(e) => setPlacementForm((f) => ({ ...f, startDate: e.target.value }))}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          />
                        </label>
                        <button
                          onClick={() => handleCreatePlacement(app.id)}
                          disabled={
                            createPlacementMutation.isPending ||
                            !placementForm.mode ||
                            !placementForm.schedule ||
                            !placementForm.monthlyFee
                          }
                          className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
                        >
                          {createPlacementMutation.isPending ? "Creating…" : "Confirm & start billing"}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
                );
              })}

              {(!applications || applications.length === 0) && (
                <tr>
                  <td colSpan={7}>
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
