"use client";

import { useNavigate } from "react-router-dom";

interface TopbarProps {
  title: string;
}

const Topbar = ({ title }: TopbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white p-4 shadow-sm border-b border-gray-300 mt-1">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-Regular capitalize text-gray-800">
          {title}
        </h1>

        <div className="flex items-center gap-4 pr-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
            <img
              src="/icons/calender-icon.svg"
              alt="Calendar"
              width={24}
              height={24}
            />
          </button>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src="/icons/User.svg"
              alt="User Profile"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
