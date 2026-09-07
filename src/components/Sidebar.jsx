function Sidebar({ activeTab, setActiveTab, user, logout }) {
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

  const navItems = [
    { id: 'profile', label: 'Profile Overview' },
    { id: 'security', label: 'Security & Password' },
    { id: 'danger', label: 'Danger Zone' }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Directory' });
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-avatar">{getInitials()}</div>
        <div className="sidebar-user-meta">
          <strong className="sidebar-name">{user?.fullName || user?.username}</strong>
          <span className="sidebar-role">
            {isAdmin ? 'Administrator' : 'Member'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`sidebar-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="sidebar-tab-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="btn-sidebar-logout"
          onClick={logout}
          title="Sign out of your account"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
