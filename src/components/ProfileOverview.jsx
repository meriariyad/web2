import { useState } from 'react';
import { apiUpdateProfile } from '../api';

function ProfileOverview({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';

  const getInitials = () => {
    if (user?.fullName && user.fullName.trim()) {
      const parts = user.fullName.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return user.fullName.slice(0, 2).toUpperCase();
    }
    return (user?.username || 'U').slice(0, 2).toUpperCase();
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!fullName.trim() || !email.trim() || !username.trim()) {
      setIsError(true);
      setMessage('Full name, email, and username cannot be empty.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setIsError(true);
      setMessage('Please enter a valid email address.');
      return;
    }

    if (username.trim().length < 3) {
      setIsError(true);
      setMessage('Username must be at least 3 characters long.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await apiUpdateProfile(
        fullName.trim(),
        email.trim(),
        username.trim()
      );

      if (result.user) {
        setUser(result.user);
        setIsError(false);
        setMessage('Profile updated successfully in database!');
        setIsEditing(false);
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.fullName || '');
    setEmail(user?.email || '');
    setUsername(user?.username || '');
    setMessage('');
    setIsEditing(false);
  };

  return (
    <div className="tab-content-container">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="avatar-circle">{getInitials()}</div>
        <div className="profile-header-meta">
          <div className="profile-title-row">
            <h2>{user?.fullName || user?.username}</h2>
            <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
              {isAdmin ? 'Administrator' : 'Standard Member'}
            </span>
          </div>
          <p className="profile-handle">@{user?.username}</p>
          <p className="profile-member-date">Member since {user?.createdAt || 'Jan 2026'}</p>
        </div>
      </div>

      {/* Information Card */}
      <div className="profile-section-card">
        <div className="section-card-header">
          <div>
            <h3>Personal Information</h3>
            <p className="section-desc">View and manage your identity and contact details</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              className="btn-edit-toggle"
              onClick={() => {
                setIsEditing(true);
                setMessage('');
              }}
            >
              Edit Details
            </button>
          )}
        </div>

        {message && (
          <div className={isError ? 'error' : 'success'}>{message}</div>
        )}

        {!isEditing ? (
          <div className="info-display-grid">
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">{user?.fullName || '—'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">{user?.email || '—'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Username</span>
              <span className="info-value">@{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Account Role</span>
              <span className="info-value">{isAdmin ? 'Administrator' : 'Standard Member'}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="info-edit-form">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-fullname">
                Full Name
              </label>
              <input
                id="edit-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-email">
                Email Address
              </label>
              <input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-username">
                Username
              </label>
              <input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. username"
                disabled={loading}
              />
            </div>

            <div className="form-button-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfileOverview;
