import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import SectionCard from "../../components/ui/SectionCard";
import PageHeader from "../../components/ui/PageHeader";
import { adminApi } from "../../features/admin/api";
import { UserCheck, CheckCircle2, XCircle, Eye } from "lucide-react";

const TeacherApprovalPage = () => {
  const queryClient = useQueryClient();
  const [showOnlyPending, setShowOnlyPending] = useState(true);

  const { data: teachersData, isLoading } = useQuery({
    queryKey: ["admin-teachers-list"],
    queryFn: adminApi.getTeachers,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["admin-teachers-list"] });
  };

  const approveMutation = useMutation({
    mutationFn: (id) => adminApi.approveTeacher(id),
    onSuccess: () => { invalidate(); toast.success("Teacher approved."); },
    onError: () => toast.error("Could not approve teacher."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.removeTeacher(id),
    onSuccess: () => { invalidate(); toast.success("Teacher profile deleted."); },
    onError: () => toast.error("Could not delete teacher."),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner text-primary-600" />
      </div>
    );
  }

  const allTeachers = Array.isArray(teachersData) ? teachersData : (teachersData?.items ?? []);
  const pendingTeachers = allTeachers.filter((t) => !t.isApproved);
  const displayedTeachers = showOnlyPending ? pendingTeachers : allTeachers;

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader
        title="Teacher Management"
        subtitle="Review, approve, and manage teacher profiles"
        icon={UserCheck}
        actions={
          <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-white text-sm font-medium">
            <button
              onClick={() => setShowOnlyPending(true)}
              className={`px-4 py-2 transition-colors ${
                showOnlyPending
                  ? "bg-primary-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Pending ({pendingTeachers.length})
            </button>
            <button
              onClick={() => setShowOnlyPending(false)}
              className={`px-4 py-2 transition-colors border-l border-slate-200 ${
                !showOnlyPending
                  ? "bg-primary-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              All ({allTeachers.length})
            </button>
          </div>
        }
      />

      <SectionCard
        title={showOnlyPending ? `Pending Approvals` : `All Teachers`}
        subtitle={`${displayedTeachers.length} ${showOnlyPending ? "awaiting review" : "total"}`}
        noPadding
      >
        {displayedTeachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                  <th>Subjects</th>
                  <th>Rate</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    {/* Teacher info */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {teacher.fullName?.charAt(0) ?? "T"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{teacher.fullName}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">{teacher.bio}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{teacher.qualification}</td>
                    <td className="text-sm">{teacher.yearsOfExperience} yrs</td>
                    <td className="text-sm max-w-[130px] truncate" title={teacher.subjects}>{teacher.subjects}</td>
                    <td className="text-sm font-medium">${teacher.hourlyRate}/hr</td>
                    <td>
                      {teacher.isApproved ? (
                        <span className="badge-green">Approved</span>
                      ) : (
                        <span className="badge-amber">Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/teachers/${teacher.id}`}
                          className="btn text-xs px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>

                        {!teacher.isApproved && (
                          <button
                            onClick={() => approveMutation.mutate(teacher.id)}
                            disabled={approveMutation.isPending}
                            className="btn-success text-xs px-2.5 py-1.5 rounded-lg"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm("Delete this teacher profile?")) {
                              deleteMutation.mutate(teacher.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="btn-danger text-xs px-2.5 py-1.5 rounded-lg"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state p-10">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <p className="font-semibold text-slate-700">
              {showOnlyPending ? "All teachers approved!" : "No teachers found"}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {showOnlyPending
                ? "All registered teachers have been reviewed."
                : "No teachers have registered yet."}
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default TeacherApprovalPage;
