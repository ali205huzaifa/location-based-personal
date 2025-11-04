import React, { useState, useEffect } from "react";
import { Switch, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setAuthData } from "../../store/Auth";
import ProfileAPI from "../../api/profileApi/ProfileAPI";

const NotificationSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { token, currentUser } = useSelector((state: RootState) => state.auth);

  const [pushEnabled, setPushEnabled] = useState<boolean>(
    currentUser?.notificationsEnabled || false
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.notificationsEnabled !== undefined) {
      setPushEnabled(currentUser.notificationsEnabled);
    }
  }, [currentUser]);

  const handleToggle = async (checked: boolean) => {
    if (!token) {
      message.error("You must be logged in to change notification settings.");
      return;
    }

    setPushEnabled(checked);
    setLoading(true);

    try {
      await ProfileAPI.UpdateNotificationInfo(
        { notificationsEnabled: checked },
        token
      );

      dispatch(
        setAuthData({
          token,
          currentUser: { ...currentUser, notificationsEnabled: checked },
        })
      );

      message.success(
        checked
          ? "Push notifications enabled successfully."
          : "Push notifications disabled successfully."
      );
    } catch (error: any) {
      console.error("Update error:", error);
      message.error("Failed to update notification settings. Try again.");
      setPushEnabled(!checked); // revert UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-black text-2xl font-medium mb-2">Notifications</h2>
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
          loading={loading}
          onChange={handleToggle}
          className={`bg-gray-300 ${pushEnabled ? "!bg-[#8869F3]" : ""}`}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
