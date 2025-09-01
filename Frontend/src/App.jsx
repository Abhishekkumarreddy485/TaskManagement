// App.jsx
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // listen to storage changes (multi-tab support too)
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Task Manager</h1>
        <nav>
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <button onClick={logout} className="link-btn">Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Tasks /> : <Navigate to="/login" />}
          />
          {/* 👇 Pass setIsLoggedIn to Login */}
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
