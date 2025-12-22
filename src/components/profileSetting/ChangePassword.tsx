import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import ProfileAPI from "../../api/profileApi/ProfileAPI";

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();
  const { token } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!token) {
      message.error("You must be logged in to change your password.");
      return;
    }

    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    setLoading(true);
    try {
      await ProfileAPI.ChangePassword(payload, token);
      message.success("Password updated successfully!");
      form.resetFields();
    } catch (error: any) {
      console.error("Password change error:", error);
      const errMsg =
        error?.response?.data?.message ||
        "Failed to update password. Please try again.";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-black text-2xl font-medium mb-2">
          Change Password
        </h2>
        <p className="text-[#666666] text-sm font-normal">
          Secure your account by setting a new password whenever you want.
        </p>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-6 w-full pr-8"
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          className="text-[#000000] text-sm font-normal"
          rules={[
            { required: true, message: "Please enter your current password" },
          ]}
        >
          <Input.Password
            placeholder="Enter current password"
            iconRender={(visible) =>
              visible ? (
                <img
                  src="/icons/eyeOpen-icon.svg"
                  alt="Show"
                  width={20}
                  height={20}
                />
              ) : (
                <img
                  src="/icons/eyeClose-icon.svg"
                  alt="Hide"
                  width={20}
                  height={20}
                />
              )
            }
            size="large"
            className="rounded-xl !h-12 border border-gray-300 placeholder:text-[#C3C3C3] text-black text-base font-normal bg-[#FFFFFF] focus:!border-[#8869F3] hover:!border-[#8869F3]"
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          className="text-[#000000] text-sm font-normal"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            {
              min: 8,
              message:
                "Password must be at least 8 characters including a number and a special character",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter new password"
            iconRender={(visible) =>
              visible ? (
                <img
                  src="/icons/eyeOpen-icon.svg"
                  alt="Show"
                  width={20}
                  height={20}
                />
              ) : (
                <img
                  src="/icons/eyeClose-icon.svg"
                  alt="Hide"
                  width={20}
                  height={20}
                />
              )
            }
            size="large"
            className="rounded-xl !h-12 border border-gray-300 placeholder:text-[#C3C3C3] text-black text-base font-normal bg-[#FFFFFF] focus:!border-[#8869F3] hover:!border-[#8869F3]"
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          className="text-[#000000] text-sm font-normal"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Re-enter new password"
            iconRender={(visible) =>
              visible ? (
                <img
                  src="/icons/eyeOpen-icon.svg"
                  alt="Show"
                  width={20}
                  height={20}
                />
              ) : (
                <img
                  src="/icons/eyeClose-icon.svg"
                  alt="Hide"
                  width={20}
                  height={20}
                />
              )
            }
            size="large"
            className="rounded-xl !h-12 border border-gray-300 placeholder:text-[#C3C3C3] text-black text-base font-normal bg-[#FFFFFF] focus:!border-[#8869F3] hover:!border-[#8869F3] "
          />
        </Form.Item>

        <Form.Item className="flex justify-end pt-4">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
            className="!h-12 sm:w-auto px-8 !bg-[#8869F3] border-none rounded-xl !text-white text-sm font-normal"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
