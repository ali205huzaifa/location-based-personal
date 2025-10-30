import React, { useState } from "react";
import { Switch } from "antd";
import { GlobalOutlined, LockOutlined } from "@ant-design/icons";

const PrivacySettings: React.FC = () => {
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Privacy Settings
        </h2>
        <p className="text-sm text-gray-600">
          Control who can view your profile, send messages, or interact with
          your posts.
        </p>
      </div>

      <div className="space-y-6 max-w-lg">
        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <GlobalOutlined className="text-lg text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Public Account</div>
              <div className="text-sm text-gray-500">
                Anyone can view your profile and posts
              </div>
            </div>
          </div>
          <Switch
            checked={isPublic}
            onChange={(checked) => setIsPublic(checked)}
            className={`bg-purple-600 ${isPublic ? "" : "bg-gray-300"}`}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white">
          <div className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-full">
              <LockOutlined className="text-lg text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Private Account</div>
              <div className="text-sm text-gray-500">
                Only contacts can see your posts and profile details.
              </div>
            </div>
          </div>
          <Switch
            checked={!isPublic}
            onChange={(checked) => setIsPublic(!checked)}
            className={`bg-purple-600 ${!isPublic ? "" : "bg-gray-300"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
