import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle OAuth callback with token in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('token=')) {
      try {
        const token = new URLSearchParams(hash.replace('#', '?')).get('token');
        if (token) {
          localStorage.setItem('accessToken', token);
          // Clear hash from URL
          window.history.replaceState(null, null, window.location.pathname);
          navigate('/');
        }
      } catch (err) {
        console.error('Error parsing OAuth callback:', err);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.REACT_APP_API_URL}/api/auth/google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded shadow-2xl w-full max-w-md border border-neon-blue">
        <h2 className="text-3xl mb-2 text-center font-bold text-neon-blue">Eker AI</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">Control Center</p>
        
        {/* Email/Password Login */}
        <div className="mb-4">
          <label className="block mb-2 text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-blue focus:outline-none"
            placeholder="admin@eker.local"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:border-neon-blue focus:outline-none"
            placeholder="ChangeMe123!"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full p-2 bg-neon-blue text-black rounded font-bold hover:bg-blue-500 transition"
        >
          Sign In
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-2 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full p-2 bg-white text-black rounded font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-gray-500 text-xs mt-6">
          Default: admin@eker.local / ChangeMe123!
        </p>
      </form>
    </div>
  );
}
