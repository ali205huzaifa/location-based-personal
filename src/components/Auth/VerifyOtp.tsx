import React, { useState } from "react";
import { Form, Button, Input, message, Spin } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerifyOTP = async (enteredOtp: string) => {
    try {
      setLoading(true);
      await AuthAPI.VerifyOTP({ otp: Number(enteredOtp) });
      message.success("OTP verified successfully!");
      setOtpVerified(true);
    } catch (err: any) {
      message.error("Please enter the correct OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New password and confirm password must match!");
      return;
    }

    try {
      setLoading(true);
      await AuthAPI.ResetPassword({
        email,
        newPassword: values.newPassword,
        otp: Number(otp),
      });
      message.success("Password changed successfully!");
      navigate("/");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center px-4 sm:px-6 md:px-10 pt-16 sm:pt-24 md:pt-40 relative"
      style={{ backgroundImage: `url('/images/login-Background.svg')` }}
    >
      {!otpVerified ? (
        <div className="w-full max-w-md px-6 py-8 bg-transparent">
          <h2 className="text-center text-lg font-medium mb-4 text-white">
            Enter OTP
          </h2>
          <Input
            prefix={<NumberOutlined />}
            value={otp}
            maxLength={6}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setOtp(val);
              if (val.length === 6) {
                handleVerifyOTP(val);
              }
            }}
            placeholder="Enter 6-digit OTP"
            size="large"
            className="text-center tracking-[8px]"
          />
          {loading && (
            <div className="flex justify-center mt-4">
              <Spin size="large" />
            </div>
          )}
        </div>
      ) : (
        <Form
          name="resetPasswordForm"
          onFinish={handleResetPassword}
          className="w-full max-w-md px-6 py-8 sm:px-8 bg-transparent"
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label={<span className="text-white">New Password</span>}
            rules={[{ required: true, message: "Please enter new password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className="text-white">Confirm Password</span>}
            rules={[{ required: true, message: "Please confirm password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              className="urbanist w-full bg-black text-white py-6 rounded-lg hover:!bg-gray-800 transition font-medium text-sm sm:text-base border-none flex items-center justify-center"
            >
              {loading ? <Spin size="small" /> : "Change Password"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default VerifyOtp;
