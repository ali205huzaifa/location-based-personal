import React, { useCallback } from "react";
import { Drawer, Avatar, Spin, Tooltip, Button } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { ApiNotification } from "../../types/notification";

dayjs.extend(relativeTime);

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
  notifications: ApiNotification[];
  loading: boolean;
  loadingMore: boolean;
  markingAll: boolean;
  processingIds: string[];
  unreadCount: number;
  onLoadMore: () => void;
  onMarkRead: (notif: ApiNotification) => void;
  onMarkAllAsRead: () => void;
  onAccept: (notif: ApiNotification) => void;
  onDecline: (notif: ApiNotification) => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  visible,
  onClose,
  notifications,
  loading,
  loadingMore,
  markingAll,
  processingIds,
  unreadCount,
  onLoadMore,
  onMarkRead,
  onMarkAllAsRead,
  onAccept,
  onDecline,
}) => {
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;

      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 80 &&
        !loadingMore
      ) {
        onLoadMore();
      }
    },
    [loadingMore, onLoadMore]
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
              onClick={onMarkAllAsRead}
              disabled={!unreadCount || markingAll}
              className={`p-2 rounded-lg transition ${unreadCount
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
                  onClick={() => onMarkRead(notif)}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer
                    hover:bg-gray-50
                    ${notif.status === "unread" ? "bg-[#8869F3]/20" : ""}`}
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

                    {notif.type === "contact" && notif.status === "unread" && (
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="primary"
                          size="large"
                          className="!bg-[#8869F3] w-28"
                          loading={processingIds.includes(notif._id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept(notif);
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          danger
                          size="large"
                          className="w-28"
                          loading={processingIds.includes(notif._id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDecline(notif);
                          }}
                        >
                          Decline
                        </Button>
                      </div>
                    )}
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
