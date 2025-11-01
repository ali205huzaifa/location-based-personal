import React, { useState } from "react";
import { Switch } from "antd";

const NotificationSettings: React.FC = () => {
  const [pushEnabled, setPushEnabled] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-black text-2xl font-medium mb-2">
          Notifications
        </h2>
        <p className="text-sm text-[#666666] font-normal">
          Manage alerts for messages, posts, and activities so you stay informed
          your way.
        </p>
      </div>

      <div className="flex items-center justify-between max-w-2xl">
        <div>
          <div className="text-black text-base font-normal">
            Push Notifications
          </div>
        </div>
        <Switch
          checked={pushEnabled}
          onChange={setPushEnabled}
          className={`bg-gray-300 ${pushEnabled ? "bg-purple-600" : ""}`}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
