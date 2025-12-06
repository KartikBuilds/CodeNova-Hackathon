import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogAPI } from '../api/catalogAPI';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await catalogAPI.getCourseById(courseId);
        setCourse(data.course || data);
        setError('');
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  if (loading) {
    return (
      <div className="course-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-detail-container">
        <div className="error-container">
          <p>{error}</p>
          <Link to="/catalog" className="back-link">← Back to Catalog</Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <div className="error-container">
          <p>Course not found</p>
          <Link to="/catalog" className="back-link">← Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="course-detail-container">
      <div className="course-detail-header">
        <Link to="/catalog" className="back-link">← Back to Catalog</Link>
        
        <div className="course-detail-title-section">
          <h1>{course.title || course.name}</h1>
          <div className="course-detail-meta">
            <span className="course-domain-badge">{course.domain}</span>
            {course.difficulty && (
              <span className={`course-difficulty ${course.difficulty.toLowerCase()}`}>
                {course.difficulty}
              </span>
            )}
          </div>
        </div>

        <p className="course-detail-description">
          {course.description || 'No description available'}
        </p>

        {course.instructor && (
          <div className="course-instructor">
            <strong>Instructor:</strong> {course.instructor}
          </div>
        )}

        {course.duration && (
          <div className="course-duration">
            <strong>Duration:</strong> {course.duration}
          </div>
        )}
      </div>

      <div className="course-modules-section">
        <h2>Course Modules</h2>
        
        {course.modules && course.modules.length > 0 ? (
          <div className="modules-list">
            {course.modules.map((module, index) => (
              <Link
                key={module._id || module.id || index}
                to={`/module/${module._id || module.id}`}
                className="module-card"
              >
                <div className="module-number">{index + 1}</div>
                <div className="module-content">
                  <h3 className="module-title">{module.title || module.name}</h3>
                  {module.description && (
                    <p className="module-description">{module.description}</p>
                  )}
                  {module.duration && (
                    <span className="module-duration">⏱ {module.duration}</span>
                  )}
                </div>
                <div className="module-arrow">→</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-modules">No modules available for this course</p>
        )}
      </div>

      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="course-prerequisites">
          <h3>Prerequisites</h3>
          <ul>
            {course.prerequisites.map((prereq, index) => (
              <li key={index}>{prereq}</li>
            ))}
          </ul>
        </div>
      )}

      {course.learningOutcomes && course.learningOutcomes.length > 0 && (
        <div className="course-outcomes">
          <h3>What You'll Learn</h3>
          <ul>
            {course.learningOutcomes.map((outcome, index) => (
              <li key={index}>{outcome}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
