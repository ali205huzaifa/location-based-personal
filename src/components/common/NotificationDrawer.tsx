import React from "react";
import { Drawer, Avatar } from "antd";
import { MessageOutlined, HeartFilled, ClockCircleOutlined } from "@ant-design/icons";

interface Notification {
  id: number;
  type: "reply" | "like";
  users: { name: string; username: string; avatar: string }[];
  content: string;
  time: string;
}

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ visible, onClose }) => {
  const notifications: Notification[] = [
    {
      id: 1,
      type: "reply",
      users: [
        {
          name: "Kathrine Davis",
          username: "@Kathrine12",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
      ],
      content: "replied to your comment",
      time: "3m ago",
    },
    {
      id: 2,
      type: "like",
      users: [
        {
          name: "Kathrine Davis",
          username: "@Kathrine12",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
          name: "David Holmes",
          username: "@david69",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        },
      ],
      content: "liked your post",
      time: "3m ago",
    },
  ];

  return (
    <Drawer
      title={<span className="font-semibold text-gray-800">Notifications</span>}
      placement="right"
      onClose={onClose}
      open={visible}
      width={360}
      bodyStyle={{
        padding: "16px",
        backgroundColor: "#fff",
      }}
    >
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
          >
            <div className="flex -space-x-2">
              {notif.users.map((user, idx) => (
                <Avatar
                  key={idx}
                  src={user.avatar}
                  size={38}
                  className="border-2 border-white"
                />
              ))}
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-tight">
                {notif.users.length > 1 ? (
                  <>
                    <span className="font-medium text-gray-900">
                      {notif.users[0].username}
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-gray-900">
                      {notif.users[1].username}
                    </span>{" "}
                    {notif.content}
                  </>
                ) : (
                  <>
                    <span className="font-medium text-gray-900">
                      {notif.users[0].username}
                    </span>{" "}
                    {notif.content}
                  </>
                )}
              </p>

              <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                {notif.type === "reply" ? (
                  <MessageOutlined className="text-purple-500" />
                ) : (
                  <HeartFilled className="text-red-500" />
                )}
                <ClockCircleOutlined className="ml-2" />
                <span>{notif.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default NotificationDrawer;
