import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ playerName, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        style={{ fontFamily: 'var(--font-primary)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <div>
              <h3
                className="text-xl font-bold text-[#111827]"
                style={{ fontFamily: 'var(--font-primary)' }}
              >
                Delete Player
              </h3>
              <p className="mt-0.5 text-sm text-[#6b7280]">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-base text-[#374151]">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-[#111827]">{playerName}</span>? This will
            permanently remove the player from the database.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onCancel}
            className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Delete Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
