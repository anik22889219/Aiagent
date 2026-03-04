import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import NavBar from '../components/NavBar';

export default function Integrations() {
  const [tools, setTools] = useState([]);

  const fetchTools = async () => {
    try {
      const res = await api.get('/api/integrations/tools');
      setTools(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const toggle = async (id) => {
    try {
      await api.patch(`/api/integrations/tools/${id}`);
      fetchTools();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <NavBar />
      <h2 className="text-2xl mb-4">Integrations</h2>
      <ul>
        {tools.map((t) => (
          <li key={t._id} className="mb-2 p-2 bg-gray-800 rounded flex justify-between items-center">
            <span>{t.name}</span>
            <button onClick={() => toggle(t._id)} className="p-1 bg-gray-700 rounded">
              {t.enabled ? 'Disable' : 'Enable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
