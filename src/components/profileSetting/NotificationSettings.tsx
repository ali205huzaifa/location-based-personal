import React, { useState } from "react";
import { Switch } from "antd";

const NotificationSettings: React.FC = () => {
  const [pushEnabled, setPushEnabled] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Notifications
        </h2>
        <p className="text-sm text-gray-600">
          Manage alerts for messages, posts, and activities so you stay informed
          your way.
        </p>
      </div>

      <div className="flex items-center justify-between max-w-md">
        <div>
          <div className="text-sm font-medium text-gray-900">
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
