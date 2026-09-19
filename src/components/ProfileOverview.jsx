import { useState } from 'react';
import { apiUpdateProfile } from '../api';

function ProfileOverview({ user, setUser }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedField, setCopiedField] = useState('');
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [phone, setPhone] = useState(user?.phone || '+251 91 123 4567');
  
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

  // 1. Copy to Clipboard Feature
  const handleCopy = (text, fieldName) => {
    if (!text || text === '—') return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2000);
  };

  // 2. Share Features (Telegram, WhatsApp, Email)
  const shareTelegram = () => {
    const text = `Contact Card: ${user?.fullName || user?.username} | Phone: ${phone} | Email: ${user?.email}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareWhatsApp = () => {
    const text = `Contact: ${user?.fullName || user?.username} | Phone: ${phone} | Email: ${user?.email}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
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

    setLoading(true);
    setMessage('');

    try {
      const result = await apiUpdateProfile(
        fullName.trim(),
        email.trim(),
        username.trim()
      );

      if (result.user) {
        setUser({ ...result.user, phone });
        setIsError(false);
        setMessage('Profile updated successfully!');
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
      {/* Visual Copy Alert / Toast */}
      {copiedField && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '8px',
          fontWeight: '600',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          Copied {copiedField} to clipboard!
        </div>
      )}

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="avatar-circle">{getInitials()}</div>
        <div className="profile-header-meta" style={{ width: '100%' }}>
          <div className="profile-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2>{user?.fullName || user?.username}</h2>
              <span style={{ background: '#0284c7', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                Verified
              </span>
            </div>

            {/* Favorite & Quick Action Button */}
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              style={{
                background: isFavorite ? '#eab308' : '#334155',
                color: isFavorite ? '#000' : '#f8fafc',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {isFavorite ? '★ Favorited' : '☆ Favorite'}
            </button>
          </div>
          
          <p className="profile-handle">@{user?.username}</p>
          
          {/* Truecaller / Contact Actions: CRUD buttons */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => alert("Ready for backend: Add Contact")} 
              style={{ background: '#334155', color: '#cbd5e1', border: 'none', padding: '4px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}
            >
              + Add Contact
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(true)} 
              style={{ background: '#334155', color: '#cbd5e1', border: 'none', padding: '4px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}
            >
              Edit Card
            </button>
            <button 
              type="button" 
              onClick={() => alert("Ready for backend: Delete Contact")} 
              style={{ background: '#7f1d1d', color: '#fca5a5', border: 'none', padding: '4px 10px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Information Card (Contact Card Format) */}
      <div className="profile-section-card">
        <div className="section-card-header">
          <div>
            <h3>Contact Details</h3>
            <p className="section-desc">Click copy to use elements or share card directly</p>
          </div>
        </div>

        {message && (
          <div className={isError ? 'error' : 'success'}>{message}</div>
        )}

        {!isEditing ? (
          <div>
            <div className="info-display-grid">
              {/* Phone element with copy button */}
              <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(phone, 'Phone')}
                  style={{ background: '#334155', color: '#38bdf8', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Copy
                </button>
              </div>

              {/* Email element with copy button */}
              <div className="info-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user?.email || '—'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(user?.email, 'Email')}
                  style={{ background: '#334155', color: '#38bdf8', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Copy
                </button>
              </div>

              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">@{user?.username}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Role</span>
                <span className="info-value">{isAdmin ? 'Administrator' : 'Standard Member'}</span>
              </div>
            </div>

            {/* Share Contact Card Section */}
            <div style={{ marginTop: '22px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
              <span className="info-label" style={{ display: 'block', marginBottom: '8px' }}>Share Contact Card</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={shareTelegram}
                  style={{ background: '#229ED9', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                >
                  Share to Telegram
                </button>
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  style={{ background: '#25D366', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
                >
                  Share to WhatsApp
                </button>
                <a
                  href={`mailto:${user?.email}?subject=Contact Card - ${user?.fullName || user?.username}`}
                  style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center' }}
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="info-edit-form">
            <div className="form-group">
              <label className="form-label" htmlFor="edit-fullname">Full Name</label>
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
              <label className="form-label" htmlFor="edit-email">Email Address</label>
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
              <label className="form-label" htmlFor="edit-phone">Phone Number</label>
              <input
                id="edit-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 ..."
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-username">Username</label>
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