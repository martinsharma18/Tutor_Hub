import { Link } from "react-router-dom";
import { GraduationCap, Users } from "lucide-react";
import usePageMeta from "../../hooks/usePageMeta";

const RegisterChoicePage = () => {
  usePageMeta({
    title: "Create an Account",
    description: "Join Best Tuitions as a parent looking for a tutor, or as a teacher looking for tuition work.",
  });

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 w-fit mx-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-slate-900 text-lg font-bold tracking-tight">Best Tuitions</span>
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Create your account</h1>
        <p className="text-sm text-slate-500 text-center mb-8">Sign up as a parent or a teacher.</p>

        <div className="space-y-3">
          <Link
            to="/register/parent"
            className="flex items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-4 transition-colors hover:border-orange-400 hover:bg-orange-50/40"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Users className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-slate-900">Parent / Student</span>
              <span className="block text-sm text-slate-500">Find a tutor</span>
            </span>
          </Link>

          <Link
            to="/register/teacher"
            className="flex items-center gap-4 rounded-xl border-2 border-slate-200 bg-white p-4 transition-colors hover:border-orange-400 hover:bg-orange-50/40"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-slate-900">Teacher</span>
              <span className="block text-sm text-slate-500">Find tuition work</span>
            </span>
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterChoicePage;
