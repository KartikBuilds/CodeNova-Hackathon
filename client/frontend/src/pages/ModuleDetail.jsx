import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { catalogAPI } from '../api/catalogAPI';
import './ModuleDetail.css';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModule = async () => {
      setLoading(true);
      try {
        const data = await catalogAPI.getModuleById(id);
        setModule(data.module || data);
        setError('');
      } catch (err) {
        console.error('Error fetching module:', err);
        setError('Failed to load module details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchModule();
    }
  }, [id]);

  const getYouTubeEmbedUrl = (url) => {
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const handleTakeQuiz = () => {
    // Pass module topic info as state to quiz page
    const state = {
      topic: module.topic || module.title || module.name,
      moduleId: id,
      moduleName: module.title || module.name,
    };
    navigate(`/quiz/${id}`, { state });
  };

  if (loading) {
    return (
      <div className="module-detail-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading module details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-detail-container">
        <div className="error-container">
          <p>{error}</p>
          <Link to="/catalog" className="back-link">← Back to Catalog</Link>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="module-detail-container">
        <div className="error-container">
          <p>Module not found</p>
          <Link to="/catalog" className="back-link">← Back to Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="module-detail-container">
      <div className="module-detail-header">
        {module.courseId ? (
          <Link to={`/course/${module.courseId}`} className="back-link">
            ← Back to Course
          </Link>
        ) : (
          <Link to="/catalog" className="back-link">← Back to Catalog</Link>
        )}

        <h1>{module.title || module.name}</h1>
        
        {module.description && (
          <p className="module-description">{module.description}</p>
        )}

        <div className="module-meta">
          {module.duration && (
            <span className="module-duration">⏱ {module.duration}</span>
          )}
          {module.difficulty && (
            <span className={`module-difficulty ${module.difficulty.toLowerCase()}`}>
              {module.difficulty}
            </span>
          )}
        </div>
      </div>

      <div className="module-content-section">
        <h2>Learning Content</h2>
        
        {module.contentItems && module.contentItems.length > 0 ? (
          <div className="content-items-list">
            {module.contentItems.map((item, index) => (
              <div key={item._id || item.id || index} className="content-item">
                <div className="content-item-header">
                  <h3>
                    {item.type === 'video' && '🎥 '}
                    {item.type === 'article' && '📄 '}
                    {item.type === 'reading' && '📖 '}
                    {item.type === 'exercise' && '💻 '}
                    {item.title || `Content Item ${index + 1}`}
                  </h3>
                </div>

                {item.description && (
                  <p className="content-item-description">{item.description}</p>
                )}

                {/* YouTube Video Embed */}
                {item.type === 'video' && item.provider === 'youtube' && item.url && (
                  <div className="video-container">
                    <iframe
                      src={getYouTubeEmbedUrl(item.url)}
                      title={item.title || 'Video'}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Other video types */}
                {item.type === 'video' && item.provider !== 'youtube' && item.url && (
                  <div className="video-link">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Watch Video →
                    </a>
                  </div>
                )}

                {/* Article/Reading Links */}
                {(item.type === 'article' || item.type === 'reading') && item.url && (
                  <div className="content-link">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Read Article →
                    </a>
                  </div>
                )}

                {/* Exercise/Code Links */}
                {item.type === 'exercise' && item.url && (
                  <div className="content-link">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Open Exercise →
                    </a>
                  </div>
                )}

                {/* Content Text */}
                {item.content && (
                  <div className="content-text">
                    <p>{item.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-content">No content available for this module</p>
        )}
      </div>

      {/* Quiz Section */}
      <div className="module-quiz-section">
        <div className="quiz-card">
          <h3>Ready to test your knowledge?</h3>
          <p>Take a quiz to assess your understanding of this module</p>
          <button onClick={handleTakeQuiz} className="quiz-button">
            Take Quiz
          </button>
        </div>
      </div>

      {/* Additional Info */}
      {module.learningObjectives && module.learningObjectives.length > 0 && (
        <div className="module-objectives">
          <h3>Learning Objectives</h3>
          <ul>
            {module.learningObjectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;
