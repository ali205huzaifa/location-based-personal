import React, { useState } from "react";
import { Form, Input, Button, Divider, message } from "antd";
import {
  GoogleOutlined,
  AppleOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (values: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);

      const { data } = await AuthAPI.SignUp(values);
      message.success(data.message || "Account created successfully!");
      navigate("/");
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f8fc]">
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center text-left bg-[#EDE5FF] p-10 sm:p-16">
        <div className="max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#7C4DFF] mb-4">
            Logo
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3 leading-snug">
            Join the Community, Start Connecting
          </h2>
          <p className="text-[#666666] text-base sm:text-lg leading-relaxed font-regular">
            Create your account and explore people, posts, and stories around
            you — your local world is waiting!
          </p>

          <img
            src="/images/login.svg"
            alt="Signup illustration"
            className="mt-10 w-full max-w-md mx-auto"
          />
        </div>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center px-6 sm:px-10 py-10 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl sm:text-3xl font-medium mb-8 text-gray-800">
            Signup
          </h2>

          <Form layout="vertical" onFinish={handleSignup}>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your full name"
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                prefix={<MailOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                prefix={<LockOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-11 mt-3 bg-[#7C4DFF] hover:!bg-[#6b3df7] text-white font-semibold rounded-md"
            >
              Signup
            </Button>

            <Divider className="text-gray-500 my-6">or continue with</Divider>

            <div className="flex justify-center gap-5">
              <Button
                icon={<GoogleOutlined />}
                shape="circle"
                size="large"
                className="border-gray-300 hover:border-[#7C4DFF] hover:text-[#7C4DFF]"
              />
              <Button
                icon={<AppleOutlined />}
                shape="circle"
                size="large"
                className="border-gray-300 hover:border-[#7C4DFF] hover:text-[#7C4DFF]"
              />
            </div>

            <p className="text-center mt-8 text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/")}
                className="text-[#7C4DFF] cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
