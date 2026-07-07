import { useEffect } from "react";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Remove after 3s (animation handles fading out)
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {type === "success" && <FaCheckCircle style={{ color: "var(--accent-green)", fontSize: "18px" }} />}
      {type === "error" && <FaTrashAlt style={{ color: "var(--accent-red)", fontSize: "18px" }} />}
      <span>{message}</span>
    </div>
  );
}

export default Toast;
