import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Star, BookOpen, Clock, DollarSign, Filter, X } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { searchApi } from "../features/search/api";

const TeachersPage = () => {
  const location = useLocation();
  const initialFilters = location.state || {};
  
  const [filters, setFilters] = useState({
    city: initialFilters.city || "",
    area: initialFilters.area || "",
    subject: initialFilters.subject || "",
    classLevel: initialFilters.classLevel || "",
    mode: initialFilters.mode || "",
    minExperience: "",
    page: 1,
    pageSize: 12,
  });

  const [showFilters, setShowFilters] = useState(false);

  const { data, isFetching } = useQuery({
    queryKey: ["search-teachers", filters],
    queryFn: () => searchApi.teachers(filters),
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
      minExperience: "",
      page: 1,
      pageSize: 12,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Find Expert Teachers
            </h1>
            <p className="text-xl text-slate-600">
              Browse through our verified and qualified tutors
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

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Min Experience (Years)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 2"
                      value={filters.minExperience}
                      onChange={(e) => updateFilter("minExperience", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                    />
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
                  {isFetching ? "Searching..." : `${data?.items?.length || 0} teachers found`}
                </p>
              </div>

              {/* Teacher Cards Grid */}
              {isFetching ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                </div>
              ) : data && data.items && data.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.items.map((teacher, index) => (
                    <div
                      key={teacher.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Teacher Photo & Header */}
                      <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-orange-600 shadow-lg">
                            {teacher.fullName?.charAt(0) || "T"}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-slate-900">4.8</span>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {teacher.fullName}
                        </h3>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">{teacher.city}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">{teacher.yearsOfExperience || 0} years experience</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <BookOpen className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">{teacher.subjects || "Multiple subjects"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <DollarSign className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-semibold text-orange-600">
                              ${teacher.hourlyRate || "N/A"}/hr
                            </span>
                          </div>
                        </div>

                        {/* Subject Tags */}
                        {teacher.subjects && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {teacher.subjects.split(",").slice(0, 3).map((subject, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200"
                              >
                                {subject.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-100">
                          <button className="flex-1 px-4 py-2.5 rounded-xl border-2 border-orange-200 text-orange-600 font-semibold hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 transform hover:scale-105 active:scale-95">
                            View Profile
                          </button>
                          <button className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 active:scale-95">
                            Request Demo
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-2xl">
                  <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-slate-600 mb-2">No teachers found</p>
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

export default TeachersPage;


