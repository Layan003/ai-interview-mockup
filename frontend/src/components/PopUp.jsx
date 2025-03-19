import React from "react";

export default function PopUp({ proceed, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/30 z-50">
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <p className="mb-4">
          Your answer seems too short. Are you sure you want to proceed?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary-hover transition-all px-4 py-2 text-white rounded-lg shadow-md"
          >
            Go back
          </button>
          <button
            onClick={proceed}
            className="bg-primary hover:bg-primary-hover transition-all px-4 py-2 text-white rounded-lg shadow-md"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
