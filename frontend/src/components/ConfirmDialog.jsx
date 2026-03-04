import React from 'react';

export default function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="text-right">
          <button onClick={onCancel} className="mr-4 p-2 bg-gray-700 rounded">Cancel</button>
          <button onClick={onConfirm} className="p-2 bg-red-600 rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
}
