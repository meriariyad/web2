import { useState, useEffect } from 'react';
import { apiGetAdminUsers, apiAdminResetPassword, apiAdminDeleteUser } from '../api';

function AdminPanel({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    apiGetAdminUsers()
      .then((data) => {
        if (isMounted && data.users) {
          setUsers(data.users);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setIsError(true);
          setMessage(err.message || 'Failed to load user directory.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoadingUsers(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [reloadTrigger]);

  const refreshUsers = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(query)) ||
      (u.fullName && u.fullName.toLowerCase().includes(query)) ||
      (u.email && u.email.toLowerCase().includes(query))
    );
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const standardCount = totalUsers - adminCount;

  const handleStartReset = (user) => {
    setResetTarget(user);
    setNewPassword('');
    setShowPassword(false);
    setMessage('');
  };

  const handleConfirmReset = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setIsError(true);
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setActionLoading(true);
    setMessage('');

    try {
      const res = await apiAdminResetPassword(resetTarget.username, newPassword);
      setIsError(false);
      setMessage(res.message || `Password for @${resetTarget.username} has been reset.`);
      setResetTarget(null);
      setNewPassword('');
      refreshUsers();
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Failed to reset password.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (targetUser) => {
    if (targetUser.username === currentUser?.username) {
      setIsError(true);
      setMessage('You cannot delete your own active admin account.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete user "@${targetUser.username}" from MongoDB? This cannot be undone.`
    );
    if (confirmed) {
      setActionLoading(true);
      setMessage('');
      try {
        const res = await apiAdminDeleteUser(targetUser.username);
        setIsError(false);
        setMessage(res.message || `User @${targetUser.username} was removed.`);
        refreshUsers();
      } catch (err) {
        setIsError(true);
        setMessage(err.message || 'Failed to delete user.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="tab-content-container">
      <div className="admin-panel">
        <div className="admin-header">
          <h3>User Directory & Management</h3>
          <p className="admin-subtitle">
            Manage registered accounts in MongoDB, reset passwords, and view system statistics.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-value">{totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{adminCount}</div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{standardCount}</div>
            <div className="stat-label">Regular Users</div>
          </div>
        </div>

        {/* Status Alerts */}
        {message && (
          <div className={isError ? 'error' : 'success'}>{message}</div>
        )}

        {/* Reset Password Modal / Card */}
        {resetTarget && (
          <div className="reset-box">
            <h4>Reset Password for <strong>@{resetTarget.username}</strong></h4>
            <form onSubmit={handleConfirmReset}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-new-pw">
                  New Password (minimum 6 characters)
                </label>
                <div className="input-wrapper">
                  <input
                    id="admin-new-pw"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                    disabled={actionLoading}
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
              <div className="reset-actions">
                <button type="submit" className="btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Saving...' : 'Save New Password'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setResetTarget(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="admin-search-wrapper">
          <input
            type="text"
            placeholder="Search users by name, username, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* User Table */}
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    Loading users from MongoDB...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    No matching users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.username === currentUser?.username;
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u.username}>
                      <td>
                        <div className="user-name-cell">
                          <strong>{u.fullName || '—'}</strong>
                          <span className="username-sub">@{u.username}</span>
                        </div>
                      </td>
                      <td>{u.email || '—'}</td>
                      <td>
                        <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
                          {isAdmin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          <button
                            type="button"
                            className="btn-table-action btn-action-reset"
                            onClick={() => handleStartReset(u)}
                            title="Reset user's password"
                            disabled={actionLoading}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="btn-table-action btn-action-delete"
                            onClick={() => handleDelete(u)}
                            disabled={isCurrent || actionLoading}
                            title={isCurrent ? "You cannot delete yourself" : "Delete user"}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
