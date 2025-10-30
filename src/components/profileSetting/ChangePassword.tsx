import React, { useState } from "react";
import { Input, Button } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //   const [showCurrent, setShowCurrent] = useState(false);
  //   const [showNew, setShowNew] = useState(false);
  //   const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Change Password
        </h2>
        <p className="text-sm text-gray-600">
          Secure your account by setting a new password whenever you want.
        </p>
      </div>

      <div className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <Input.Password
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter Current password"
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined className="text-gray-400" />
              ) : (
                <EyeInvisibleOutlined className="text-gray-400" />
              )
            }
            className="h-11 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined className="text-gray-400" />
              ) : (
                <EyeInvisibleOutlined className="text-gray-400" />
              )
            }
            className="h-11 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Reenter your password"
            iconRender={(visible) =>
              visible ? (
                <EyeOutlined className="text-gray-400" />
              ) : (
                <EyeInvisibleOutlined className="text-gray-400" />
              )
            }
            className="h-11 rounded-lg"
          />
        </div>

        <div className="pt-4">
          <Button
            type="primary"
            size="large"
            className="w-full sm:w-auto px-8 bg-purple-600 hover:bg-purple-700 border-none rounded-lg font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
