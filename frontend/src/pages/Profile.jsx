import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const user = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <div className="space-y-2">
          <div className="text-sm text-gray-600 dark:text-gray-300">Name: <span className="font-medium">{user?.name || '-'}</span></div>
          <div className="text-sm text-gray-600 dark:text-gray-300">UPI ID: <span className="font-medium">{user?.upiId || '-'}</span></div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Phone: <span className="font-medium">{user?.phone || '-'}</span></div>
        </div>
        <div className="mt-4">
          <button onClick={logout} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">Log out</button>
        </div>
      </div>
    </div>
  );
}
