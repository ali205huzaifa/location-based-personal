import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";
import AuthAPI from "../../api/authApi/AuthAPI";
import { decryptPrivateKeyHybrid } from "../../util/Decryption";
// import { requestFCMToken } from "../common/firebaseConfig";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [_googleModalVisible, setGoogleModalVisible] = useState(false);
  const [_userId, setUserId] = useState("");
  const [_userToken, setUserToken] = useState("");
  const [_form] = Form.useForm();
  // const [fcmToken, setFcmToken] = useState<string | null>(null);

  // useEffect(() => {
  //   let isMounted = true;

  //   const setupFCM = async () => {
  //     const token = await requestFCMToken();
  //     if (isMounted && token) {
  //       setFcmToken(token);
  //     }
  //   };
  //   setupFCM();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const handleFinish = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      setLoading(true);

      // const fcmPushToken = fcmToken as string;
      // const platform = "web";

      const loginRes = await AuthAPI.logIn({
        email: values.username,
        password: values.password,
        // fcmPushToken,
        // platform,
      });

      const { data } = loginRes.data;

      if (data.verified === false) {
        try {
          await AuthAPI.VerifyUserEmailOTP({ email: values.username });
          message.success("Verification code sent to your email.");
        } catch (err) {
          message.error("Failed to send OTP. Please try again.");
        }

        navigate("/verify", { state: { email: values.username } });
        return;
      }

      // localStorage.setItem("fcmPushToken", fcmPushToken);

      const { token, clientSecret } = loginRes.data.data;

      if (!token || !clientSecret) {
        throw new Error("Token or clientSecret missing");
      }

      await handleLoginSuccess(token, clientSecret);
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

  const handleLoginSuccess = async (token: string, clientSecret?: string) => {
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

      if (clientSecret) {
        const privateKey = await decryptPrivateKeyHybrid({
          clientSecret,
          encryptedPrivateKey: user.encryptedPrivateKey,
          wrappedMasterKey: user.wrappedMasterKey,
          nonce: user.nonce,
          masterKeyNonce: user.masterKeyNonce,
          salt: user.salt,
        });

        localStorage.setItem("privateKey", privateKey);
        localStorage.setItem("publicKey", user.userPublicKey);
      }

      localStorage.setItem("token", token);
      message.success("Login successful!");
      navigate("/home");
    } catch (error: any) {
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
    <>
      <div className="md:hidden flex items-center justify-center min-h-screen text-center px-6 bg-white">
        <div>
          <h2 className="text-2xl font-semibold !text-[#8869f3]">
            We’re available on mobile!
          </h2>
          <p className="text-gray-500 mt-3">
            Please download our app from Playstore & AppStore to continue.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <a
              href="#"
              className="bg-[#8869f3] text-white px-4 py-2 rounded-lg"
            >
              Google Play Store
            </a>
            <a
              href="#"
              className="bg-[#8869f3] text-white px-4 py-2 rounded-lg"
            >
              Apple App Store
            </a>
          </div>
        </div>
      </div>

      <div className="hidden md:flex min-h-screen flex-col md:flex-row">
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-violet-500/10 px-8">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center py-8">
              <img
                src="/icons/logo.svg"
                alt="Logo"
                className="h-24 w-auto object-contain cursor-pointer"
              />
            </div>
            <h1 className="text-4xl font-semibold text-black">Welcome Back!</h1>
            <p className=" max-w-[442px] py-4 !text-[#666666] lg:text-2xl md:text-lg !font-light">
              Login to continue exploring what's happening around you.
            </p>
            <img
              src="/images/login.svg"
              alt="Login"
              className="xl:max-w-[596px] lg:max-w-[466px] md:max-w-[350px] mx-auto"
            />
          </div>
        </div>

        <div className="md:w-1/2 w-full flex items-center justify-center px-6 sm:px-10 bg-white">
          <div className="w-full max-w-sm">
            <h2 className="text-black text-4xl font-medium mb-8">Login</h2>

            <Form
              form={_form}
              layout="vertical"
              onFinish={handleFinish}
              className="space-y-4"
            >
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
                  className="rounded-xl !h-[52px] border border-gray-300 focus:!border-[#8869F3] hover:!border-[#8869F3]"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className="text-xs font-normal text-black">
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
                  className="rounded-xl !h-[52px] border border-gray-300 focus:!border-[#8869F3] hover:!border-[#8869F3]"
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
                htmlType="submit"
                loading={loading}
                className="w-full !h-12 !bg-[#8869F3] border-none !text-white text-lg rounded-xl shadow-none !mt-12"
              >
                Login
              </Button>

              <div className="self-stretch inline-flex items-center justify-center gap-2 py-8">
                <div className="w-32 h-px bg-gradient-to-r from-stone-100 to-[#C3C3C3]" />
                <div className="text-stone-500 text-xs font-normal">
                  or continue with
                </div>
                <div className="w-32 h-px bg-gradient-to-l from-stone-100 to-[#C3C3C3]" />
              </div>

              <div className="flex justify-center gap-8">
                <Button
                  shape="circle"
                  size="large"
                  onClick={handleGoogleLogin}
                  icon={
                    <img
                      src="/icons/google-icon.svg"
                      alt="Google"
                      className="w-8 h-8"
                    />
                  }
                  className="!w-14 !h-14 border border-gray-300 hover:border-[#7C4DFF]"
                />

                <Button
                  shape="circle"
                  size="large"
                  icon={
                    <img
                      src="/icons/apple-icon.svg"
                      alt="Apple"
                      className="w-8 h-8"
                    />
                  }
                  className="!w-14 !h-14 border border-gray-300 hover:border-[#7C4DFF]"
                />
              </div>
              <div className="!mt-12">
                <p className="text-center text-gray-600 text-sm">
                  Don’t have an account?{" "}
                  <span
                    onClick={() => navigate("/signup")}
                    className="text-[#8869F3] cursor-pointer hover:underline"
                  >
                    Sign up
                  </span>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
