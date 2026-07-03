import React from "react";

const Dialogue = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="modal-box bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="font-bold text-lg text-slate-950 dark:text-white">Confirm!</h3>
        <p className="py-4 text-sm text-slate-600 dark:text-slate-400">
          Are you sure you want to logout?
        </p>
        <div className="modal-action flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all focus:outline-none"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-xl text-white bg-red-600 hover:bg-red-500 transition-all shadow-md shadow-red-500/10 focus:outline-none"
            onClick={onConfirm}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialogue;
