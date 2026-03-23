import { MapPin, BookOpen, DollarSign, Clock, User } from "lucide-react";
import StatusBadge from "./StatusBadge";

const VacancyCard = ({ 
  post, 
  onApply, 
  onView, 
  showActions = true,
  className = "" 
}) => {
  return (
    <div 
      className={`
        group relative bg-white rounded-2xl border-2 border-orange-100 
        p-6 shadow-md hover:shadow-2xl hover:border-orange-300 
        transition-all duration-300 transform hover:-translate-y-2 
        card-hover animate-fade-in ${className}
      `}
    >
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4">
        <StatusBadge status={post.status} />
      </div>

      {/* Header */}
      <div className="pr-20 mb-4">
        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
          {post.subject}
        </h3>
        <p className="text-slate-600 line-clamp-2">{post.description}</p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-slate-600">
          <BookOpen className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium">{post.classLevel}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium">{post.city}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium capitalize">{post.mode}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-orange-500" />
          <span className="text-lg font-bold text-orange-600">
            ${post.budget?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      {showActions && (
        <div className="flex gap-3 pt-4 border-t border-orange-100">
          {onView && (
            <button
              onClick={() => onView(post)}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-orange-200 
                       text-orange-600 font-semibold hover:bg-orange-50 
                       hover:border-orange-300 transition-all duration-200 
                       transform hover:scale-105 active:scale-95"
            >
              View Details
            </button>
          )}
          {onApply && (
            <button
              onClick={() => onApply(post)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 
                       text-white font-semibold shadow-md hover:shadow-lg 
                       hover:from-orange-600 hover:to-orange-700 
                       transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Apply Now
            </button>
          )}
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 
                      group-hover:from-orange-500/5 group-hover:to-orange-500/0 
                      rounded-2xl pointer-events-none transition-all duration-300"></div>
    </div>
  );
};

export default VacancyCard;



