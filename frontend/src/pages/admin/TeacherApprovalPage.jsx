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
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Teacher Management</h1>
        </div>
        <p className="text-emerald-100">Review, approve, and manage teacher profiles</p>
      </div>

      <div className="flex justify-end gap-2 px-1">
        <button
          onClick={() => setShowOnlyPending(true)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            showOnlyPending ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          Pending Only ({pendingTeachers.length})
        </button>
        <button
          onClick={() => setShowOnlyPending(false)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            !showOnlyPending ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          All Teachers ({allTeachers.length})
        </button>
      </div>

      <SectionCard title={showOnlyPending ? `Pending Approvals (${pendingTeachers.length})` : `All Teachers (${allTeachers.length})`}>
        {displayedTeachers.length > 0 ? (
          <div className="space-y-4">
            {displayedTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all duration-300 ${
                  teacher.isApproved ? 'border-slate-100' : 'border-emerald-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{teacher.fullName}</h3>
                    <p className="text-slate-600 mb-4">{teacher.bio}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-slate-700">Qualification:</span>
                        <span className="text-slate-600 ml-2">{teacher.qualification}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Experience:</span>
                        <span className="text-slate-600 ml-2">{teacher.yearsOfExperience} years</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Subjects:</span>
                        <span className="text-slate-600 ml-2">{teacher.subjects}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Rate:</span>
                        <span className="text-slate-600 ml-2">${teacher.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Link
                      to={`/admin/teachers/${teacher.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      <Eye className="h-5 w-5" />
                      View Profile
                    </Link>
                    {!teacher.isApproved && (
                      <button
                        onClick={() => approveMutation.mutate(teacher.id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg disabled:opacity-60 transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this teacher profile?")) {
                          deleteMutation.mutate(teacher.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 disabled:opacity-60 transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      <XCircle className="h-5 w-5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-green-50 rounded-xl border-2 border-green-200">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-green-700">No teachers found!</p>
            <p className="text-sm text-green-600 mt-2">{showOnlyPending ? 'All registered teachers have been approved.' : 'No teachers have registered yet.'}</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default TeacherApprovalPage;



