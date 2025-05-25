// src/pages/user/Profile.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/Hackcloth.avif';
import Footer from '../../components/Footer';

const Profile: React.FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL =
    process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/email/send-login-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send login code');
      }

      setShowCodeInput(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/email/verify-email-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to profile page after login
      navigate('/profile-page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Logo at the top */}
        <div className="mb-8">
          <Link to="/">
            <img src={logo} alt="Hackcloth Logo" className="h-10" />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-sm border border-gray-200">
          {!showCodeInput ? (
            <>
              <h2 className="text-xl font-semibold mb-6 text-center">Log in</h2>
              <p className="text-gray-600 mb-6 text-center text-sm">
                Enter your email to receive a login code
              </p>

              <form onSubmit={handleSendCode}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Continue'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6 text-center">
                Enter code
              </h2>
              <p className="text-gray-600 mb-2 text-center text-sm">
                Sent to {email}
              </p>
              <p className="text-gray-600 mb-6 text-center text-sm">
                6-digit code
              </p>

              <form onSubmit={handleVerifyCode}>
                <input
                  type="text"
                  placeholder="------"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(value);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-1 focus:ring-black text-center text-xl tracking-widest font-mono"
                  maxLength={6}
                  required
                />
                {error && (
                  <div className="text-red-500 text-sm mb-4 text-center">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Submit'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowCodeInput(false)}
                  className="text-sm text-gray-600 hover:text-black transition"
                >
                  Log in with a different email
                </button>
              </div>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <Link
              to="/privacy"
              className="text-xs text-gray-500 hover:text-black transition"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
