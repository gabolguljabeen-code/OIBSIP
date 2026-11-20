import React, { createContext, useContext, useState } from 'react';
import api from '../api/client';

const C = createContext(null);

export const demoAccounts = [
  {
    label: 'Customer demo',
    email: 'demo@crustandco.com',
    password: 'CrustDemo123!',
    user: { id: 'demo-customer', name: 'Demo Customer', email: 'demo@crustandco.com', role: 'customer' }
  },
  {
    label: 'Kitchen admin demo',
    email: 'kitchen@crustandco.com',
    password: 'KitchenDemo123!',
    user: { id: 'demo-admin', name: 'Demo Kitchen Admin', email: 'kitchen@crustandco.com', role: 'admin' }
  }
];

export const useAuth = () => useContext(C);

function savedUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(savedUser);

  async function login(email, password, admin = false) {
    const normalizedEmail = email.trim().toLowerCase();
    const demo = demoAccounts.find(account => account.email === normalizedEmail);

    if (demo) {
      if (demo.password !== password) throw new Error('That demo password is not correct.');
      if (admin !== (demo.user.role === 'admin')) {
        throw new Error(demo.user.role === 'admin'
          ? 'Use the Admin sign in page for the kitchen demo.'
          : 'Use the customer sign in page for this demo.');
      }
      localStorage.setItem('demoMode', 'true');
      localStorage.removeItem('token');
      localStorage.setItem('user', JSON.stringify(demo.user));
      setUser(demo.user);
      return demo.user;
    }

    localStorage.removeItem('demoMode');
    const { data } = await api.post(admin ? '/admin/auth/login' : '/auth/login', { email: normalizedEmail, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem('demoMode');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  return <C.Provider value={{ user, login, logout, demoAccounts, isDemo: localStorage.getItem('demoMode') === 'true' }}>{children}</C.Provider>;
}
