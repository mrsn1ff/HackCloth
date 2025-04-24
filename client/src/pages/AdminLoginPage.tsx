import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>(''); // ✅ Typed
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/admin/dashboard');
  }, [navigate]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await API.post('/admin/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed, please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 px-4">
      <h3 className="text-3xl font-semibold mb-5">Admin Login</h3>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
