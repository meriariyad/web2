import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRegister } from './api';

function Register({ isLoggedIn }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const validateForm = () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      return 'Please fill in all fields.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address (e.g. user@example.com).';
    }

    if (username.trim().length < 3) {
      return 'Username must be at least 3 characters long.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setIsError(true);
      setMessage(validationError);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await apiRegister(
        username.trim(),
        password,
        fullName.trim(),
        email.trim()
      );

      setIsError(false);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="box">
      <h2>Create Account</h2>
      <p className="box-subtitle">Join to start using the application</p>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-fullname">
            Full Name
          </label>
          <input
            id="reg-fullname"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">
            Email Address
          </label>
          <input
            id="reg-email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-username">
            Username
          </label>
          <input
            id="reg-username"
            type="text"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            disabled={loading}
          />
          <div className="field-hint">Minimum 3 characters</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">
            Password
          </label>
          <div className="input-wrapper">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
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
          <div className="field-hint">Minimum 6 characters</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-confirm-password">
            Confirm Password
          </label>
          <div className="input-wrapper">
            <input
              id="reg-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              tabIndex="-1"
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {message && (
          <div className={isError ? 'error' : 'success'}>{message}</div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="box-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
}

export default Register;
