import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const getDifficultyStyles = (difficulty) => {
    const level = difficulty?.toLowerCase();
    if (level === 'beginner') return 'bg-green-100 text-green-700 border-green-200';
    if (level === 'intermediate') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (level === 'advanced') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <Link 
      to={`/course/${course._id || course.id}`} 
      className="group block"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {course.title || course.name}
          </h3>
          <span className="shrink-0 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full border border-indigo-100">
            {course.domain}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
          {course.description || 'No description available'}
        </p>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            {course.modules && (
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <span className="text-base">📚</span>
                <span>{course.modules.length || 0} modules</span>
              </span>
            )}
            {course.difficulty && (
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getDifficultyStyles(course.difficulty)}`}>
                {course.difficulty}
              </span>
            )}
          </div>
          
          <span className="text-indigo-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            View
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
