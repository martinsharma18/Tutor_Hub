import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import SectionCard from "../../components/ui/SectionCard";
import { adminApi } from "../../features/admin/api";
import { UserCheck, CheckCircle2, XCircle, Eye } from "lucide-react";

const TeacherApprovalPage = () => {
  const queryClient = useQueryClient();

  const { data: searchData, isLoading } = useQuery({
    queryKey: ["admin-teachers-list"],
    queryFn: () => fetch("/api/search/teachers").then(res => res.json()),
  });

  const [showOnlyPending, setShowOnlyPending] = useState(true);

  const approveMutation = useMutation({
    mutationFn: (teacherProfileId) => adminApi.approveTeacher(teacherProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard", "admin-teachers-list"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (teacherProfileId) => adminApi.removeTeacher(teacherProfileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard", "admin-teachers-list"] });
    },
  });

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Loading teachers...</div>;
  }

  const allTeachers = searchData?.items || [];
  const pendingTeachers = allTeachers.filter(t => !t.isApproved);
  const displayedTeachers = showOnlyPending ? pendingTeachers : allTeachers;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Teacher Management</h1>
          </div>
          <p className="text-orange-100">Review, approve, and manage teacher profiles</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 px-1">
        <button
          onClick={() => setShowOnlyPending(true)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            showOnlyPending ? 'bg-gradient-to-r from-orange-600 to-orange-800 text-white shadow-md' : 'glass text-orange-700 hover:bg-white/40'
          }`}
        >
          Pending Only ({pendingTeachers.length})
        </button>
        <button
          onClick={() => setShowOnlyPending(false)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            !showOnlyPending ? 'bg-gradient-to-r from-orange-600 to-orange-800 text-white shadow-md' : 'glass text-orange-700 hover:bg-white/40'
          }`}
        >
          All Teachers ({allTeachers.length})
        </button>
      </div>

      <SectionCard title={showOnlyPending ? `Pending Approvals (${pendingTeachers.length})` : `All Teachers (${allTeachers.length})`}>
        {displayedTeachers.length > 0 ? (
          <div className="overflow-x-auto glass rounded-2xl shadow-xl border border-white/50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-50/50 border-b-2 border-orange-200">
                  <th className="p-4 font-bold text-slate-800">Teacher</th>
                  <th className="p-4 font-bold text-slate-800">Qualification</th>
                  <th className="p-4 font-bold text-slate-800">Experience</th>
                  <th className="p-4 font-bold text-slate-800">Subjects</th>
                  <th className="p-4 font-bold text-slate-800">Rate</th>
                  <th className="p-4 font-bold text-slate-800 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100/50">
                {displayedTeachers.map((teacher) => (
                  <tr key={teacher.id} className={`hover:bg-white/50 transition-colors ${teacher.isApproved ? '' : 'bg-orange-50/30'}`}>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{teacher.fullName}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">{teacher.bio}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{teacher.qualification}</td>
                    <td className="p-4 text-slate-600 font-medium">{teacher.yearsOfExperience} yrs</td>
                    <td className="p-4 text-slate-600 font-medium max-w-[150px] truncate" title={teacher.subjects}>{teacher.subjects}</td>
                    <td className="p-4 text-slate-600 font-medium">${teacher.hourlyRate}/hr</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/teachers/${teacher.id}`}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-all text-sm"
                        >
                          <Eye className="h-4 w-4" /> View
                        </Link>
                        {!teacher.isApproved && (
                          <button
                            onClick={() => approveMutation.mutate(teacher.id)}
                            disabled={approveMutation.isPending}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-orange-800 text-white font-semibold hover:shadow-lg disabled:opacity-60 transition-all transform hover:scale-105 active:scale-95 text-sm"
                          >
                            <CheckCircle2 className="h-4 w-4" /> Approve
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this teacher profile?")) {
                              deleteMutation.mutate(teacher.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-60 transition-all transform hover:scale-105 active:scale-95 text-sm"
                        >
                          <XCircle className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 glass rounded-xl border-2 border-orange-200">
            <CheckCircle2 className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-orange-700">No teachers found!</p>
            <p className="text-sm text-orange-600 mt-2">{showOnlyPending ? 'All registered teachers have been approved.' : 'No teachers have registered yet.'}</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default TeacherApprovalPage;



