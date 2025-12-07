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
          <p className="text-slate-400 text-sm mb-4">
            © {currentYear} LearnAI. All rights reserved.
          </p>
          
          {/* Team Section */}
          <div className="mb-4">
            <p className="text-slate-500 text-xs mb-2">Built with ❤️ by</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href="https://github.com/KartikBuilds" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Kartik <span className="text-slate-600">• Full Stack</span>
              </a>
              <a 
                href="https://github.com/TanmayJare" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Tanmay Jare <span className="text-slate-600">• Frontend</span>
              </a>
              <a 
                href="https://github.com/Shreeyaparkhi11" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Shreeya Parkhi <span className="text-slate-600">• Backend</span>
              </a>
              <a 
                href="https://github.com/viraj-gavade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
              >
                Viraj Gavade <span className="text-slate-600">• AI/ML</span>
              </a>
            </div>
          </div>

          {/* GitHub Link */}
          <a 
            href="https://github.com/KartikBuilds/CodeNova-Hackathon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;