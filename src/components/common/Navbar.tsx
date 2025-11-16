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
        <div
          className="relative rounded-full bg-[#F9FAFB] p-3"
          onClick={() => setIsNotifOpen(true)}
        >
          <img
            src="/icons/notification-icon.svg"
            alt="Bell Icon"
            className="w-6 h-6 text-xl cursor-pointer"
          />
          <span className="absolute top-2 right-3 h-3 w-3 bg-[#8869F3] rounded-full border-2 border-white"></span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-right leading-tight">
            <span className="text-black text-base font-normal">
              {user?.fullName}
            </span>
            <span className="text-[#666666] text-sm font-normal">
              @{user?.username}
            </span>
          </div>
          <Avatar
            size={50}
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
