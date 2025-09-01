import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(form);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      if (onLogin) onLogin(); // 👈 update App state
      nav('/');
    } catch (error) {
      setErr(error.message || 'Login failed');
    }
  };

  return (
    <div className="auth">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <button type="submit">Login</button>
        {err && <p className="error">{err}</p>}
      </form>
    </div>
  );
}
