// pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await register(form);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      nav('/');
    } catch (error) {
      console.error("Register error:", error);
      setErr(
        error?.response?.data?.msg ||
        error?.msg ||
        error?.message ||
        'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <h2>Create account</h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}
