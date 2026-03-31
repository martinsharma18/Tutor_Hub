import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  GraduationCap, User, Mail, Lock, Phone, BookOpen,
  MapPin, Clock, DollarSign, FileText, Upload, CheckCircle,
  ChevronRight, ChevronLeft, Briefcase, Star, X
} from "lucide-react";
import { authApi } from "../../features/auth/api";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/authSlice";

const schema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().min(7, "Phone number is required"),
  qualification: z.string().min(3, "Qualification is required"),
  university: z.string().optional(),
  graduationYear: z.string().optional(),
  yearsOfExperience: z.number({ invalid_type_error: "Enter a number" }).min(0),
  experienceSummary: z.string().min(10, "Experience summary is required"),
  subjects: z.string().min(2, "At least one subject is required"),
  classes: z.string().min(2, "At least one class level is required"),
  preferredMode: z.string().min(2, "Select a teaching mode"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  city: z.string().min(2, "City is required"),
  area: z.string().min(2, "Area is required"),
  hourlyRate: z.number().optional(),
  gender: z.string().optional(),
  nationalId: z.string().optional(),
});

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Qualifications", icon: GraduationCap },
  { id: 3, title: "Teaching Details", icon: BookOpen },
  { id: 4, title: "Location & Rate", icon: MapPin },
  { id: 5, title: "CV & Bio", icon: FileText },
];

const RegisterTeacherPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [cvBase64, setCvBase64] = useState(null);
  const [cvError, setCvError] = useState("");
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const mutation = useMutation({
    mutationFn: authApi.registerTeacher,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate("/teacher");
    },
  });

  const stepFields = {
    1: ["fullName", "email", "password", "phoneNumber", "gender"],
    2: ["qualification", "university", "graduationYear", "yearsOfExperience", "experienceSummary"],
    3: ["subjects", "classes", "preferredMode"],
    4: ["city", "area", "hourlyRate"],
    5: ["bio"],
  };

  const handleNext = async () => {
    const valid = await trigger(stepFields[currentStep]);
    if (valid) setCurrentStep((s) => Math.min(s + 1, steps.length));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      setCvError("Only PDF or Word (.doc/.docx) files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("File size must be under 5MB.");
      return;
    }
    setCvError("");
    setCvFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCvBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = (values) => {
    mutation.mutate({ ...values, cvUrl: cvBase64 || null });
  };

  const inputClass = (error) =>
    `w-full px-4 py-3 rounded-xl border-2 outline-none transition-all ${
      error
        ? "border-red-400 focus:border-red-500 bg-red-50"
        : "border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
    } text-slate-800 placeholder-slate-400`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <div className="py-6 px-6 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <div className="p-1.5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          TuitionHub
        </Link>
        <p className="text-sm text-slate-500">
          Already a member?{" "}
          <Link to="/login" className="text-orange-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Create Your <span className="text-orange-500">Teacher Profile</span>
            </h1>
            <p className="text-slate-500">Fill in your details to get discovered by parents and students.</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 -z-10">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted ? "bg-orange-500 border-orange-500 text-white" :
                    isActive ? "bg-white border-orange-500 text-orange-500 shadow-lg shadow-orange-100" :
                    "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={`text-xs font-semibold hidden md:block ${isActive ? "text-orange-600" : "text-slate-400"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-10">

              {/* ── Step 1: Personal Info ── */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-orange-500" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                      <input {...register("fullName")} placeholder="e.g. Ramesh Sharma" className={inputClass(errors.fullName)} />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                      <select {...register("gender")} className={inputClass(errors.gender)}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="PreferNotToSay">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                      <input {...register("email")} type="email" placeholder="you@email.com" className={inputClass(errors.email)} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                      <input {...register("phoneNumber")} placeholder="+977 98XXXXXXXX" className={inputClass(errors.phoneNumber)} />
                      {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Create Password *</label>
                      <input {...register("password")} type="password" placeholder="At least 8 characters" className={inputClass(errors.password)} />
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Qualifications ── */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-orange-500" /> Academic Qualifications
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Highest Qualification *</label>
                      <select {...register("qualification")} className={inputClass(errors.qualification)}>
                        <option value="">Select qualification</option>
                        <option value="SLC/SEE">SLC / SEE</option>
                        <option value="+2/Intermediate">+2 / Intermediate</option>
                        <option value="Bachelor">Bachelor's Degree</option>
                        <option value="Master">Master's Degree</option>
                        <option value="MPhil">MPhil</option>
                        <option value="PhD">PhD</option>
                        <option value="Diploma">Diploma / Certificate</option>
                      </select>
                      {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">University / Institution</label>
                      <input {...register("university")} placeholder="e.g. Tribhuvan University" className={inputClass(errors.university)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduation Year</label>
                      <input {...register("graduationYear")} placeholder="e.g. 2020" className={inputClass(errors.graduationYear)} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Years of Experience *</label>
                      <input
                        {...register("yearsOfExperience", { valueAsNumber: true })}
                        type="number" min="0" placeholder="e.g. 3"
                        className={inputClass(errors.yearsOfExperience)}
                      />
                      {errors.yearsOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Experience Summary *</label>
                      <textarea
                        {...register("experienceSummary")}
                        rows={4}
                        placeholder="Describe your teaching experience, previous roles, achievements..."
                        className={inputClass(errors.experienceSummary)}
                      />
                      {errors.experienceSummary && <p className="text-red-500 text-xs mt-1">{errors.experienceSummary.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Teaching Details ── */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-500" /> Teaching Details
                  </h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subjects You Teach *</label>
                      <input
                        {...register("subjects")}
                        placeholder="e.g. Mathematics, Physics, Chemistry (comma separated)"
                        className={inputClass(errors.subjects)}
                      />
                      <p className="text-xs text-slate-400 mt-1">Separate multiple subjects with commas</p>
                      {errors.subjects && <p className="text-red-500 text-xs mt-1">{errors.subjects.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class Levels You Teach *</label>
                      <input
                        {...register("classes")}
                        placeholder="e.g. Grade 9, Grade 10, +2 Science (comma separated)"
                        className={inputClass(errors.classes)}
                      />
                      <p className="text-xs text-slate-400 mt-1">Specify grades or levels you are comfortable teaching</p>
                      {errors.classes && <p className="text-red-500 text-xs mt-1">{errors.classes.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Preferred Teaching Mode *</label>
                      <div className="grid grid-cols-3 gap-4">
                        {["Online", "Offline", "Hybrid"].map((mode) => (
                          <label key={mode} className="relative cursor-pointer">
                            <input {...register("preferredMode")} type="radio" value={mode} className="sr-only peer" />
                            <div className="p-4 rounded-xl border-2 border-slate-200 text-center peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 hover:border-orange-300 transition-all font-semibold text-slate-600">
                              {mode === "Online" && <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />}
                              {mode === "Offline" && <MapPin className="h-6 w-6 mx-auto mb-1 text-green-500" />}
                              {mode === "Hybrid" && <Star className="h-6 w-6 mx-auto mb-1 text-orange-500" />}
                              {mode}
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.preferredMode && <p className="text-red-500 text-xs mt-1">{errors.preferredMode.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: Location & Rate ── */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" /> Location & Rate
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">City *</label>
                      <input {...register("city")} placeholder="e.g. Kathmandu" className={inputClass(errors.city)} />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Area / Locality *</label>
                      <input {...register("area")} placeholder="e.g. Lalitpur, Baneshwor" className={inputClass(errors.area)} />
                      {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        Expected Hourly Rate <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
                        <input
                          {...register("hourlyRate", {
                            setValueAs: (v) => (v === "" ? undefined : Number(v)),
                          })}
                          type="number" min="0"
                          placeholder="e.g. 500 (NPR per hour)"
                          className={`${inputClass(errors.hourlyRate)} pl-12`}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Leave blank if you prefer to negotiate with parents</p>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex gap-3">
                    <Briefcase className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-800">Your profile will be reviewed</p>
                      <p className="text-sm text-orange-700 mt-0.5">After registration, our team will verify your details before showing your profile to parents.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 5: CV & Bio ── */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-500" /> Your Bio & CV
                  </h2>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Professional Bio *</label>
                    <textarea
                      {...register("bio")}
                      rows={5}
                      placeholder="Write a compelling bio about yourself. Tell parents and students who you are, your teaching philosophy, and why they should choose you..."
                      className={inputClass(errors.bio)}
                    />
                    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
                    <p className="text-xs text-slate-400 mt-1">This appears publicly on your profile. Minimum 20 characters.</p>
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Upload CV / Resume{" "}
                      <span className="text-slate-400 font-normal">(PDF or Word — max 5MB)</span>
                    </label>

                    {cvFile ? (
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border-2 border-green-300">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-green-800 truncate">{cvFile.name}</p>
                          <p className="text-sm text-green-600">{(cvFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setCvFile(null); setCvBase64(null); }}
                          className="p-2 rounded-lg hover:bg-green-200 text-green-700 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50 transition-all group"
                      >
                        <Upload className="h-10 w-10 text-slate-400 group-hover:text-orange-500 mx-auto mb-3 transition-colors" />
                        <p className="font-semibold text-slate-600 group-hover:text-orange-700">Click to upload your CV</p>
                        <p className="text-sm text-slate-400 mt-1">PDF, DOC, or DOCX accepted</p>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {cvError && <p className="text-red-500 text-xs mt-1">{cvError}</p>}
                  </div>

                  {/* Error */}
                  {mutation.isError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                      Registration failed. Please check your details and try again.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Create My Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Step {currentStep} of {steps.length} — By registering, you agree to our{" "}
            <Link to="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterTeacherPage;
