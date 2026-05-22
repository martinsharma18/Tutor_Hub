import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const stats = [
  { label: "Tutor-focused workflows", value: "100%" },
  { label: "Core teaching modes", value: "3" },
  { label: "Admin review pipeline", value: "24/7" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Verified Opportunities",
    description: "Vacancies move through an admin review flow before teachers spend time applying.",
  },
  {
    icon: Users,
    title: "Built for Teachers",
    description: "Profiles, applications, messages, demos, and payments live in one focused workspace.",
  },
  {
    icon: MapPin,
    title: "Local Discovery",
    description: "City, area, subject, class, and teaching-mode filters help match tutors with relevant posts.",
  },
];

const steps = [
  "Parents or admins publish tuition requirements",
  "Teachers discover matching opportunities",
  "Applications and demo requests move through one dashboard",
  "Admins monitor approvals, users, posts, and platform settings",
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24">
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-orange-50 via-white to-slate-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
                  <GraduationCap className="h-4 w-4" />
                  About Best Tuitions
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                  A focused platform for tuition opportunities.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">
                  Best Tuitions connects qualified teachers with verified tuition vacancies, keeping discovery,
                  applications, demo requests, messaging, and payment tracking in one practical workspace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <Link
                    to="/vacancies"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                  >
                    Find Vacancies <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/register/teacher"
                    className="inline-flex items-center justify-center px-7 py-4 border-2 border-orange-200 text-orange-700 font-bold rounded-xl hover:bg-orange-50"
                  >
                    Join as Teacher
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-orange-100 rounded-3xl shadow-xl p-8">
                <div className="grid grid-cols-1 gap-5">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl">
                      <span className="text-slate-600 font-semibold">{stat.label}</span>
                      <span className="text-3xl font-black text-orange-600">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
                What We Prioritize
              </h2>
              <p className="text-lg text-slate-600 font-medium">
                Clear matching, useful controls, and fewer scattered conversations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-white rounded-2xl border border-slate-100 p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-[#fdfcfb]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-5">
                  <BookOpen className="h-4 w-4" />
                  How it works
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  Simple enough for daily use, structured enough for growth.
                </h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">
                  The platform is organized around the work teachers and admins repeat most often:
                  finding relevant posts, applying, scheduling demos, and keeping records clear.
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step} className="flex gap-4 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                    <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-orange-500 shrink-0" />
                      <p className="font-semibold text-slate-700">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
