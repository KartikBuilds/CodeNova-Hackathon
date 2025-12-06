import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎓 AI Learning Assistant
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/catalog" className="navbar-link">
                Catalog
              </Link>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <Link to="/plan" className="navbar-link">
                Learning Plan
              </Link>
              <Link to="/profile" className="navbar-link">
                Profile
              </Link>
              <div className="navbar-user">
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
