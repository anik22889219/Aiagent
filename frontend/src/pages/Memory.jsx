import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import MemoryForm from '../components/MemoryForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Memory() {
  const [memories, setMemories] = useState([]);
  const [query, setQuery] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchMemories = async (search) => {
    try {
      const url = search ? `/api/memory/search?query=${encodeURIComponent(search)}` : '/api/memory';
      const res = await api.get(url);
      setMemories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMemories(query);
  };

  return (
    <div className="p-8">
      <nav className="mb-6">
        <a href="/" className="mr-4 text-neon-blue">Dashboard</a>
        <a href="/tasks" className="mr-4 text-neon-blue">Tasks</a>
        <a href="/memory" className="mr-4 text-neon-blue">Memory</a>
      </nav>
      <h2 className="text-2xl mb-4">Memory</h2>
      <MemoryForm onAdded={() => fetchMemories()} />
      <form onSubmit={handleSearch} className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search memories"
          className="p-2 rounded bg-gray-700 mr-2"
        />
        <button type="submit" className="p-2 bg-neon-blue text-black rounded">Search</button>
      </form>
      <ul>
        {memories.map((m) => (
          <li key={m._id} className="mb-2 p-2 bg-gray-800 rounded flex justify-between items-center">
            <div>
              <strong>{m.title}</strong><br />
              <span>{m.content}</span>
            </div>
            <button className="text-red-400" onClick={() => {
                setConfirmAction(() => async () => {
                  await api.delete(`/api/memory/${m._id}`);
                  fetchMemories();
                });
                setConfirmOpen(true);
              }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={confirmOpen}
        message="Delete this memory?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (confirmAction) confirmAction();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
