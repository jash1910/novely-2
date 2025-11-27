import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Novely</Link>

      <div className="actions">
        {!token ? (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/signup" className="nav-btn filled">Sign Up</Link>
          </>
        ) : (
          <button className="nav-btn filled" onClick={logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
