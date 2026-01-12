import type { FC } from "react";
import { useState } from "react";
import NotificationDrawer from "./NotificationDrawer";
import LogoutModal from "./LogoutModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { persistor } from "../../store";
import { clearAuthData } from "../../store/Auth";
import AuthAPI from "../../api/authApi/AuthAPI";

const Navbar: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogoutConfirm = async () => {
    try {
      setLoading(true);

      const fcmPushToken = localStorage.getItem("fcmPushToken");

      if (fcmPushToken) {
        await AuthAPI.Logout({ fcmPushToken });
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch(clearAuthData());
      await persistor.purge();
      localStorage.removeItem("fcmPushToken");
      localStorage.removeItem("token");
      localStorage.removeItem("privateKey");
      localStorage.removeItem("publicKey");
      setShowLogoutModal(false);
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <header className="flex items-center justify-between xl:px-14 lg:px-6 md:px-8 md:pl-20 py-3 shadow-sm bg-white">
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
            className="w-6 h-6 cursor-pointer"
          />
          <span className="absolute top-2 right-3 h-3 w-3 rounded-full" />
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
          loading={loading}
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
