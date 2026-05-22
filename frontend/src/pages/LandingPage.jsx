import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, BookOpen, Users, GraduationCap, ArrowRight, Briefcase, TrendingUp, Star, CirclePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import VacancyCard from "../components/ui/VacancyCard";
import { postsApi } from "../features/posts/api";

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    role: "",
    subject: "",
    classLevel: "",
    city: "",
    area: "",
    mode: "",
  });

  const { data: allVacancies, isLoading: isLoadingVacancies } = useQuery({
    queryKey: ["all-vacancies"],
    queryFn: () => postsApi.openPosts({ pageSize: 50 }),
  });

  const handleSearch = (type) => {
    if (type === "teachers") {
      navigate("/teachers", { state: searchData });
    } else if (type === "vacancies") {
      navigate("/vacancies", { state: searchData });
    }
  };

  const features = [
    {
      icon: GraduationCap,
      title: "Latest Vacancies",
      description: "Access a daily updated list of premium tuition opportunities",
    },
    {
      icon: BookOpen,
      title: "Multiple Subjects",
      description: "Find vacancies for all subjects from Primary to University levels",
    },
    {
      icon: MapPin,
      title: "Local Opportunities",
      description: "Connect with students in your preferred cities and areas",
    },
    {
      icon: Users,
      title: "Verified Posts",
      description: "Direct access to verified teaching roles posted by administration",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-200 via-orange-100 to-orange-200 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="absolute top-[-80px] left-[-100px] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-60px] right-[-80px] w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>


        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Elevate Your <br/>
              <span className="bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                Teaching Career
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
              Find premium home tuition vacancies and connect with learners directly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="glass rounded-[32px] shadow-2xl p-3 border border-white/40 flex flex-col md:flex-row items-center gap-2 relative z-10">
              <div className="flex-1 flex items-center gap-3 w-full pl-6">
                <Search className="h-6 w-6 text-orange-500 hidden md:block" />
                <input
                  type="text"
                  placeholder="What subject do you teach?"
                  value={searchData.subject}
                  onChange={(e) => setSearchData({ ...searchData, subject: e.target.value })}
                  className="w-full py-4 bg-transparent outline-none text-slate-800 font-medium placeholder-slate-400"
                />
              </div>
              <div className="h-10 w-[2px] bg-slate-100 hidden md:block"></div>
              <div className="flex-1 flex items-center gap-3 w-full pl-6">
                <MapPin className="h-6 w-6 text-orange-500 hidden md:block" />
                <input
                  type="text"
                  placeholder="Preferred City"
                  value={searchData.city}
                  onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                  className="w-full py-4 bg-transparent outline-none text-slate-800 font-medium placeholder-slate-400"
                />
              </div>
              <button
                onClick={() => handleSearch("vacancies")}
                className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-orange-600 to-orange-800 text-white font-bold rounded-2xl hover:shadow-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                Find Openings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section className="border-y border-orange-200 bg-orange-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-slate-900">500+</div>
            <div className="text-xs font-semibold mt-1 text-slate-600">Registered Teachers</div>
          </div>
          <div>
            <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-slate-900">40+</div>
            <div className="text-xs font-semibold mt-1 text-slate-600">Subjects Covered</div>
          </div>
          <div>
            <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-slate-900">15+</div>
            <div className="text-xs font-semibold mt-1 text-slate-600">Cities Active</div>
          </div>
          <div>
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-3xl font-black text-slate-900">98%</div>
            <div className="text-xs font-semibold mt-1 text-slate-600">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Available Vacancies Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-orange-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-4">
                <Briefcase className="h-4 w-4" />
                Open Opportunities
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Available Vacancies</h2>
              <p className="text-lg text-slate-600 font-medium">Explore active roles verified by our team</p>
            </div>
            <button
              onClick={() => navigate("/vacancies")}
              className="group flex items-center gap-2 text-orange-600 font-black hover:gap-4 transition-all pb-2 border-b-2 border-transparent hover:border-orange-500"
            >
              Explore All <ArrowRight className="h-6 w-6" />
            </button>
          </div>

          {isLoadingVacancies ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {allVacancies?.items?.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  post={vacancy}
                  onApply={() => navigate(`/vacancies`)}
                  className="shadow-xl hover:shadow-2xl transition-shadow"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-16 tracking-tight">
            Designed for <br/>Professional Educators
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass p-10 rounded-3xl border border-white/40 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-8 mx-auto group-hover:bg-gradient-to-br group-hover:from-orange-600 group-hover:to-orange-800 group-hover:text-white transition-colors shadow-sm">
                    <Icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20 bg-orange-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-orange-700 bg-orange-200">All Subjects</span>
            <h2 className="text-4xl font-black mt-4 mb-3 text-slate-900">Tutors for Class 1 to 12</h2>
            <p className="text-base max-w-2xl mx-auto text-slate-600">Expert home tutors available for all major subjects across Nepal's education system.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {["Mathematics", "Physics", "Chemistry", "Biology", "English", "Nepali", "Computer Science", "Accountancy", "Economics", "Social Studies", "Science", "Business Studies", "Optional Mathematics", "Statistics"].map((sub) => (
              <div key={sub} className="px-5 py-3 rounded-2xl font-semibold text-sm hover:-translate-y-1 hover:shadow-lg transition-all cursor-default bg-white border border-orange-200 text-slate-900 shadow-md">
                {sub}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-20 bg-slate-50">
        <div className="text-center mb-14">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-orange-700 bg-orange-200">Reviews</span>
          <h2 className="text-4xl font-black mt-4 mb-3 text-slate-900">What People Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "Found an amazing maths tutor for my son within 2 days. The platform is so easy to use!", name: "Sita Sharma", role: "Parent", initial: "S" },
            { quote: "I registered and got 3 new students in the first week. Highly recommend to all tutors.", name: "Sir Ram Thapa", role: "Teacher", initial: "S" },
            { quote: "My grades improved drastically after finding a tutor through Best Tuitions.", name: "Fatima Malik", role: "Student", initial: "F" }
          ].map((testimonial, i) => (
            <div key={i} className="glass p-7 rounded-2xl border border-white/50 shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-orange-500 fill-orange-500" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5 text-slate-600">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm bg-orange-600">
                  {testimonial.initial}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{testimonial.name}</div>
                  <div className="text-xs text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-4 md:mx-8 lg:mx-12 mb-20 rounded-3xl overflow-hidden relative bg-gradient-to-br from-orange-600 to-orange-900 shadow-2xl">
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="relative px-8 py-14 text-center z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to Start Teaching?</h2>
          <p className="text-white/80 max-w-lg mx-auto mb-8">Join hundreds of tutors already growing their career on Best Tuitions. Registration is free and takes less than 2 minutes.</p>
          <button 
            onClick={() => navigate('/register/teacher')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base shadow-2xl hover:-translate-y-1 transition-all bg-orange-100 text-orange-800 hover:bg-white"
          >
            <CirclePlus className="h-5 w-5" /> Register as Teacher — It's Free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
