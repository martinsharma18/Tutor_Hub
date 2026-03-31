import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, GraduationCap, BookOpen, MapPin, Clock, DollarSign,
  FileText, Edit3, Save, X, CheckCircle, AlertCircle, Star,
  Phone, Mail, Calendar, Briefcase, Upload
} from "lucide-react";
import { teacherApi } from "../../features/teachers/api";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/authSlice";

const schema = z.object({
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  qualification: z.string().min(2),
  university: z.string().optional(),
  graduationYear: z.string().optional(),
  yearsOfExperience: z.number().min(0),
  experienceSummary: z.string().min(10),
  subjects: z.string().min(2),
  classes: z.string().min(2),
  preferredMode: z.string().min(2),
  city: z.string().min(2),
  area: z.string().min(2),
  hourlyRate: z.number().optional(),
});

const InfoChip = ({ label, value, icon: Icon, color = "orange" }) => {
  if (!value) return null;
  const colors = {
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${colors[color]} text-sm font-medium`}>
      {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
      <span className="text-xs text-current opacity-70">{label}:</span>
      <span>{value}</span>
    </div>
  );
};

const TeacherProfilePage = () => {
  const user = useAppSelector(selectCurrentUser);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["teacher-profile"],
    queryFn: teacherApi.me,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    values: profile ? {
      bio: profile.bio,
      qualification: profile.qualification,
      university: profile.university || "",
      graduationYear: profile.graduationYear || "",
      yearsOfExperience: profile.yearsOfExperience,
      experienceSummary: profile.experienceSummary,
      subjects: profile.subjects,
      classes: profile.classes,
      preferredMode: profile.preferredMode,
      city: profile.city,
      area: profile.area,
      hourlyRate: profile.hourlyRate,
    } : {},
  });

  const updateMutation = useMutation({
    mutationFn: teacherApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
      setIsEditing(false);
    },
  });

  const inputClass = (error) =>
    `w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-slate-800 placeholder-slate-400 ${
      error
        ? "border-red-400 focus:border-red-500 bg-red-50"
        : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
    }`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  const subjectList = profile?.subjects?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const classesList = profile?.classes?.split(",").map((s) => s.trim()).filter(Boolean) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* ── Profile Header Card ── */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold shadow-lg border-2 border-white/30 flex-shrink-0">
            {user?.fullName?.charAt(0)?.toUpperCase() || "T"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{user?.fullName}</h1>
              {profile?.isApproved ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-green-500 rounded-full text-xs font-bold">
                  <CheckCircle className="h-3.5 w-3.5" /> Approved
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-bold">
                  <AlertCircle className="h-3.5 w-3.5" /> Pending Review
                </span>
              )}
              {profile?.isFeatured && (
                <span className="flex items-center gap-1 px-3 py-1 bg-blue-500 rounded-full text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-white" /> Featured
                </span>
              )}
            </div>
            <p className="text-orange-100 mb-3">{profile?.qualification}{profile?.university ? ` · ${profile.university}` : ""}</p>
            <div className="flex flex-wrap gap-3 text-sm text-orange-100">
              {user?.email && (
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{user.email}</span>
              )}
              {user?.phoneNumber && (
                <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{user.phoneNumber}</span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />{profile?.city}{profile?.area ? `, ${profile.area}` : ""}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all shadow-md"
          >
            {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Experience", value: `${profile?.yearsOfExperience || 0} yrs`, icon: Briefcase, color: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Hourly Rate", value: profile?.hourlyRate ? `NPR ${profile.hourlyRate}` : "Negotiable", icon: DollarSign, color: "bg-green-50 text-green-700 border-green-200" },
          { label: "Mode", value: profile?.preferredMode || "—", icon: Clock, color: "bg-purple-50 text-purple-700 border-purple-200" },
          { label: "Subjects", value: `${subjectList.length} subject${subjectList.length !== 1 ? "s" : ""}`, icon: BookOpen, color: "bg-orange-50 text-orange-700 border-orange-200" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.color}`}>
            <s.icon className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="text-xs opacity-70">{s.label}</p>
              <p className="font-bold text-sm">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── View Mode ── */}
      {!isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-orange-500" /> About Me
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile?.bio || "No bio added yet."}</p>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-500" /> Experience Summary
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{profile?.experienceSummary || "Not provided."}</p>
            </div>

            {/* Subjects & Classes */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" /> Subjects & Classes
              </h2>
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-500 mb-2">Subjects</p>
                <div className="flex flex-wrap gap-2">
                  {subjectList.length > 0 ? subjectList.map((s) => (
                    <span key={s} className="px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-200 rounded-xl text-sm font-medium">{s}</span>
                  )) : <span className="text-slate-400 text-sm">—</span>}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-2">Class Levels</p>
                <div className="flex flex-wrap gap-2">
                  {classesList.length > 0 ? classesList.map((c) => (
                    <span key={c} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-medium">{c}</span>
                  )) : <span className="text-slate-400 text-sm">—</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Qualifications Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-orange-500" /> Qualifications
              </h2>
              <div className="space-y-3">
                <InfoChip icon={GraduationCap} label="Degree" value={profile?.qualification} color="orange" />
                <InfoChip icon={BookOpen} label="Institution" value={profile?.university} color="blue" />
                <InfoChip icon={Calendar} label="Year" value={profile?.graduationYear} color="purple" />
                <InfoChip icon={Briefcase} label="Experience" value={profile?.yearsOfExperience != null ? `${profile.yearsOfExperience} years` : null} color="green" />
              </div>
            </div>

            {/* CV Download */}
            {profile?.cvUrl && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-500" /> Curriculum Vitae
                </h2>
                <a
                  href={profile.cvUrl}
                  download="CV.pdf"
                  className="flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-xl hover:bg-orange-100 transition-all group"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-800">Download CV</p>
                    <p className="text-sm text-orange-600">Click to view / download</p>
                  </div>
                </a>
              </div>
            )}

            {/* Pending Approval Notice */}
            {!profile?.isApproved && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800">Profile Under Review</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Your profile is being reviewed by our team. You will be notified once approved and visible to parents.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Edit Mode ── */
        <form onSubmit={handleSubmit((values) => updateMutation.mutate(values))}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 space-y-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-orange-500" /> Edit Your Profile
            </h2>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Professional Bio *</label>
              <textarea {...register("bio")} rows={4} className={inputClass(errors.bio)} placeholder="Tell parents about yourself..." />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>

            {/* Qualification */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Qualification *</label>
                <input {...register("qualification")} className={inputClass(errors.qualification)} placeholder="e.g. Master's Degree" />
                {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">University</label>
                <input {...register("university")} className={inputClass()} placeholder="e.g. Tribhuvan University" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                <input {...register("graduationYear")} className={inputClass()} placeholder="e.g. 2020" />
              </div>
            </div>

            {/* Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Years of Experience *</label>
                <input {...register("yearsOfExperience", { valueAsNumber: true })} type="number" min="0" className={inputClass(errors.yearsOfExperience)} />
                {errors.yearsOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Mode *</label>
                <select {...register("preferredMode")} className={inputClass(errors.preferredMode)}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience Summary *</label>
              <textarea {...register("experienceSummary")} rows={3} className={inputClass(errors.experienceSummary)} placeholder="Describe your teaching experience..." />
              {errors.experienceSummary && <p className="text-red-500 text-xs mt-1">{errors.experienceSummary.message}</p>}
            </div>

            {/* Subjects & Classes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subjects (comma separated) *</label>
                <input {...register("subjects")} className={inputClass(errors.subjects)} placeholder="Math, Physics, Chemistry" />
                {errors.subjects && <p className="text-red-500 text-xs mt-1">{errors.subjects.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Levels (comma separated) *</label>
                <input {...register("classes")} className={inputClass(errors.classes)} placeholder="Grade 9, Grade 10, +2" />
                {errors.classes && <p className="text-red-500 text-xs mt-1">{errors.classes.message}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">City *</label>
                <input {...register("city")} className={inputClass(errors.city)} placeholder="e.g. Kathmandu" />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Area *</label>
                <input {...register("area")} className={inputClass(errors.area)} placeholder="e.g. Baneshwor" />
                {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Hourly Rate (NPR)</label>
                <input
                  {...register("hourlyRate", { setValueAs: (v) => v === "" ? undefined : Number(v) })}
                  type="number" min="0"
                  className={inputClass()}
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            {/* Error */}
            {updateMutation.isError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                Failed to update profile. Please try again.
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsEditing(false); reset(); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
              >
                <X className="h-4 w-4" /> Discard Changes
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                {updateMutation.isPending ? (
                  <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeacherProfilePage;
