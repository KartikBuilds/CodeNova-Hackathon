import { useState, useEffect } from 'react';
import { catalogAPI } from '../api/catalogAPI';
import CourseCard from '../components/CourseCard';
import './Catalog.css';

const Catalog = () => {
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const fetchInitialCourses = async () => {
      setLoading(true);
      try {
        const data = await catalogAPI.getAllCourses();
        setCourses(data.courses || data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCourses();
  }, []);

  // Fetch courses when domain changes
  useEffect(() => {
    if (!selectedDomain) {
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await catalogAPI.getCourses(selectedDomain);
        setCourses(data.courses || data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses for this domain');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedDomain]);

  const handleDomainChange = (e) => {
    const domain = e.target.value;
    setSelectedDomain(domain);
    
    // If "All Domains" is selected, fetch all courses
    if (!domain) {
      fetchAllCourses();
    }
  };

  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const data = await catalogAPI.getAllCourses();
      setCourses(data.courses || data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <h1>Course Catalog</h1>
        <p>Explore our comprehensive collection of courses</p>
      </div>

      <div className="catalog-filters">
        <div className="filter-group">
          <label htmlFor="domain-select">Filter by Domain:</label>
          <select
            id="domain-select"
            value={selectedDomain}
            onChange={handleDomainChange}
            className="domain-select"
          >
            <option value="">All Domains</option>
            {domains.map((domain, index) => (
              <option key={index} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="catalog-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="catalog-loading">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : courses.length > 0 ? (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="catalog-empty">
          <p>No courses found {selectedDomain && `for ${selectedDomain}`}</p>
        </div>
      )}
    </div>
  );
};

export default Catalog;
