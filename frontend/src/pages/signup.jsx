import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <form onSubmit={submit} className="auth-box">
        <h2>Create Account</h2>

        <input placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Email" type="email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <input placeholder="Password" type="password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>

        <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
      </form>
    </div>
  );
}
