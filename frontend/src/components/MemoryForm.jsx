import React, { useState } from 'react';
import api from '../utils/api';

export default function MemoryForm({ onAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('dev');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/memory', { title, content, category });
      setTitle('');
      setContent('');
      setCategory('dev');
      if (onAdded) onAdded();
    } catch (err) {
      console.error(err);
      alert('Failed to add memory');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-800 rounded">
      <h3 className="text-xl mb-2">Add Memory</h3>
      <div className="mb-2">
        <label className="block mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="dev">Dev</option>
          <option value="marketing">Marketing</option>
          <option value="automation">Automation</option>
          <option value="business">Business</option>
        </select>
      </div>
      <button type="submit" className="p-2 bg-neon-blue text-black rounded">
        Add
      </button>
    </form>
  );
}
