import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const [tasksData, setTasksData] = useState([]);
  const [errorsData, setErrorsData] = useState([]);
  const [execData, setExecData] = useState([]);

  useEffect(() => {
    api.get('/api/analytics/tasks-per-day').then((r) => setTasksData(r.data));
    api.get('/api/analytics/error-frequency').then((r) => setErrorsData(r.data));
    api.get('/api/analytics/execution-times').then((r) => setExecData(r.data));
  }, []);

  return (
    <div className="p-8">
      <nav className="mb-6">
        <a href="/" className="mr-4 text-neon-blue">Dashboard</a>
        <a href="/tasks" className="mr-4 text-neon-blue">Tasks</a>
        <a href="/memory" className="mr-4 text-neon-blue">Memory</a>
        <a href="/analytics" className="mr-4 text-neon-blue">Analytics</a>
      </nav>
      <h2 className="text-2xl mb-4">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl mb-2">Tasks per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tasksData}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00ffff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="text-xl mb-2">Error Frequency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={errorsData}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#ff4d4d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded md:col-span-2">
          <h3 className="text-xl mb-2">Execution Time (avg ms)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={execData}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgTime" stroke="#66fcf1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
