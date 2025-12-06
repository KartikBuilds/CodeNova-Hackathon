import { useState } from 'react';
import { Link } from 'react-router-dom';
import './FloatingTutor.css';

const FloatingTutor = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="floating-tutor">
      <Link to="/tutor" className="floating-tutor-button">
        <div className="tutor-icon">
          🤖
        </div>
        <div className="tutor-tooltip">
          Ask AI Tutor
        </div>
      </Link>
      <button 
        className="close-button"
        onClick={() => setIsVisible(false)}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default FloatingTutor;