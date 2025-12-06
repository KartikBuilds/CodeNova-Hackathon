import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/course/${course._id || course.id}`} className="course-card-link">
      <div className="course-card">
        <div className="course-card-header">
          <h3 className="course-title">{course.title || course.name}</h3>
          <span className="course-domain-badge">{course.domain}</span>
        </div>
        
        <p className="course-description">
          {course.description || 'No description available'}
        </p>
        
        <div className="course-card-footer">
          <div className="course-meta">
            {course.modules && (
              <span className="course-modules">
                📚 {course.modules.length || 0} modules
              </span>
            )}
            {course.difficulty && (
              <span className={`course-difficulty ${course.difficulty.toLowerCase()}`}>
                {course.difficulty}
              </span>
            )}
          </div>
          
          <button className="course-view-button">
            View Course →
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
