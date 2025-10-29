import React from 'react';
import { resetPassword } from '../lib/auth';

export default function Forgot() {
  const [form, setForm] = React.useState({ name: '', upiId: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = React.useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.upiId || !form.newPassword) { alert('Fill all fields'); return; }
    if (form.newPassword !== form.confirm) { alert('Passwords do not match'); return; }
    setBusy(true);
    try {
      await resetPassword({ name: form.name, upiId: form.upiId, newPassword: form.newPassword });
      alert('Password updated. You can now log in.');
    } catch (err) {
      alert(err?.response?.data?.msg || err.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-2xl border bg-white/90 backdrop-blur-md border-gray-200 text-gray-900 dark:bg-gray-900/70 dark:border-gray-700 dark:text-gray-100">
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={onChange} placeholder="Your Name" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          <input name="upiId" value={form.upiId} onChange={onChange} placeholder="yourname@bank" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          <input name="newPassword" type="password" value={form.newPassword} onChange={onChange} placeholder="New Password" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          <input name="confirm" type="password" value={form.confirm} onChange={onChange} placeholder="Confirm Password" className="w-full rounded-md border px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
          <button disabled={busy} className="w-full rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600">{busy?'Updating...':'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}
