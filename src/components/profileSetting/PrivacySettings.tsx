import React, { useState } from "react";
import { Radio } from "antd";
import { GlobalOutlined, LockOutlined } from "@ant-design/icons";

const PrivacySettings: React.FC = () => {
  const [privacy, setPrivacy] = useState("public");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-black text-2xl font-medium mb-2">
          Privacy Settings
        </h2>
        <p className="text-[#666666] text-sm font-normal">
          Control who can view your profile, send messages, or interact with
          your posts.
        </p>
      </div>

      <Radio.Group
        onChange={(e) => setPrivacy(e.target.value)}
        value={privacy}
        className="space-y-6 max-w-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-3 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-white p-2 rounded-full">
              <GlobalOutlined className="text-lg text-gray-600" />
            </div>
            <div>
              <div className="text-black text-base font-medium">
                Public Account
              </div>
              <div className="text-[#666666] text-xs font-normal">
                Anyone can view your profile and posts.
              </div>
            </div>
          </div>
          <Radio value="public" />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-white p-2 rounded-full">
              <LockOutlined className="text-lg text-gray-600" />
            </div>
            <div>
              <div className="text-black text-base font-medium">
                Private Account
              </div>
              <div className="text-[#666666] text-xs font-normal">
                Only contacts can see your posts and profile details.
              </div>
            </div>
          </div>
          <Radio value="private" />
        </div>
      </Radio.Group>
    </div>
  );
};

export default PrivacySettings;