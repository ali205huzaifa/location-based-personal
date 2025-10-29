import React, { useState } from "react";
import { Form, Input, Button, Divider, DatePicker, message } from "antd";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (values: any) => {
    const payload = {
      fullName: values.fullName,
      username: values.username,
      email: values.email,
      password: values.password,
      dob: values.dob,
    };

    try {
      setLoading(true);
      const { data } = await AuthAPI.SignUp(payload);
      message.success(data.message || "Account created successfully!");

      navigate("/verify", { state: { email: values.email } });
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
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start text-left bg-violet-500/10 p-10 sm:p-8">
        <div className="max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#8869F3] mb-16">
            Logo
          </h1>
          <h2 className="text-[#000000] text-4xl font-semibold mb-3 leading-snug">
            Join the Community, Start Connecting
          </h2>
          <p className="text-[#666666] text-2xl font-normal leading-relaxed mb-16">
            Create your account and explore people, posts, and stories around
            you — your local world is waiting!
          </p>

          <img
            src="/images/login.svg"
            alt="Signup illustration"
            className="xl:max-w-lg lg:max-w-md md:max-w-xs mx-auto"
          />
        </div>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center px-6 sm:px-10 py-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-black text-4xl font-medium mb-8">Signup</h2>

          <Form layout="vertical" onFinish={handleSignup}>
            <Form.Item
              name="fullName"
              label="Full Name"
              className="text-xs font-normal text-[#000000]"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter FullName"
                className="rounded-xl h-12"
              />
            </Form.Item>

            <div className="flex gap-3">
              <Form.Item
                name="username"
                label="Username"
                className="flex-1 text-xs font-normal text-[#000000]"
                rules={[
                  { required: true, message: "Please create a username" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Create username"
                  className="rounded-xl h-12"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                className="flex-1 text-xs font-normal text-[#000000]"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  className="rounded-xl h-12"
                />
              </Form.Item>
            </div>

            <div className="flex gap-3">
              <Form.Item
                name="password"
                label="Password"
                className="flex-1 text-xs font-normal text-[#000000]"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  className="rounded-xl h-12"
                  iconRender={(visible) =>
                    visible ? (
                      <img
                        src="/icons/eyeOpen-icon.svg"
                        alt="Show password"
                        style={{ width: 16, height: 16 }}
                      />
                    ) : (
                      <img
                        src="/icons/eyeClose-icon.svg"
                        alt="Hide password"
                        style={{ width: 16, height: 16 }}
                      />
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                className="flex-1 text-xs font-normal text-[#000000]"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Re-enter your password"
                  className="rounded-xl h-12"
                  iconRender={(visible) =>
                    visible ? (
                      <img
                        src="/icons/eyeOpen-icon.svg"
                        alt="Show password"
                        style={{ width: 16, height: 16 }}
                      />
                    ) : (
                      <img
                        src="/icons/eyeClose-icon.svg"
                        alt="Hide password"
                        style={{ width: 16, height: 16 }}
                      />
                    )
                  }
                />
              </Form.Item>
            </div>

            <Form.Item
              name="dob"
              label="Age"
              className="text-xs font-normal text-[#000000]"
              rules={[
                { required: true, message: "Please select your date of birth" },
              ]}
            >
              <DatePicker
                size="large"
                suffixIcon={
                  <img
                    src="/icons/calendar-icon.svg"
                    alt="calendar"
                    style={{ width: 20, height: 20 }}
                  />
                }
                format="YYYY/MM/DD"
                className="w-full rounded-xl h-12"
                placeholder="YYYY/MM/DD"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 mt-6 bg-[#8869F3] hover:!bg-[#6b3df7] text-white text-lg font-normal rounded-xl"
            >
              Signup
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
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
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
