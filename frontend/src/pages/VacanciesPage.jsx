import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, DollarSign, Clock, Calendar, Filter, X, CheckCircle } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { postsApi } from "../features/posts/api";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../store/authSlice";

const VacanciesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const initialFilters = location.state || {};
  
  const [filters, setFilters] = useState({
    city: initialFilters.city || "",
    area: initialFilters.area || "",
    subject: initialFilters.subject || "",
    classLevel: initialFilters.classLevel || "",
    mode: initialFilters.mode || "",
    minBudget: "",
    maxBudget: "",
    page: 1,
    pageSize: 12,
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["open-posts", filters],
    queryFn: () => postsApi.openPosts(filters),
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      area: "",
      subject: "",
      classLevel: "",
      mode: "",
      minBudget: "",
      maxBudget: "",
      page: 1,
      pageSize: 12,
    });
  };

  const handleApply = (postId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "Teacher") {
      alert("Only teachers can apply to vacancies");
      return;
    }
    navigate(`/teacher?apply=${postId}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "closed":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Find Tuition Vacancies
            </h1>
            <p className="text-xl text-slate-600">
              Discover teaching opportunities that match your expertise
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-orange-500" />
                    Filters
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Mathematics"
                      value={filters.subject}
                      onChange={(e) => updateFilter("subject", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
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
                      value={filters.classLevel}
                      onChange={(e) => updateFilter("classLevel", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      value={filters.city}
                      onChange={(e) => updateFilter("city", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Area"
                      value={filters.area}
                      onChange={(e) => updateFilter("area", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Budget Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minBudget}
                        onChange={(e) => updateFilter("minBudget", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxBudget}
                        onChange={(e) => updateFilter("maxBudget", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Teaching Mode
                    </label>
                    <select
                      value={filters.mode}
                      onChange={(e) => updateFilter("mode", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    >
                      <option value="">All Modes</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-orange-500 hover:text-orange-600 transition-all"
                >
                  <Filter className="h-5 w-5" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-slate-600">
                  {isFetching ? "Searching..." : `${data?.items?.length || 0} vacancies found`}
                </p>
              </div>

              {/* Vacancy Cards */}
              {isFetching ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                </div>
              ) : data && data.items && data.items.length > 0 ? (
                <div className="space-y-4">
                  {data.items.map((vacancy, index) => (
                    <div
                      key={vacancy.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 p-6 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                {vacancy.subject} Tutor needed for {vacancy.classLevel}
                              </h3>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(vacancy.status)}`}>
                                {vacancy.status || "Open"}
                              </span>
                            </div>
                          </div>

                          <p className="text-slate-600 mb-4 line-clamp-2">
                            {vacancy.description || "Looking for an experienced tutor to help with this subject."}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-3 text-slate-600">
                              <MapPin className="h-5 w-5 text-orange-500" />
                              <span className="font-medium">{vacancy.city}{vacancy.area ? `, ${vacancy.area}` : ""}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <DollarSign className="h-5 w-5 text-orange-500" />
                              <span className="font-bold text-orange-600">${vacancy.budget?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <Clock className="h-5 w-5 text-orange-500" />
                              <span className="capitalize">{vacancy.mode || "Flexible"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                              <Calendar className="h-5 w-5 text-orange-500" />
                              <span className="text-sm">
                                {vacancy.createdAtUtc 
                                  ? new Date(vacancy.createdAtUtc).toLocaleDateString()
                                  : "Recently posted"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Action */}
                        <div className="lg:w-48 flex lg:flex-col items-center lg:items-end gap-4">
                          <button
                            onClick={() => handleApply(vacancy.id)}
                            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap"
                          >
                            <CheckCircle className="h-5 w-5" />
                            Apply as Teacher
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-slate-600 mb-2">No vacancies found</p>
                  <p className="text-slate-500">Try adjusting your filters</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VacanciesPage;


