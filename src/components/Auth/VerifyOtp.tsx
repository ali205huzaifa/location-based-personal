import React, { useState } from "react";
import { Form, Button as AntButton } from "antd";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";
import ClipLoader from "react-spinners/ClipLoader";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerifyOTP = async (enteredOtp: string) => {
    try {
      setLoading(true);
      await AuthAPI.VerifyOTP({ otp: Number(enteredOtp) });
      Swal.fire({
        icon: "success",
        title: "OTP Verified",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setOtpVerified(true);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        text: "Please Enter Correct OTP!",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (values.newPassword !== values.confirmPassword) {
      Swal.fire({
        icon: "error",
        text: "New password and confirm password must match!",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    try {
      setLoading(true);
      await AuthAPI.ResetPassword({
        email,
        newPassword: values.newPassword,
        otp: Number(otp),
      });
      Swal.fire({
        icon: "success",
        title: "Password Changed Successfully",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      navigate("/");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || "Something went wrong.",
        confirmButtonColor: "#000",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center px-4 sm:px-6 md:px-10 pt-16 sm:pt-24 md:pt-40 relative"
      style={{ backgroundImage: `url('/images/login-Background.svg')` }}
    >
      <div className="text-center mb-10">
        <img
          src="/images/IR-logo.svg"
          alt="Logo"
          width={144}
          height={144}
          className="mx-auto mb-6"
        />
        <h1 className="urbanist font-medium text-white text-2xl sm:text-3xl md:text-4xl">
          Job Portal & Management System
        </h1>
      </div>

      {!otpVerified ? (
        <div className="w-full max-w-md px-6 py-8">
          <h2 className="text-center text-lg font-medium mb-4">Enter OTP</h2>
          <input
            type="text"
            value={otp}
            maxLength={6}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setOtp(val);
              if (val.length === 6) {
                handleVerifyOTP(val);
              }
            }}
            className="urbanist text-center text-lg tracking-[10px] px-4 py-3 w-full border rounded-lg focus:outline-none"
            placeholder="______"
          />
          {loading && (
            <div className="flex justify-center mt-4">
              <ClipLoader size={30} color="#16968F" />
            </div>
          )}
        </div>
      ) : (
        <Form
          name="resetPasswordForm"
          onFinish={handleResetPassword}
          className="w-full max-w-md px-6 py-8 sm:px-8"
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            rules={[{ required: true, message: "Please enter new password!" }]}
          >
            <div className="relative">
              <img
                src="/icons/password-icon.svg"
                alt="lock"
                width={20}
                height={20}
                className="absolute left-4 top-4"
              />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="urbanist pl-20 px-4 py-3 w-full border rounded-lg focus:outline-none text-sm sm:text-base password-input"
              />
              <span
                className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeTwoTone twoToneColor="#999" />
                )}
              </span>
            </div>
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm password!" }]}
          >
            <div className="relative">
              <img
                src="/icons/password-icon.svg"
                alt="lock"
                width={20}
                height={20}
                className="absolute left-4 top-4"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="urbanist pl-20 px-4 py-3 w-full border rounded-lg focus:outline-none text-sm sm:text-base password-input"
              />
              <span
                className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeTwoTone twoToneColor="#999" />
                )}
              </span>
            </div>
          </Form.Item>

          <Form.Item>
            <AntButton
              type="primary"
              htmlType="submit"
              disabled={loading}
              className="urbanist w-full bg-black text-white py-6 rounded-lg hover:!bg-gray-800 transition font-medium text-sm sm:text-base border-none flex items-center justify-center"
            >
              {loading ? (
                <ClipLoader size={25} color="#16968F" />
              ) : (
                "Change Password"
              )}
            </AntButton>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default VerifyOtp;
