import { useState } from 'react';
import { apiChangePassword } from '../api';

function SecuritySettings({ setUser }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setIsError(true);
      setMessage('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setIsError(true);
      setMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage('New passwords do not match.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await apiChangePassword(currentPassword, newPassword);
      if (result.user) {
        setUser(result.user);
      }
      setIsError(false);
      setMessage('Password updated successfully in database!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setIsError(true);
      setMessage(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content-container">
      <div className="profile-section-card">
        <div className="section-card-header">
          <div>
            <h3>Security & Password</h3>
            <p className="section-desc">Change your password to keep your account secure</p>
          </div>
        </div>

        {message && (
          <div className={isError ? 'error' : 'success'}>{message}</div>
        )}

        <form onSubmit={handleChangePassword} className="security-form">
          <div className="form-group">
            <label className="form-label" htmlFor="sec-current-pw">
              Current Password
            </label>
            <div className="input-wrapper">
              <input
                id="sec-current-pw"
                type={showPasswords ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPasswords(!showPasswords)}
                aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
                tabIndex="-1"
              >
                {showPasswords ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sec-new-pw">
              New Password
            </label>
            <div className="input-wrapper">
              <input
                id="sec-new-pw"
                type={showPasswords ? 'text' : 'password'}
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="field-hint">Must be at least 6 characters long</div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sec-confirm-pw">
              Confirm New Password
            </label>
            <div className="input-wrapper">
              <input
                id="sec-confirm-pw"
                type={showPasswords ? 'text' : 'password'}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ maxWidth: '200px' }} disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SecuritySettings;
