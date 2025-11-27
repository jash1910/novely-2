import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="hero">
      <div className="overlay" />

      <div className="hero-content">
        <h1>Welcome to Novely</h1>
        <p>Your space to write, read, and grow.</p>

        <button onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
