import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useSocket } from '../hooks/useSocket';
import TaskForm from '../components/TaskForm';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchTasks();
    // subscribe to realtime updates
    useSocket('/api/agent', {
      'task:created': fetchTasks,
      'task:updated': fetchTasks,
      'task:paused': fetchTasks,
      'task:resumed': fetchTasks,
      'task:canceled': fetchTasks,
    });
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (id, data) => {
    try {
      await api.patch(`/api/tasks/${id}`, data);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const requestCancel = (id) => {
    setConfirmAction(() => () => updateTask(id, { status: 'canceled' }));
    setConfirmOpen(true);
  };

  return (
    <div className="p-8">
      <nav className="mb-6">
        <a href="/" className="mr-4 text-neon-blue">Dashboard</a>
        <a href="/tasks" className="mr-4 text-neon-blue">Tasks</a>
      </nav>
      <h2 className="text-2xl mb-4">Tasks</h2>
      <TaskForm onCreated={fetchTasks} />
      <ul>
        {tasks.map((t) => (
          <li key={t._id} className="mb-2 p-2 bg-gray-800 rounded flex justify-between items-center">
            <div>
              {t.title} - {t.status}
            </div>
            <div className="space-x-2">
              {t.status === 'running' && <button onClick={() => updateTask(t._id, { status: 'paused' })} className="text-yellow-400">Pause</button>}
              {t.status === 'paused' && <button onClick={() => updateTask(t._id, { status: 'pending' })} className="text-green-400">Resume</button>}
              {t.status !== 'canceled' && t.status !== 'completed' && <button onClick={() => requestCancel(t._id)} className="text-red-400">Cancel</button>}
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={confirmOpen}
        message="Are you sure you want to cancel this task?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (confirmAction) confirmAction();
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}
