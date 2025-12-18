import React, { useEffect, useState, useMemo } from "react";
import { Drawer, Avatar, Spin, Tooltip } from "antd";
import PostAPI from "../../api/postApi/PostAPI";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface ApiNotification {
  _id: string;
  type: "like" | "contact" | "reply";
  content: string;
  status: "read" | "unread";
  createdAt: string;
  senderId: {
    _id: string;
    fullName: string;
    username: string;
    Image?: string;
  };
}

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  visible,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await PostAPI.getNotifications();
      setNotifications(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <span className="text-black text-base font-medium">
            Notifications
          </span>

          <Tooltip title="Mark all as read">
            <button
              onClick={handleMarkAllAsRead}
              disabled={!unreadCount || markingAll}
              className={`p-2 rounded-lg transition ${
                unreadCount
                  ? "hover:bg-gray-100 text-[#8869F3]"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              {markingAll ? (
                <Spin size="small" />
              ) : (
                <img
                  src={
                    unreadCount
                      ? "/icons/double-check-icon.svg"
                      : "/icons/single-tick-icon.svg"
                  }
                  alt="Icon"
                  className="h-6 w-6"
                />
              )}
            </button>
          </Tooltip>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={visible}
      closable={false}
      width={360}
      styles={{
        body: {
          padding: "16px",
          backgroundColor: "#fff",
        },
      }}
    >
      {loading ? (
        <div className="flex justify-center mt-10">
          <Spin />
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleMarkRead(notif)}
              className={`flex items-start space-x-3 p-3 rounded-xl transition cursor-pointer
                hover:bg-gray-50
                ${notif.status === "unread" ? "bg-gray-50" : ""}`}
            >
              <Avatar
                src={
                  notif.senderId?.Image || "/images/default-chat-profile.svg"
                }
                size={50}
                className="border-2 border-white"
              />

              <div className="flex-1">
                <p className="text-sm text-gray-800 leading-tight">
                  <span className="text-black font-medium">
                    @{notif.senderId?.username}
                  </span>{" "}
                  <span className="font-normal">
                    {notif.content.replace(notif.senderId?.username, "")}
                  </span>
                </p>

                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <span>{dayjs(notif.createdAt).fromNow()}</span>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No notifications yet
            </p>
          )}
        </div>
      )}
    </Drawer>
  );
};

export default NotificationDrawer;
