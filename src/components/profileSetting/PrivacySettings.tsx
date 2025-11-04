import React, { useState, useEffect } from "react";
import { Radio, message } from "antd";
import { GlobalOutlined, LockOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setAuthData } from "../../store/Auth";
import ProfileAPI from "../../api/profileApi/ProfileAPI";

const PrivacySettings: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state: RootState) => state.auth);

  const [privacy, setPrivacy] = useState<string>(
    currentUser?.privacy || "PUBLIC"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.privacy) {
      setPrivacy(currentUser.privacy);
    }
  }, [currentUser]);

  const handleChange = async (value: string) => {
    if (!token) {
      message.error("You must be logged in to update privacy settings.");
      return;
    }

    setPrivacy(value);
    setLoading(true);

    try {
      await ProfileAPI.UpdatePrivacy({ privacy: value }, token);

      dispatch(
        setAuthData({
          token,
          currentUser: { ...currentUser, privacy: value },
        })
      );

      message.success("Privacy settings updated successfully.");
    } catch (error: any) {
      console.error("Privacy update error:", error);
      message.error(
        error?.response?.data?.message ||
          "Failed to update privacy. Please try again."
      );
      setPrivacy(currentUser?.privacy || "PUBLIC");
    } finally {
      setLoading(false);
    }
  };

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
        onChange={(e) => handleChange(e.target.value)}
        value={privacy}
        className="space-y-6 max-w-2xl flex flex-col"
      >
        <div
          className={`flex items-center justify-between p-3 rounded-lg ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
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
          <Radio value="PUBLIC" />
        </div>

        <div
          className={`flex items-center justify-between p-3 rounded-lg ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
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
          <Radio value="PRIVATE" />
        </div>
      </Radio.Group>
    </div>
  );
};

export default PrivacySettings;
