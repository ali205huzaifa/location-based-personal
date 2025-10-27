import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider, message } from "antd";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";
import AuthAPI from "../../api/authApi/AuthAPI";

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

      const api_token = loginRes.data.data.token;
      if (!api_token) throw new Error("Token not found");

      const verifyRes = await AuthAPI.verifyToken(api_token);
      const user = verifyRes?.data;

      const userInfo = {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        age: user.age,
        dob: user.dob,
        notificationsEnabled: user.notificationsEnabled,
        privacy: user.privacy,
      };

      dispatch(
        setAuthData({
          currentUser: userInfo,
          token: api_token,
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
    <div className={`min-h-screen flex flex-col md:flex-row`}>
      <div
        className={`md:w-1/2 w-full flex flex-col justify-center items-start text-left bg-violet-500/10 p-10 sm:p-16`}
      >
        <div className="max-w-lg">
          <h1
            className={`text-4xl sm:text-5xl font-extrabold text-[#8869F3] mb-8`}
          >
            Logo
          </h1>
          <h1 className={`text-4xl font-semibold text-[#000000]`}>
            Welcome Back!
          </h1>
          <p className={`py-8 text-[#666666] text-2xl font-normal`}>
            Login to continue exploring what's happening around you.
          </p>
          <img
            src="/images/login.svg"
            alt="Login illustration"
            className="max-w-xl mx-auto mt-4"
          />
        </div>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center px-6 sm:px-10 py-10 bg-white">
        <div className="w-full max-w-sm">
          <h2 className={`text-black text-4xl font-medium mb-8`}>Login</h2>

          <Form layout="vertical" onFinish={handleFinish} className="space-y-4">
            <Form.Item
              name="username"
              label={
                <span className={`text-xs font-normal text-[#000000]`}>
                  Email
                </span>
              }
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                placeholder="example123@gmail.com"
                size="large"
                className="rounded-xl !h-12 border border-solid border-gray-300 focus:border-[#7C4DFF] hover:border-[#7C4DFF]"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <span className={`text-xs font-normal text-[#000000]`}>
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
                size="large"
                className="rounded-xl !h-12 border border-solid border-gray-300 focus:border-[#7C4DFF] hover:border-[#7C4DFF]"
              />
            </Form.Item>

            <div className="flex justify-end mb-6">
              <button
                type="button"
                className={`text-sm text-[#8869F3] hover:underline`}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={`w-full !h-12 bg-[#8869F3] border-none hover:!bg-[#6b3df7] text-white text-lg font-normal rounded-xl shadow-md transition-all duration-200 !mt-12`}
            >
              Login
            </Button>

            <Divider className="!text-stone-500 !text-sm !font-normal !my-8">
              or continue with
            </Divider>

            <div className="flex justify-center gap-8">
              <Button
                shape="circle"
                size="large"
                icon={
                  <img
                    src="/icons/google-icon.svg"
                    alt="Google"
                    className="w-6 h-6"
                  />
                }
                className="!w-12 !h-12 border border-gray-300 hover:border-[#7C4DFF] hover:text-[#7C4DFF]"
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
                className="!w-12 !h-12 border border-gray-300 hover:border-[#7C4DFF] hover:text-[#7C4DFF]"
              />
            </div>

            <p className="text-center !mt-8 text-gray-600 text-sm font-normal">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className={`text-[#8869F3] cursor-pointer font-medium hover:underline`}
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
