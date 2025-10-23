import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";
import AuthAPI from "../../api/authApi/AuthAPI";

const PURPLE_LIGHT = "#EDE5FF";
const PURPLE_MAIN = "#7C4DFF";
const GRAY_DARK = "#333";
const GRAY_MEDIUM = "#666";
const GRAY_LIGHT_BG = "#f8f8fc";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      const loginRes = await AuthAPI.logIn({
        email: values.username,
        password: values.password,
      });

      const api_token = loginRes.data.api_token;
      if (!api_token) throw new Error("Token not found");

      const verifyRes = await AuthAPI.verifyToken(api_token);
      const user = verifyRes.data.data.user;

      const userInfo = {
        _id: user._id,
        name: user.name,
        fullName: user.fullName || user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        accessLevel: user.accessLevel || "user",
        lastLogin: user.lastLogin || new Date().toISOString(),
        profilePicture: user.profilePicture,
        role: user.role,
        isActive: user.isActive,
        isBlocked: user.isBlocked,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      dispatch(
        setAuthData({
          currentUser: userInfo,
          token: api_token,
          permissions: user.role.permissions,
        })
      );

      localStorage.setItem("token", api_token);
      message.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message ||
          err.message ||
          "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row bg-[${GRAY_LIGHT_BG}]`}
    >
      <div
        className={`md:w-1/2 w-full flex flex-col justify-center items-center bg-[${PURPLE_LIGHT}] p-10 sm:p-16`}
      >
        <div className="max-w-md text-left w-full">
          <h1
            className={`text-4xl sm:text-5xl font-extrabold text-[${PURPLE_MAIN}] mb-6`}
          >
            Logo
          </h1>

          <img
            src="/images/login-illustration.svg"
            alt="Login illustration"
            className="w-full max-w-md mx-auto"
          />

          <p
            className={`mt-6 text-[${GRAY_MEDIUM}] text-base sm:text-lg leading-relaxed`}
          >
            Login to continue exploring what's happening around you.
          </p>
        </div>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center px-6 sm:px-10 py-10 bg-white">
        <div className="w-full max-w-sm">
          <h2 className={`text-3xl font-normal mb-8 text-gray-800`}>Login</h2>

          <Form layout="vertical" onFinish={handleFinish} className="space-y-4">
            <Form.Item
              name="username"
              label={
                <span className={`text-[${GRAY_DARK}] font-normal`}>Email</span>
              }
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                placeholder="example123@gmail.com"
                size="large"
                className="rounded-lg !h-12 border border-solid border-gray-300 focus:border-[#7C4DFF] hover:border-[#7C4DFF]"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className={`text-[${GRAY_DARK}] font-normal`}>
                  Password
                </span>
              }
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                size="large"
                className="rounded-lg !h-12 border border-solid border-gray-300 focus:border-[#7C4DFF] hover:border-[#7C4DFF]"
              />
            </Form.Item>

            <div className="flex justify-end mb-6">
              <button
                type="button"
                className={`text-sm text-[${PURPLE_MAIN}] hover:underline`}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={`w-full !h-12 bg-[${PURPLE_MAIN}] border-none hover:!bg-[#6b3df7] text-white font-medium rounded-lg shadow-md transition-all duration-200`}
            >
              Login
            </Button>

            <Divider className="text-gray-500 my-8">or continue with</Divider>

            <div className="flex justify-center gap-4">
              <Button
                icon={<GoogleOutlined className="text-xl" />}
                shape="circle"
                size="large"
                className="!w-12 !h-12 border border-gray-300 hover:border-[#7C4DFF] hover:text-[#7C4DFF]"
              />
              <Button
                icon={<AppleOutlined className="text-xl" />}
                shape="circle"
                size="large"
                className="!w-12 !h-12 border border-gray-300 hover:border-[#7C4DFF] hover:text-[#7C4DFF]"
              />
            </div>

            <p className="text-center mt-8 text-gray-600">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className={`text-[${PURPLE_MAIN}] cursor-pointer font-medium hover:underline`}
              >
                Sign up
              </span>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
