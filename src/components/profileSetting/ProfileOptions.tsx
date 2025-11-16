import React, { useState } from "react";
import EditProfile from "./EditProfile";
import NotificationSettings from "./NotificationSettings";
import ChangePassword from "./ChangePassword";
import PrivacySettings from "./PrivacySettings";
import LanguageSettings from "./LanguageSettings";

const ProfileOptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Edit Profile");

  const menuItems = [
    {
      key: "Edit Profile",
      icon: <img src="/icons/profile-icon.svg" alt="Notifications" />,
      label: "Edit Profile",
    },
    {
      key: "Notifications",
      icon: <img src="/icons/bell-icon.svg" alt="Notifications" />,
      label: "Notifications",
    },
    {
      key: "Change Password",
      icon: <img src="/icons/lock-icon.svg" alt="Change Password" />,
      label: "Change Password",
    },
    {
      key: "Privacy Settings",
      icon: <img src="/icons/privacy-icon.svg" alt="Privacy Settings" />,
      label: "Privacy Settings",
    },
    {
      key: "Language",
      icon: <img src="/icons/language-icon.svg" alt="Language" />,
      label: "Language",
    },
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
    <div className="flex gap-6 px-2 pb-2 rounded-xl min-h-[600px]">
      <div className="xl:w-80 md:w-64 border-r border-l border-gray-200 xl:px-4 md:px-2 pt-4">
        <div className="flex flex-col space-y-2 gap-1">
          {menuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer 
                ${
                  activeTab === item.key
                    ? "bg-[#EFEFEF] text-gray-900"
                    : "text-gray-600 hover:bg-[#EFEFEF]"
                }`}
            >
              <span className="h-6 w-6">{item.icon}</span>
              <span className="text-base font-normal pl-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="w-full h-full rounded-xl border-gray-100 shadow-none">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileOptions;
