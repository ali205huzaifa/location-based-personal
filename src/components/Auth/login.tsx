import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Divider, message } from "antd";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";
import AuthAPI from "../../api/authApi/AuthAPI";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [_googleModalVisible, setGoogleModalVisible] = useState(false);
  const [_userId, setUserId] = useState("");
  const [_userToken, setUserToken] = useState("");
  const [_form] = Form.useForm();

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

      const api_token = loginRes.data.data.token;
      if (!api_token) throw new Error("Token not found");

      await handleLoginSuccess(api_token);
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

  const handleGoogleLogin = () => {
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/google/login`;
  };

  const handleLoginSuccess = async (token: string) => {
    try {
      const verifyRes = await AuthAPI.verifyToken(token);
      const user = verifyRes?.data;

      if (!user.username || !user.dob) {
        setUserToken(token);
        setGoogleModalVisible(true);
        return;
      }

      dispatch(
        setAuthData({
          currentUser: user,
          token,
        })
      );
      localStorage.setItem("token", token);
      message.success("Login successful!");
      navigate("/home");
    } catch (error: any) {
      console.error("Token verification failed:", error);
      message.error("Invalid or expired Google token. Please try again.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const id = params.get("userId");

    if (token) {
      setUserToken(token);
      handleLoginSuccess(token);
    }

    if (id) {
      setUserId(id);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start bg-violet-500/10 p-6 sm:p-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center">
            <img
              src="/icons/logo.svg"
              alt="Logo"
              className="h-24 w-auto object-contain cursor-pointer mb-8"
            />
          </div>
          <h1 className="text-4xl font-semibold text-black">Welcome Back!</h1>
          <p className="py-8 text-[#666666] text-2xl mb-16">
            Login to continue exploring what's happening around you.
          </p>
          <img
            src="/images/login.svg"
            alt="Login"
            className="xl:max-w-lg lg:max-w-md md:max-w-xs mx-auto"
          />
        </div>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center px-6 sm:px-10 py-10 bg-white">
        <div className="w-full max-w-sm">
          <h2 className="text-black text-4xl font-medium mb-8">Login</h2>

          <Form layout="vertical" onFinish={handleFinish} className="space-y-4">
            <Form.Item
              name="username"
              label={
                <span className="text-xs font-normal text-black">Email</span>
              }
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                placeholder="Enter your Email"
                size="large"
                className="rounded-xl !h-12 border border-gray-300 focus:border-[#7C4DFF] hover:border-[#7C4DFF]"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className="text-xs font-normal text-black">Password</span>
              }
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
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
                className="rounded-xl !h-12 border border-gray-300 focus:border-[#7C4DFF] hover:border-[#7C4DFF]"
              />
            </Form.Item>

            <div className="flex justify-end mb-6">
              <button
                type="button"
                className="text-sm text-[#8869F3] hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full !h-12 bg-[#8869F3] border-none hover:!bg-[#6b3df7] text-white text-lg rounded-xl shadow-md !mt-12"
            >
              Login
            </Button>

            <Divider className="!text-stone-500 !text-sm !my-8">
              or continue with
            </Divider>

            <div className="flex justify-center gap-8">
              <Button
                shape="circle"
                size="large"
                onClick={handleGoogleLogin}
                icon={
                  <img
                    src="/icons/google-icon.svg"
                    alt="Google"
                    className="w-6 h-6"
                  />
                }
                className="!w-12 !h-12 border border-gray-300 hover:border-[#7C4DFF]"
              />

              <Button
                shape="circle"
                size="large"
                icon={
                  <img
                    src="/icons/apple-icon.svg"
                    alt="Apple"
                    className="w-6 h-6"
                  />
                }
                className="!w-12 !h-12 border border-gray-300 hover:border-[#7C4DFF]"
              />
            </div>

            <p className="text-center mt-8 text-gray-600 text-sm">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#8869F3] cursor-pointer hover:underline"
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
