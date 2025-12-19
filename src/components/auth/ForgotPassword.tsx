import React, { useState } from "react";
import { Form, Button, Input, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (values: { email: string }) => {
    try {
      setLoading(true);
      const res = await AuthAPI.SendOTP({ email: values.email });
      message.success(
        res.data.message || "An OTP has been sent to your email."
      );
      navigate("/verify-otp", { state: { email: values.email } });
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4 bg-[url('/images/admin.svg')] bg-cover bg-center bg-no-repeat">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
        <h2 className="text-black text-4xl font-medium mb-4">
          Forgot Password?
        </h2>
        <p className="text-stone-500 text-base font-normal mb-6">
          Enter your email to reset your account access.{" "}
        </p>

        <Form
          name="forgotPasswordForm"
          onFinish={handleSendOTP}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label={<span className="text-gray-700 font-medium">Email</span>}
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
            className="mb-4"
          >
            <Input
              placeholder="example123@gmail.com"
              size="large"
              className="rounded-md border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              className="w-full !bg-[#8869F3] text-white text-base font-normal py-2 px-4 rounded-xl transition duration-200 ease-in-out h-10 flex items-center justify-center mt-6"
            >
              {loading ? (
                <Spin size="small" className="text-white" />
              ) : (
                "Send Code"
              )}
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6 text-sm">
          <span className="text-gray-500">Back to </span>
          <a
            onClick={() => navigate("/")}
            className="!text-[#8869F3] cursor-pointer"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
