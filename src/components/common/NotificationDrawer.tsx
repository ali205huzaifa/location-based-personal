import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Drawer, Avatar, Spin, Tooltip } from "antd";
import PostAPI from "../../api/postApi/PostAPI";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface ApiNotification {
  _id: string;
  userId: string;
  senderId: {
    _id: string;
    fullName: string;
    username: string;
    image?: string;
  };
  type: "like" | "contact" | "reply" | "comment";
  entityId: string;
  entityType: "Post" | string;
  content: string;
  status: "read" | "unread";
  createdAt: string;
  updatedAt: string;
}

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const LIMIT = 10;

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  visible,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  useEffect(() => {
    if (visible) {
      setNotifications([]);
      setPage(1);
      setHasNext(true);
      fetchNotifications(1, true);
    }
  }, [visible]);

  const fetchNotifications = async (pageNumber: number, initial = false) => {
    try {
      initial ? setLoading(true) : setLoadingMore(true);

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
      setLoading(false);
      setLoadingMore(false);
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

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;

      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 80 &&
        hasNext &&
        !loadingMore
      ) {
        fetchNotifications(page + 1);
      }
    },
    [page, hasNext, loadingMore]
  );

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
        body: { padding: 0, backgroundColor: "#fff" },
      }}
    >
      <div className="h-full overflow-y-auto p-4" onScroll={handleScroll}>
        {loading ? (
          <div className="flex justify-center mt-10">
            <Spin />
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleMarkRead(notif)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer
                    hover:bg-gray-50
                    ${notif.status === "unread" ? "bg-gray-50" : ""}`}
                >
                  <Avatar
                    src={
                      notif.senderId?.image ||
                      "/images/default-chat-profile.svg"
                    }
                    size={48}
                  />

                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-medium">
                        @{notif.senderId.username}
                      </span>{" "}
                      {notif.content.replace(`${notif.senderId.username} `, "")}
                    </p>

                    <span className="text-xs text-gray-400">
                      {dayjs(notif.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {loadingMore && (
              <div className="flex justify-center py-4">
                <Spin size="small" />
              </div>
            )}

            {!notifications.length && (
              <p className="text-center text-gray-400 text-sm mt-6">
                No notifications yet
              </p>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default NotificationDrawer;
