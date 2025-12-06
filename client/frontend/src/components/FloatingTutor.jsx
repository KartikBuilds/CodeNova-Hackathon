import { useState } from 'react';
import { Link } from 'react-router-dom';

const FloatingTutor = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {/* Tooltip */}
      <div 
        className={`bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        Ask AI Tutor
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-slate-800"></div>
      </div>

      {/* Button */}
      <Link 
        to="/tutor" 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-110 transition-all duration-300">
          🤖
        </div>
        {/* Pulse Ring */}
        <div className="absolute inset-0 rounded-2xl bg-indigo-500/30 animate-ping"></div>
      </Link>

      {/* Close button */}
      <button 
        className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 text-white rounded-full text-sm flex items-center justify-center hover:bg-slate-800 transition-colors shadow-md"
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(false);
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default FloatingTutor;