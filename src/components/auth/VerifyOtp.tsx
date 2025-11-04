import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";
import ClipLoader from "react-spinners/ClipLoader";

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    if (newOtp.join("").length === 4) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleVerifyOTP = async (enteredOtp: string) => {
    try {
      setLoading(true);
      await AuthAPI.VerifyOTP({ email, otp: Number(enteredOtp) });
      notification.success({
        message: "OTP Verified Successfully",
        description: "You can now reset your password.",
        placement: "topRight",
      });
      setOtpVerified(true);
    } catch (err: any) {
      notification.error({
        message: "Invalid OTP",
        description: "Please enter the correct OTP sent to your email.",
        placement: "topRight",
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
      notification.error({
        message: "Password Mismatch",
        description: "New password and confirm password must match.",
        placement: "topRight",
      });
      return;
    }

    try {
      setLoading(true);
      await AuthAPI.ResetPassword({
        email,
        password: values.newPassword,
      });
      notification.success({
        message: "Password Changed Successfully",
        description: "You can now login with your new password.",
        placement: "topRight",
      });
      navigate("/login");
    } catch (err: any) {
      notification.error({
        message: "Password Reset Failed",
        description: err?.response?.data?.message || "Something went wrong.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      await AuthAPI.SendOTP({ email });
      notification.success({
        message: "OTP Resent",
        description: "A new OTP has been sent to your email.",
        placement: "topRight",
      });
      setOtp(["", "", "", ""]);
      setTimer(60);
    } catch (err: any) {
      notification.error({
        message: "Failed to Resend OTP",
        description: err?.response?.data?.message || "Something went wrong.",
        placement: "topRight",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      {!otpVerified ? (
        <div className="bg-white rounded-2xl p-8 w-[90%] sm:w-[400px] text-center border border-gray-300">
          <h2 className="text-black text-4xl font-medium mb-2">Verify OTP</h2>
          <p className="text-stone-500 text-base font-normal mb-6">
            Enter the code sent to your email.
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg outline-none"
              />
            ))}
          </div>

          <Button
            type="primary"
            block
            onClick={() => handleVerifyOTP(otp.join(""))}
            className="!bg-[#8869F3] text-white text-base font-normal py-2 px-4 h-10 rounded-lg"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
          </Button>

          <div className="text-gray-500 text-sm mt-4 flex justify-center items-center gap-1">
            {timer > 0 ? (
              <>
                00:{timer < 10 ? `0${timer}` : timer}
                <span className="text-[#8869F3] ml-1">Resend code</span>
              </>
            ) : (
              <Button
                type="link"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="text-purple-500 p-0"
              >
                {resendLoading ? "Resending..." : "Resend code"}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 w-[90%] sm:w-[420px] text-center border border-gray-300">
          <h2 className="self-stretch text-black text-4xl font-medium text-center mb-4 whitespace-nowrap">
            Set a New Password
          </h2>
          <p className="self-stretch text-stone-500 text-base font-normal mb-6">
            Choose a strong password to secure your account.{" "}
          </p>

          <Form
            layout="vertical"
            onFinish={handleResetPassword}
            className="space-y-4"
          >
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter new password!" },
              ]}
            >
              <Input.Password
                placeholder="Enter new password"
                iconRender={(visible) =>
                  visible ? (
                    <img
                      src="/icons/eyeOpen-icon.svg"
                      alt="Show password"
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <img
                      src="/icons/eyeClose-icon.svg"
                      alt="Hide password"
                      style={{ width: 20, height: 20 }}
                    />
                  )
                }
                className="h-10 rounded-lg"
                visibilityToggle={{
                  visible: showNewPassword,
                  onVisibleChange: setShowNewPassword,
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[{ required: true, message: "Please confirm password!" }]}
            >
              <Input.Password
                placeholder="Renter your password"
                iconRender={(visible) =>
                  visible ? (
                    <img
                      src="/icons/eyeOpen-icon.svg"
                      alt="Show password"
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <img
                      src="/icons/eyeClose-icon.svg"
                      alt="Hide password"
                      style={{ width: 20, height: 20 }}
                    />
                  )
                }
                className="h-10 rounded-lg"
                visibilityToggle={{
                  visible: showConfirmPassword,
                  onVisibleChange: setShowConfirmPassword,
                }}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={loading}
              className="bg-[#8869F3] hover:!bg-purple-600 h-12 rounded-xl !mt-12 text-white text-lg font-medium"
            >
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default VerifyOtp;
