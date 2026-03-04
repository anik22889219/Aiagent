import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import NavBar from '../components/NavBar';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [autoRestart, setAutoRestart] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // stub: fetch autoRestart and update flag from backend later
  useEffect(() => {
    // TODO: get settings from API
  }, []);

  const toggleAuto = () => setAutoRestart((v) => !v);

  return (
    <div className="p-8">
      <NavBar />
      <h2 className="text-2xl mb-4">Settings</h2>
      <div className="mb-4">
        <label className="mr-2">Dark Mode:</label>
        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
      </div>
      <div className="mb-4">
        <label className="mr-2">Agent Auto-Restart:</label>
        <input type="checkbox" checked={autoRestart} onChange={toggleAuto} />
      </div>
      {updateAvailable && (
        <div className="p-4 bg-yellow-500 text-black rounded">
          New system update available! <button className="underline">View details</button>
        </div>
      )}
    </div>
  );
}
