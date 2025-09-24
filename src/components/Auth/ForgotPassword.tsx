import React, { useState } from "react";
import { Form, Button as AntButton } from "antd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";
import ClipLoader from "react-spinners/ClipLoader";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (values: { email: string }) => {
    try {
      setLoading(true);
      const res = await AuthAPI.SendOTP({ email: values.email });
      Swal.fire({
        icon: "success",
        text: res.data.message || "An OTP has been sent to your email.",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        text: "Something went wrong.",
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

      <Form
        name="forgotPasswordForm"
        onFinish={handleSendOTP}
        className="w-full max-w-md px-6 py-8 sm:px-8"
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <div className="relative">
            <img
              src="/icons/username-icon.svg"
              alt="user"
              width={20}
              height={20}
              className="absolute left-4 top-4"
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="urbanist pl-12 px-4 py-3 w-full border rounded-lg focus:outline-none text-sm sm:text-base"
            />
          </div>
        </Form.Item>

        <Form.Item>
          <AntButton
            type="primary"
            htmlType="submit"
            disabled={loading}
            className="urbanist w-full bg-black text-white py-6 rounded-lg hover:!bg-gray-800 transition font-medium text-sm sm:text-base border-none flex items-center justify-center"
          >
            {loading ? <ClipLoader size={25} color="#16968F" /> : "Send OTP"}
          </AntButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
