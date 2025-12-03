import type { FC } from "react";
import { useState } from "react";
import NotificationDrawer from "./NotificationDrawer";
import LogoutModal from "./LogoutModal";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { persistor } from "../../store";
import { clearAuthData } from "../../store/Auth";

const Navbar: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    dispatch(clearAuthData());
    persistor.purge();
    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-14 py-3 shadow-sm bg-white">
      <div className="flex items-center">
        <img
          src="/icons/logo.svg"
          alt="Logo"
          className="h-12 w-auto object-contain cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-6">
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

        <div
          className="flex items-center gap-2 cursor-pointer px-2 py-3 hover:bg-red-100 max-w-[145px] hover:rounded-xl"
          onClick={() => setShowLogoutModal(true)}
        >
          <img src="/icons/logout-icon.svg" alt="icon" width={24} height={24} />
          <p className="text-[#FF5D5D] text-base font-normal">Logout</p>
        </div>

        <LogoutModal
          open={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
        />
      </div>

      <NotificationDrawer
        visible={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </header>
  );
};

export default Navbar;
