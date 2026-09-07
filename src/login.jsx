import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiLogin } from './api';

function Login({ login, isLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiLogin(username.trim(), password.trim());
      if (data.user) {
        login(data.user);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <h2>Welcome Back</h2>
      <p className="box-subtitle">Log in to manage your account</p>

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label" htmlFor="login-username">
            Username
          </label>
          <input
            id="login-username"
            type="text"
            placeholder="e.g. admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">
            Password
          </label>
          <div className="input-wrapper">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex="-1"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="box-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
}

export default Login;