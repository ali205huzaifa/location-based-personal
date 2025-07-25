import React from "react";

type LogoutModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-lg p-6 w-[500px] text-center relative shadow-xl border border-[#D9D9D9]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          <img
            src="/icons/cross-icon.svg"
            alt="Close Icon"
            width={22}
            height={22}
            className="py-2"
          />
        </button>
        <p className="text-lg font-semibold mb-6">Do you want to Logout?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#16968F] hover:bg-emerald-700 text-white px-12 py-2 rounded"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="border px-12 py-2 rounded text-black"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
