import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './login';
import Register from './register';
import Dashboard from './dashboard';
import useUserState from './useUserState';
import './App.css';

function App() {
  const { user, setUser, isLoggedIn, login, logout } = useUserState();

  return (
    <BrowserRouter>
      <Navbar user={user} isLoggedIn={isLoggedIn} logout={logout} />
      <main className="main-container">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />}
          />
          <Route
            path="/login"
            element={<Login login={login} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/register"
            element={<Register isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard
                  key={user?.username}
                  user={user}
                  setUser={setUser}
                  logout={logout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;