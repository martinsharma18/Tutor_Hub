import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, BookOpen, Users, GraduationCap } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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
      title: "Expert Tutors",
      description: "Find qualified teachers with verified credentials",
    },
    {
      icon: BookOpen,
      title: "Wide Range of Subjects",
      description: "From Math to Music, find tutors for any subject",
    },
    {
      icon: MapPin,
      title: "Location Based",
      description: "Connect with tutors in your area or online",
    },
    {
      icon: Users,
      title: "Trusted Platform",
      description: "Safe and secure environment for learning",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Headline */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Find the Best{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Tutors
              </span>{" "}
              or Tuition{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Vacancies
              </span>{" "}
              Near You
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Connecting Parents, Students, and Teachers on one simple platform.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-orange-100">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    I am a
                  </label>
                  <select
                    value={searchData.role}
                    onChange={(e) => setSearchData({ ...searchData, role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  >
                    <option value="">Select Role</option>
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={searchData.subject}
                    onChange={(e) => setSearchData({ ...searchData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                {/* Class Level */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Class Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Grade 8"
                    value={searchData.classLevel}
                    onChange={(e) => setSearchData({ ...searchData, classLevel: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., New York"
                    value={searchData.city}
                    onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                {/* Area */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Downtown"
                    value={searchData.area}
                    onChange={(e) => setSearchData({ ...searchData, area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  />
                </div>

                {/* Mode */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mode
                  </label>
                  <select
                    value={searchData.mode}
                    onChange={(e) => setSearchData({ ...searchData, mode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  >
                    <option value="">Any Mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Search Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleSearch("teachers")}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <Search className="h-5 w-5" />
                  Find Teachers
                </button>
                <button
                  onClick={() => handleSearch("vacancies")}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <Search className="h-5 w-5" />
                  Find Vacancies
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose TuitionHub?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to connect with the perfect tutor or opportunity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-gradient-to-br from-white to-orange-50 rounded-2xl border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
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
