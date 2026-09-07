import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProfileOverview from './components/ProfileOverview';
import SecuritySettings from './components/SecuritySettings';
import DangerZone from './components/DangerZone';
import AdminPanel from './components/AdminPanel';

function Dashboard({ user, setUser, logout }) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        logout={logout}
      />
      <section className="dashboard-content-area">
        {activeTab === 'profile' && (
          <ProfileOverview user={user} setUser={setUser} />
        )}
        {activeTab === 'security' && (
          <SecuritySettings user={user} setUser={setUser} />
        )}
        {activeTab === 'danger' && (
          <DangerZone user={user} logout={logout} />
        )}
        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminPanel currentUser={user} />
        )}
      </section>
    </div>
  );
}

export default Dashboard;