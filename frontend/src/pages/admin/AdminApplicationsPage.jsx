import { useQuery } from "@tanstack/react-query";
import { adminApi } from "../../features/admin/api";
import SectionCard from "../../components/ui/SectionCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { Briefcase, User, Calendar, MessageSquare } from "lucide-react";

const AdminApplicationsPage = () => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: adminApi.getApplications,
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
                <th className="py-5 px-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Message</th>
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
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm italic group relative">
                      <MessageSquare className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="max-w-[200px] truncate block">"{app.message || "No specific message."}"</span>
                      {app.message && app.message.length > 30 && (
                        <div className="absolute bottom-full left-0 mb-2 p-3 bg-slate-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 w-64 shadow-xl">
                          {app.message}
                          <div className="absolute top-full left-4 border-8 border-transparent border-t-slate-800"></div>
                        </div>
                      )}
                    </div>
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
