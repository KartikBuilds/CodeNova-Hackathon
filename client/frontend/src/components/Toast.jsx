import './Toast.css';

const Toast = ({ message, type = 'success' }) => {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">
        {type === 'success' ? '✓' : '✕'}
      </div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
