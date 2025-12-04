import { useState, useEffect } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/books");
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);

      // Redirect to books page after login:
      navigate("/books");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="auth-box">
        <h2>Welcome Back</h2>

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign Up</span>
        </p>
      </form>
    </div>
  );
}
