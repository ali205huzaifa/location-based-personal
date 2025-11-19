import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, DatePicker } from "antd";
import dayjs from "dayjs";
import AuthAPI from "../../api/authApi/AuthAPI";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";

const CompleteGoogleProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [token, setToken] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const emailParam = params.get("email");
    const name = params.get("fullName");
    const msg = params.get("message");
    const tokenParam = params.get("token");

    if (id) setUserId(id);
    if (emailParam) setEmail(emailParam);
    if (name) setFullName(name);
    if (msg) setInfoMessage(msg || "");
    if (tokenParam) setToken(tokenParam);
  }, [location.search]);

  const handleSubmit = async (values: { username: string; dob: number }) => {
    try {
      setLoading(true);

      const formattedDob = dayjs(values.dob).toISOString();

      const res = await AuthAPI.CompleteGoogleProfile(userId, {
        username: values.username,
        dob: formattedDob,
      });

      const newToken = res?.data?.data?.token || token;
      if (!newToken) throw new Error("Token missing after profile completion");

      const verifyRes = await AuthAPI.verifyToken(newToken);
      const user = verifyRes?.data;

      dispatch(setAuthData({ currentUser: user, token: newToken }));
      localStorage.setItem("token", newToken);

      message.success("Profile completed and logged in successfully!");
      navigate("/home");
    } catch (err: any) {
      console.error("Profile completion failed:", err);
      message.error(
        err?.response?.data?.message || "Failed to complete profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-[#000000] mb-2">
          Complete Your Profile
        </h1>
        {infoMessage && (
          <p className="text-center text-sm text-gray-500 font-normal mb-6">
            {infoMessage}
          </p>
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Full Name">
            <Input value={fullName} disabled className="!h-10 rounded-xl" />
          </Form.Item>

          <Form.Item label="Email">
            <Input value={email} disabled className="!h-10 rounded-xl" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input
              placeholder="Choose a username"
              className="!h-10 rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              size="large"
              format="YYYY/MM/DD"
              className="w-full !h-10 rounded-xl"
              placeholder="YYYY/MM/DD"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full mt-4 !bg-[#8869F3] !h-10 rounded-xl"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CompleteGoogleProfile;
