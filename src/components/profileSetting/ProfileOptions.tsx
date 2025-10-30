import React, { useState } from "react";
import {
  UserOutlined,
  BellOutlined,
  LockOutlined,
  SettingOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

import EditProfile from "./EditProfile";
import NotificationSettings from "./NotificationSettings";
import ChangePassword from "./ChangePassword";
import PrivacySettings from "./PrivacySettings";
import LanguageSettings from "./LanguageSettings";

const ProfileOptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Edit Profile");

  const menuItems = [
    { key: "Edit Profile", icon: <UserOutlined />, label: "Edit Profile" },
    { key: "Notifications", icon: <BellOutlined />, label: "Notifications" },
    {
      key: "Change Password",
      icon: <LockOutlined />,
      label: "Change Password",
    },
    {
      key: "Privacy Settings",
      icon: <SettingOutlined />,
      label: "Privacy Settings",
    },
    { key: "Language", icon: <GlobalOutlined />, label: "Language" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Edit Profile":
        return <EditProfile />;
      case "Notifications":
        return <NotificationSettings />;
      case "Change Password":
        return <ChangePassword />;
      case "Privacy Settings":
        return <PrivacySettings />;
      case "Language":
        return <LanguageSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-white rounded-xl shadow-sm min-h-[600px]">
      <div className="w-72 border-r border-gray-100 pr-4">
        <div className="flex flex-col space-y-2">
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all 
                ${
                  activeTab === item.key
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <Card className="h-full rounded-xl border-gray-100 shadow-none">
          {renderContent()}
        </Card>
      </div>
    </div>
  );
};

export default ProfileOptions;
