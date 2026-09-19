import React, { useState } from 'react';

export default function ContactCard() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const contact = {
    name: "Meria Riyad",
    title: "Software Engineering Student",
    organization: "A - Section A",
    phone: "+251 91 234 5678",
    email: "meria.dev@example.com",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Meria",
    verified: true
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`Copied ${label}!`);
    setTimeout(() => setCopyFeedback(''), 2200);
  };

  const shareTelegram = () => {
    const text =` Contact: ${contact.name} (${contact.phone}) - ${contact.email}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareWhatsApp = () => {
    const text =` Contact: ${contact.name} | Phone: ${contact.phone} | Email: ${contact.email}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={styles.page}>
      {copyFeedback && <div style={styles.toast}>{copyFeedback}</div>}

      <div style={styles.card}>
        {/* Top Action Bar: CRUD & Favorite */}
        <div style={styles.topBar}>
          <div style={styles.crudGroup}>
            <button style={styles.smallBtn} title="Add new contact" onClick={() => alert("Backend: Add Contact triggered")}>+ Add</button>
            <button style={styles.smallBtn} title="Edit contact" onClick={() => alert("Backend: Edit Contact triggered")}>Edit</button>
            <button style={{ ...styles.smallBtn, color: '#f87171' }} title="Delete" onClick={() => alert("Backend: Delete Contact triggered")}>Delete</button>
          </div>
          <button 
            style={styles.favoriteBtn} 
            onClick={() => setIsFavorite(!isFavorite)}
            title="Toggle Favorite"
          >
            {isFavorite ? '★ Favorited' : '☆ Favorite'}
          </button>
        </div>

        {/* Profile Header (Truecaller style) */}
        <div style={styles.profileHeader}>
          <img src={contact.avatar} alt="Avatar" style={styles.avatar} />
          <div>
            <div style={styles.nameRow}>
              <h2 style={styles.name}>{contact.name}</h2>
              {contact.verified && <span style={styles.badge} title="Verified Contact">✓ Verified</span>}
            </div>
            <p style={styles.subtext}>{contact.title}</p>
            <p style={styles.orgText}>{contact.organization}</p>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Contact Elements with Click-to-Copy */}
        <div style={styles.detailsList}>
          <div style={styles.detailItem}>
            <div>
              <span style={styles.fieldLabel}>Phone</span>
              <p style={styles.fieldValue}>{contact.phone}</p>
            </div>
            <button style={styles.copyBtn} onClick={() => handleCopy(contact.phone, 'Phone')}>
              Copy
            </button>
          </div>

          <div style={styles.detailItem}>
            <div>
              <span style={styles.fieldLabel}>Email</span>
              <p style={styles.fieldValue}>{contact.email}</p>
            </div>
            <button style={styles.copyBtn} onClick={() => handleCopy(contact.email, 'Email')}>
              Copy
            </button>
          </div>
        </div>

        {/* Share Section (Telegram, WhatsApp, Email) */}
        <div style={styles.shareSection}>
          <span style={styles.fieldLabel}>Share Contact Via</span>
          <div style={styles.shareButtons}>
            <button style={{ ...styles.shareBtn, background: '#229ED9' }} onClick={shareTelegram}>
            Telegram
            </button>
            <button style={{ ...styles.shareBtn, background: '#25D366' }} onClick={shareWhatsApp}>
              WhatsApp
            </button>
            <a 
              href={`mailto:${contact.email}?subject=Contact Information - ${contact.name}`} 
              style={{ ...styles.shareBtn, background: '#6366f1', textDecoration: 'none', textAlign: 'center' }}
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#f8fafc',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '430px',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)',
    border: '1px solid #334155',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  crudGroup: {
    display: 'flex',
    gap: '6px',
  },
  smallBtn: {
    background: '#334155',
    border: 'none',
    color: '#cbd5e1',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  favoriteBtn: {
    background: '#334155',
    border: '1px solid #475569',
    color: '#facc15',
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    backgroundColor: '#334155',
    border: '2px solid #38bdf8',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  name: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
  },
  badge: {
    background: '#0284c7',
    color: '#ffffff',
    fontSize: '11px',
    padding: '2px 7px',
    borderRadius: '12px',
    fontWeight: '600',
  },
  subtext: {
    margin: '3px 0 0',
    color: '#94a3b8',
    fontSize: '13px',
  },
  orgText: {
    margin: '2px 0 0',
    color: '#64748b',
    fontSize: '12px',
  },
  divider: {
    borderColor: '#334155',
    borderTop: 'none',
    margin: '18px 0',
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#0f172a',
    padding: '10px 14px',
    borderRadius: '10px',
  },
  fieldLabel: {
    fontSize: '11px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '700',
  },
  fieldValue: {
    margin: '2px 0 0',
    fontSize: '14px',
    color: '#e2e8f0',
  },
  copyBtn: {
    background: '#334155',
    border: 'none',
    color: '#38bdf8',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  shareSection: {
    marginTop: '18px',
  },
  shareButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginTop: '8px',
  },
  shareBtn: {
    border: 'none',
    color: '#ffffff',
    padding: '9px 0',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  toast: {
    position: 'fixed',
    top: '20px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    zIndex: 999,
  }
};1