import React from "react";
import { Form, Input, Button } from "antd";

const ChangePassword: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Password Change Data:", values);
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
        className="space-y-6 max-w-xl"
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          className="text-[#000000] text-sm font-normal"
          rules={[{ required: true, message: "Please enter your current password" }]}
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
            className="rounded-xl !h-12 border border-gray-300 text-[#C3C3C3] text-xs font-normal"
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          className="text-[#000000] text-sm font-normal"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 6, message: "Password must be at least 6 characters" },
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
            className="rounded-xl !h-12 border border-gray-300 text-[#C3C3C3] text-xs font-normal"
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
            className="rounded-xl !h-12 border border-gray-300 text-[#C3C3C3] text-xs font-normal"
          />
        </Form.Item>

        <Form.Item className="flex justify-end pt-4">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="!h-12 sm:w-auto px-8 bg-[#8869F3] hover:bg-purple-700 border-none rounded-xl text-white text-sm font-normal"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
