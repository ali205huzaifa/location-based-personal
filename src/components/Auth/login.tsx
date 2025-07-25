import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Form, Button as AntButton } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import AuthAPI from "../../api/authApi/AuthAPI";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleFinish = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await AuthAPI.logIn({
        email: values.username,
        password: values.password,
      });

      const { api_token, user } = res.data;

      await AuthAPI.verifyToken(api_token);

      dispatch(
        setAuthData({
          currentUser: user,
          token: api_token,
        })
      );

      localStorage.setItem("token", api_token);

      navigate("/dashboard");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err?.response?.data?.message || "Invalid username or password.",
        confirmButtonColor: "#000",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center px-4 sm:px-6 md:px-10 pt-16 sm:pt-24 md:pt-40 relative"
      style={{ backgroundImage: `url('/images/login-Background.svg')` }}
    >
      <div className="text-center mb-10 sm:mb-15">
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
        name="loginForm"
        onFinish={handleFinish}
        className="w-full max-w-md px-6 py-8 sm:px-8"
        layout="vertical"
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: "Please enter your email address!" },
          ]}
        >
          <div className="relative">
            <img
              src="/icons/username-icon.svg"
              alt="user"
              width={20}
              height={20}
              className="absolute left-4 top-3.5"
            />
            <input
              type="text"
              placeholder="Email Address"
              autoComplete="username"
              className="urbanist pl-20 py-3 w-full bg-white rounded-lg focus:outline-none text-sm sm:text-base"
            />
          </div>
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <div className="relative">
            <img
              src="/icons/password-icon.svg"
              alt="lock"
              width={20}
              height={20}
              className="absolute left-4 top-3.5"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="urbanist pl-20 pr-12 py-3 w-full bg-white rounded-lg focus:outline-none text-sm sm:text-base"
            />
            <span
              className="absolute right-4 top-3.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
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
            className="urbanist w-full bg-black text-white py-6 mt-4 rounded-lg hover:!bg-gray-800 transition font-medium text-sm sm:text-base border-none"
          >
            Login
          </AntButton>
        </Form.Item>
      </Form>

      <footer className="urbanist font-Regular text-white text-xs sm:text-sm absolute bottom-4 sm:bottom-10">
        Copyright 2025 IR Solutions. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
