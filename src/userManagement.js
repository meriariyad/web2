// userManagement.js
const USERS_KEY = 'lab_users';
const CURRENT_USER_KEY = 'lab_current_user';

const defaultUsers = [
  {
    username: 'admin',
    password: '1234',
    fullName: 'Administrator',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: 'Jan 15, 2026'
  }
];

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    const parsed = JSON.parse(data);
    return parsed.map((u) => ({
      ...u,
      role: u.role || (u.username.toLowerCase() === 'admin' ? 'admin' : 'user'),
      createdAt: u.createdAt || 'Jan 15, 2026'
    }));
  } catch {
    return defaultUsers;
  }
}

export function registerUser(username, password, fullName = '', email = '') {
  const users = getUsers();
  const exists = users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (exists) {
    return { success: false, message: 'Username already exists' };
  }

  const isFirstOrAdmin = users.length === 0 || username.toLowerCase() === 'admin';
  const newUser = {
    username,
    password,
    fullName: fullName.trim(),
    email: email.trim(),
    role: isFirstOrAdmin ? 'admin' : 'user',
    createdAt: getFormattedDate()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, user: newUser };
}

export function authenticateUser(username, password) {
  const users = getUsers();
  const matched = users.find(
    (u) => u.username === username && u.password === password
  );

  if (matched) {
    return { success: true, user: matched };
  }
  return { success: false, message: 'Invalid username or password' };
}

export function updateUser(oldUsername, newUsername, newPassword, fullName = '', email = '') {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.username === oldUsername);

  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }

  // If changing username, check if new username already exists for another user
  if (
    newUsername.toLowerCase() !== oldUsername.toLowerCase() &&
    users.some((u) => u.username.toLowerCase() === newUsername.toLowerCase())
  ) {
    return { success: false, message: 'New username already exists' };
  }

  const existing = users[userIndex];
  const updatedUser = {
    ...existing,
    username: newUsername,
    password: newPassword || existing.password,
    fullName: fullName !== undefined ? fullName.trim() : (existing.fullName || ''),
    email: email !== undefined ? email.trim() : (existing.email || ''),
    role: existing.role || (newUsername.toLowerCase() === 'admin' ? 'admin' : 'user'),
    createdAt: existing.createdAt || getFormattedDate()
  };

  users[userIndex] = updatedUser;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setCurrentUser(updatedUser);

  return { success: true, user: updatedUser };
}

export function changeUserPassword(username, currentPassword, newPassword) {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.username === username);

  if (userIndex === -1) {
    return { success: false, message: 'User not found' };
  }

  const user = users[userIndex];
  if (user.password !== currentPassword) {
    return { success: false, message: 'Current password does not match.' };
  }

  user.password = newPassword;
  users[userIndex] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  setCurrentUser(user);

  return { success: true, message: 'Password updated successfully!', user };
}

export function deleteUser(username) {
  const users = getUsers();
  const filteredUsers = users.filter((u) => u.username !== username);
  localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  
  const current = getCurrentUser();
  if (current && current.username === username) {
    setCurrentUser(null);
  }
  return { success: true };
}

// Admin specific management functions
export function adminResetPassword(targetUsername, newPassword) {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.username === targetUsername);

  if (userIndex === -1) {
    return { success: false, message: 'Target user not found' };
  }

  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const current = getCurrentUser();
  if (current && current.username === targetUsername) {
    setCurrentUser(users[userIndex]);
  }

  return { success: true, message: `Password for ${targetUsername} has been reset.` };
}

export function adminDeleteUser(targetUsername) {
  const current = getCurrentUser();
  if (current && current.username === targetUsername) {
    return { success: false, message: 'You cannot delete your own active admin account from here.' };
  }

  return deleteUser(targetUsername);
}

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      role: parsed.role || (parsed.username.toLowerCase() === 'admin' ? 'admin' : 'user'),
      createdAt: parsed.createdAt || 'Jan 15, 2026'
    };
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}
