import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { adminApi } from "../../features/admin/api";
import SectionCard from "../../components/ui/SectionCard";
import { User, MapPin, BookOpen, Clock, ArrowLeft, Star, FileText } from "lucide-react";

const AdminTeacherDetailsPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-teacher-details", id],
    queryFn: () => adminApi.getTeacherDetails(id),
  });

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-600">Failed to load teacher details.</p>
        <Link to="/admin/teachers" className="text-brand-600 hover:underline mt-4 inline-block">
          Back to Teachers
        </Link>
      </div>
    );
  }

  const { profile, applications } = data;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <Link to="/admin/teachers" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 transition">
        <ArrowLeft className="h-4 w-4" />
        Back to teacher list
      </Link>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <User className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-inner flex items-center justify-center shrink-0">
            <span className="text-5xl font-bold text-white tracking-widest">
              {profile.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">{profile.fullName}</h1>
                <p className="text-slate-300 text-xl font-medium mt-2">{profile.qualification}</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm self-start">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-lg">${profile.hourlyRate}/hr</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-slate-300 bg-white/5 py-1.5 px-4 rounded-full">
                <MapPin className="h-4 w-4 text-orange-400" />
                <span>{profile.city}, {profile.area}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 bg-white/5 py-1.5 px-4 rounded-full">
                <BookOpen className="h-4 w-4 text-orange-400" />
                <span>{profile.subjects}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 bg-white/5 py-1.5 px-4 rounded-full">
                <Clock className="h-4 w-4 text-orange-400" />
                <span>{profile.yearsOfExperience} Years Exp.</span>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile.isApproved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                {profile.isApproved ? 'Approved' : 'Pending Approval'}
              </span>
              {profile.isFeatured && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <SectionCard title="About & Experience" className="border-t-4 border-t-orange-500">
            <h3 className="font-semibold text-slate-900 mb-2">Teaching Classes</h3>
            <p className="text-slate-700 bg-slate-50 p-4 rounded-xl mb-6">{profile.classes}</p>
            
            <h3 className="font-semibold text-slate-900 mb-2">Experience Summary</h3>
            <p className="text-slate-700 whitespace-pre-line bg-slate-50 p-4 rounded-xl leading-relaxed">
              {profile.experienceSummary || "No detailed summary provided."}
            </p>
          </SectionCard>
          
          <SectionCard title={`Application History (${applications.length})`} className="border-t-4 border-t-blue-500">
             {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col md:flex-row gap-4 items-start justify-between hover:shadow-md transition">
                       <div>
                         <p className="font-semibold text-slate-900 flex items-center gap-2">
                           <FileText className="w-4 h-4 text-blue-500"/>
                           Applied on {new Date(app.appliedAtUtc).toLocaleDateString()}
                         </p>
                         <p className="text-sm text-slate-600 mt-2 line-clamp-2">{app.coverLetter || "No cover letter provided."}</p>
                       </div>
                       <div className="shrink-0 flex flex-col items-end gap-2">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Accepted' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {app.status}
                         </span>
                         <span className="text-sm text-slate-500">Tuition Post ID: {app.tuitionPostId.substring(0, 8)}...</span>
                       </div>
                    </div>
                  ))}
                </div>
             ) : (
                <p className="text-slate-500 text-center py-6">No tuition applications made yet.</p>
             )}
          </SectionCard>
        </div>
        
        <div className="space-y-6">
          <SectionCard title="Quick Info" className="border-t-4 border-t-emerald-500">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold">{profile.isApproved ? "Active" : "Pending"}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Preferred Mode</span>
                <span className="font-semibold">{profile.preferredMode || "Any"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Joined</span>
                <span className="font-semibold">Recently</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherDetailsPage;
