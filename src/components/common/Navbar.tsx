import { BellOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import type { FC } from "react";
import { useState } from "react";
import NotificationDrawer from "./NotificationDrawer";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const Navbar: FC = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.currentUser);

  return (
    <header className="flex items-center justify-between px-14 py-3 shadow-sm bg-white">
      <div className="flex items-center">
        <img
          src="/icons/logo.svg"
          alt="Logo"
          className="h-12 w-auto object-contain cursor-pointer"
        />
      </div>

      <div className="flex items-center space-x-5">
        <div className="relative" onClick={() => setIsNotifOpen(true)}>
          <BellOutlined className="text-xl text-purple-500 cursor-pointer hover:text-purple-600 transition" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-purple-500 rounded-full border-2 border-white"></span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-right leading-tight">
            <span className="text-sm font-medium text-gray-900">
              {user?.fullName}
            </span>
            <span className="text-xs text-gray-500">@{user?.username}</span>
          </div>
          <Avatar
            size={38}
            src={user?.image}
            alt="Profile"
            className="border border-gray-200 shadow-sm"
          />
        </div>
      </div>

      <NotificationDrawer
        visible={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </header>
  );
};

export default Navbar;
