import { useState } from 'react';
import { apiDeleteAccount } from '../api';

function DangerZone({ user, logout }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete your account (@${user?.username}) from the database? This action cannot be undone.`
    );
    if (confirmed) {
      setLoading(true);
      try {
        await apiDeleteAccount();
        logout();
      } catch (err) {
        alert(err.message || 'Failed to delete account.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="tab-content-container">
      <div className="profile-section-card danger-zone-card">
        <div className="section-card-header">
          <div>
            <h3 className="danger-title">Danger Zone</h3>
            <p className="section-desc">
              Permanently delete your account from MongoDB and clear your session
            </p>
          </div>
        </div>

        <div className="danger-zone-body">
          <p className="danger-warning-text">
            Deleting your account will immediately remove your user document from the database.
            You will not be able to recover your account unless you re-register.
          </p>
          <div className="danger-zone-action">
            <div>
              <strong>Delete Account: </strong>
              <span>@{user?.username}</span>
            </div>
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
              style={{ maxWidth: '180px' }}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DangerZone;
