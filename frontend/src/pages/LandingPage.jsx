import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, BookOpen, Users, GraduationCap, ArrowRight, Briefcase } from "lucide-react";
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
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Elevate Your <br/>
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Teaching Career
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium">
              Find premium home tuition vacancies and connect with learners directly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="bg-white rounded-[32px] shadow-2xl p-3 border border-orange-100 flex flex-col md:flex-row items-center gap-2">
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
                className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl hover:shadow-orange-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 whitespace-nowrap"
              >
                Find Openings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Vacancies Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fdfcfb]">
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
                  className="p-10 bg-white rounded-3xl border border-slate-100 hover:border-orange-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                >
                  <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-8 mx-auto group-hover:bg-orange-500 group-hover:text-white transition-colors">
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

      <Footer />
    </div>
  );
};

export default LandingPage;
