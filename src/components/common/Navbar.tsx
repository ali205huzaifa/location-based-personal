import type { FC } from "react";
import { useState, useEffect, useMemo } from "react";
import NotificationDrawer from "./NotificationDrawer";
import LogoutModal from "./LogoutModal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { persistor } from "../../store";
import { clearAuthData } from "../../store/Auth";
import AuthAPI from "../../api/authApi/AuthAPI";
import PostAPI from "../../api/postApi/PostAPI";
import { message } from "antd";
import type { ApiNotification } from "../../types/notification";

const LIMIT = 10;

const Navbar: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  const fetchNotifications = async (pageNumber: number, initial = false) => {
    try {
      initial ? setNotifLoading(true) : setLoadingMore(true);

      const res = await PostAPI.getNotifications({
        page: pageNumber,
        limit: LIMIT,
      });

      const resData = res.data;

      setNotifications((prev) =>
        initial ? resData.data : [...prev, ...resData.data]
      );

      setHasNext(resData.hasNext);
      setPage(resData.page);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setNotifLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, true);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.status === "unread").length,
    [notifications]
  );

  const handleMarkRead = async (notif: ApiNotification) => {
    if (notif.status === "read") return;

    try {
      await PostAPI.markRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, status: "read" } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!unreadCount) return;

    try {
      setMarkingAll(true);
      await PostAPI.markAllasRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleAccept = async (notif: ApiNotification) => {
    try {
      setProcessingIds((prev) => [...prev, notif._id]);
      await PostAPI.addToContact({ grantedTo: notif.senderId._id });
      message.success(`Added ${notif.senderId.username} to contacts`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, status: "read" } : n))
      );
    } catch (error) {
      message.error("Failed to add contact");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== notif._id));
    }
  };

  const handleDecline = async (notif: ApiNotification) => {
    try {
      setProcessingIds((prev) => [...prev, notif._id]);
      await PostAPI.RemoveContact(notif.senderId._id);
      message.success(`Declined contact from ${notif.senderId.username}`);
      setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
    } catch (error) {
      message.error("Failed to decline contact");
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== notif._id));
    }
  };

  const handleLoadMore = () => {
    if (hasNext && !loadingMore) {
      fetchNotifications(page + 1);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      setLogoutLoading(true);

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
      setLogoutLoading(false);
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
          {unreadCount > 0 && (
            <span className="absolute top-2 right-3 h-2.5 w-2.5 rounded-full bg-[#8869F3] border border-white" />
          )}
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
          loading={logoutLoading}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogoutConfirm}
        />
      </div>

      <NotificationDrawer
        visible={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        loading={notifLoading}
        loadingMore={loadingMore}
        markingAll={markingAll}
        processingIds={processingIds}
        unreadCount={unreadCount}
        onLoadMore={handleLoadMore}
        onMarkRead={handleMarkRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </header>
  );
};

export default Navbar;
