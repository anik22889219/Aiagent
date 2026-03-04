import React, { useState } from 'react';
import api from '../utils/api';

export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('low');
  const [command, setCommand] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/tasks', { title, priority, command });
      setTitle('');
      setCommand('');
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert('Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-800 rounded">
      <h3 className="text-xl mb-2">New Task</h3>
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
        <label className="block mb-1">Command</label>
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 rounded bg-gray-700"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>
      <button type="submit" className="p-2 bg-neon-blue text-black rounded">
        Create
      </button>
    </form>
  );
}
