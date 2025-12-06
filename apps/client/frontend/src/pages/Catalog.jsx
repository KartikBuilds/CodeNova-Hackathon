import { useState, useEffect } from 'react';
import { catalogAPI } from '../api/catalogAPI';
import CourseCard from '../components/CourseCard';

const Catalog = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 9;

  // Fetch domains on mount
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const data = await catalogAPI.getDomains();
        setDomains(data.domains || data || []);
      } catch (err) {
        console.error('Error fetching domains:', err);
        setError('Failed to load domains');
      }
    };

    fetchDomains();
  }, []);

  // Fetch all courses initially
  useEffect(() => {
    fetchCourses(1);
  }, []);

  // Reset to first page when domain changes
  useEffect(() => {
    if (selectedDomain !== undefined) {
      setCurrentPage(1);
      fetchCourses(1);
    }
  }, [selectedDomain]);

  // Fetch courses with pagination
  const fetchCourses = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: coursesPerPage,
        ...(selectedDomain && { domain: selectedDomain })
      };
      
      const response = selectedDomain 
        ? await catalogAPI.getCourses(selectedDomain, params)
        : await catalogAPI.getAllCourses(params);
        
      // Extract data from response
      const courses = response.data?.courses || [];
      
      setCourses(courses);
      setTotalPages(response.pages || 1);
      setTotalCourses(response.total || 0);
      setCurrentPage(page);
      setError('');
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDomainChange = (e) => {
    const domain = e.target.value;
    setSelectedDomain(domain || '');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchCourses(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-40 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
            <div className="h-6 bg-slate-200 rounded-full w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
              Course Catalogue
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 animate-fadeIn">
              Explore our comprehensive collection of AI-powered courses designed to accelerate your learning journey
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{totalCourses}+</div>
                <div className="text-indigo-200 text-sm mt-1">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">{domains.length}</div>
                <div className="text-indigo-200 text-sm mt-1">Domains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">AI</div>
                <div className="text-indigo-200 text-sm mt-1">Powered</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.1"/>
            <path d="M0 120L60 115C120 110 240 100 360 95C480 90 600 90 720 92C840 94 960 98 1080 100C1200 102 1320 102 1380 102L1440 102V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <label htmlFor="domain-select" className="text-sm font-medium text-slate-600 whitespace-nowrap">
              Filter by Domain:
            </label>
            <select
              id="domain-select"
              value={selectedDomain}
              onChange={handleDomainChange}
              className="flex-1 sm:w-64 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer hover:bg-slate-100"
            >
              <option value="">All Domains</option>
              {domains.map((domain, index) => (
                <option key={index} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-slate-500">
            Showing <span className="font-semibold text-indigo-600">{courses.length}</span> courses
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : courses.length > 0 ? (
          <>
            {/* Results Info */}
            <div className="mb-6 text-center text-slate-600">
              Showing {((currentPage - 1) * coursesPerPage) + 1} - {Math.min(currentPage * coursesPerPage, totalCourses)} of {totalCourses} courses
              {selectedDomain && <span className="ml-2 text-indigo-600">in {selectedDomain}</span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {courses.map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    const isCurrentPage = page === currentPage;
                    const shouldShow = page === 1 || page === totalPages || 
                                    (page >= currentPage - 2 && page <= currentPage + 2);
                    
                    if (!shouldShow) {
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return <span key={page} className="px-2 text-slate-400">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          isCurrentPage
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No courses found</h3>
            <p className="text-slate-500">
              {selectedDomain ? `No courses available for "${selectedDomain}"` : 'No courses available at the moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
