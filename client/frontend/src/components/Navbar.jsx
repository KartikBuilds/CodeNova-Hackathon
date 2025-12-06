import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learningDropdownOpen, setLearningDropdownOpen] = useState(false);
  const [aiToolsDropdownOpen, setAiToolsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const learningDropdownRef = useRef(null);
  const aiToolsDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (learningDropdownRef.current && !learningDropdownRef.current.contains(event.target)) {
        setLearningDropdownOpen(false);
      }
      if (aiToolsDropdownRef.current && !aiToolsDropdownRef.current.contains(event.target)) {
        setAiToolsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className="relative px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-indigo-600 after:transition-all hover:after:w-full"
      onClick={() => setMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  const DropdownButton = ({ children, isOpen, onClick }) => (
    <button 
      onClick={onClick}
      className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ease-out flex items-center gap-1 rounded-lg ${
        isOpen 
          ? 'text-indigo-600 bg-indigo-50 shadow-sm' 
          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
      } after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 ${
        isOpen ? 'after:w-full' : 'after:w-0 hover:after:w-full'
      }`}
    >
      {children}
      <svg className={`w-4 h-4 transition-all duration-300 ease-out ${isOpen ? 'rotate-180 text-indigo-600' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  const DropdownMenu = ({ children, isOpen }) => (
    <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 backdrop-blur-sm py-2 z-50 transition-all duration-300 ease-out ${
      isOpen 
        ? 'opacity-100 visible transform translate-y-0 scale-100' 
        : 'opacity-0 invisible transform -translate-y-4 scale-95 pointer-events-none'
    }`}>
      <div className={`transition-all duration-300 ease-out ${isOpen ? 'delay-75' : ''}`}>
        {children}
      </div>
    </div>
  );

  const DropdownLink = ({ to, children, onClick }) => (
    <Link 
      to={to} 
      className="group block px-4 py-2.5 text-sm text-slate-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 transition-all duration-200 ease-out rounded-lg mx-1 transform hover:translate-x-1"
      onClick={() => {
        setMobileMenuOpen(false);
        setLearningDropdownOpen(false);
        setAiToolsDropdownOpen(false);
        setUserDropdownOpen(false);
        onClick?.();
      }}
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🎓</span>
            <span className="hidden sm:inline">AI Learning</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/catalog">Catalog</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                
                {/* Learning Dropdown */}
                <div className="relative" ref={learningDropdownRef}>
                  <DropdownButton 
                    isOpen={learningDropdownOpen} 
                    onClick={() => setLearningDropdownOpen(!learningDropdownOpen)}
                  >
                    Learning
                  </DropdownButton>
                  <DropdownMenu isOpen={learningDropdownOpen}>
                    <DropdownLink to="/path">Learning Path</DropdownLink>
                    <DropdownLink to="/plan">Learning Plan</DropdownLink>
                    <DropdownLink to="/flashcards">Flashcards</DropdownLink>
                  </DropdownMenu>
                </div>

                {/* AI Tools Dropdown */}
                <div className="relative" ref={aiToolsDropdownRef}>
                  <DropdownButton 
                    isOpen={aiToolsDropdownOpen} 
                    onClick={() => setAiToolsDropdownOpen(!aiToolsDropdownOpen)}
                  >
                    AI Tools
                  </DropdownButton>
                  <DropdownMenu isOpen={aiToolsDropdownOpen}>
                    <DropdownLink to="/tutor">AI Tutor</DropdownLink>
                    <DropdownLink to="/rag">Doc Q&A</DropdownLink>
                  </DropdownMenu>
                </div>
                
                {/* User Dropdown */}
                <div className="flex items-center ml-4 pl-4 border-l border-slate-200">
                  <div className="relative" ref={userDropdownRef}>
                    <button 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-300 ease-out rounded-lg ${
                        userDropdownOpen 
                          ? 'text-indigo-600 bg-indigo-50 shadow-sm scale-105' 
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50 hover:scale-102'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs transition-all duration-300 ease-out ${
                        userDropdownOpen ? 'ring-2 ring-indigo-200 shadow-lg' : 'hover:shadow-md'
                      }`}>
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="hidden lg:block transition-all duration-200">{user?.name}</span>
                      <svg className={`w-4 h-4 transition-all duration-300 ease-out ${userDropdownOpen ? 'rotate-180 text-indigo-600' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <DropdownMenu isOpen={userDropdownOpen}>
                      <DropdownLink to="/profile">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </div>
                      </DropdownLink>
                      <hr className="my-1 border-slate-100" />
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 ease-out flex items-center gap-2 rounded-lg mx-1 transform hover:translate-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </DropdownMenu>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-indigo-500/25 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fadeIn">
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/catalog" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Catalog</Link>
                  <Link to="/dashboard" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/path" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Learning Path</Link>
                  <Link to="/plan" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Learning Plan</Link>
                  <Link to="/tutor" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>AI Tutor</Link>
                  <Link to="/flashcards" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Flashcards</Link>
                  <Link to="/rag" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Doc Q&A</Link>
                  <Link to="/profile" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <div className="pt-3 mt-2 border-t border-slate-100">
                    <p className="px-3 text-sm text-slate-500 mb-2">Signed in as {user?.name}</p>
                    <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="px-3 py-2 text-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
