import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "support@tuitionhub.com",
    detail: "For account, vacancy, and platform questions",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+977 9800000000",
    detail: "For urgent tuition coordination",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kathmandu, Nepal",
    detail: "Serving tutors and families across major areas",
  },
];

const supportTopics = [
  "Teacher registration and profile approval",
  "Tuition vacancy posting and applications",
  "Demo request coordination",
  "Payment and commission questions",
];

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-24">
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-orange-50 via-white to-slate-50">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
                  <MessageCircle className="h-4 w-4" />
                  Contact TuitionHub
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                  Get help with your tuition workflow.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                  Reach out for teacher onboarding, vacancy support, demo coordination,
                  or platform administration questions.
                </p>

                <div className="grid grid-cols-1 gap-4 mt-10">
                  {contactMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div key={method.label} className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-orange-700">{method.label}</p>
                            <p className="text-lg font-black text-slate-900">{method.value}</p>
                            <p className="text-sm text-slate-500 font-medium mt-1">{method.detail}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-orange-100 rounded-3xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <Send className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Send a Message</h2>
                    <p className="text-slate-500 font-medium">Use email for the fastest response.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                  />
                  <select className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none bg-white text-slate-700">
                    <option>Teacher support</option>
                    <option>Vacancy support</option>
                    <option>Demo request</option>
                    <option>Payment question</option>
                  </select>
                  <textarea
                    rows={5}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                  />
                  <a
                    href="mailto:support@tuitionhub.com"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg"
                  >
                    Continue by Email <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-5">
                  <HelpCircle className="h-4 w-4" />
                  Support Topics
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-6">We can help with</h2>
                <div className="space-y-3">
                  {supportTopics.map((topic) => (
                    <div key={topic} className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-slate-100">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shrink-0"></span>
                      <p className="font-semibold text-slate-700">{topic}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white">
                <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-black mb-4">Need a faster start?</h2>
                <p className="text-slate-300 font-medium leading-relaxed mb-8">
                  Teachers can create an account and complete their profile immediately.
                  Admin approval can happen after the profile details are available.
                </p>
                <Link
                  to="/register/teacher"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-orange-50"
                >
                  Register as Teacher <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
