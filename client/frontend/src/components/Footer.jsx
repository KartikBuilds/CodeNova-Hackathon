import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Company Info */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl">LearnAI</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Personalized AI-powered learning platform that adapts to your unique learning style and pace.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/catalog" className="text-slate-400 hover:text-white transition-colors">
              Course Catalogue
            </Link>
            <Link to="/path" className="text-slate-400 hover:text-white transition-colors">
              Learning Path
            </Link>
            <Link to="/plan" className="text-slate-400 hover:text-white transition-colors">
              Learning Plans
            </Link>
            <Link to="/flashcards" className="text-slate-400 hover:text-white transition-colors">
              Flashcards
            </Link>
            <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/profile" className="text-slate-400 hover:text-white transition-colors">
              Profile
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm mb-2">
            © {currentYear} LearnAI. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;