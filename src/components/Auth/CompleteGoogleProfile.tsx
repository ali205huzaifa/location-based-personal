import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, DatePicker } from "antd";
import AuthAPI from "../../api/authApi/AuthAPI";

const CompleteGoogleProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const emailParam = params.get("email");
    const name = params.get("fullName");
    const msg = params.get("message");

    if (id) setUserId(id);
    if (emailParam) setEmail(emailParam);
    if (name) setFullName(name);
    if (msg) setInfoMessage(msg || "");
  }, [location.search]);

  const handleSubmit = async (values: { username: string; dob: number }) => {
    try {
      setLoading(true);
      const dob = new Date();
      dob.setFullYear(dob.getFullYear() - values.dob);

      await AuthAPI.CompleteGoogleProfile(userId, {
        username: values.username,
        dob: values.dob,
      });

      message.success("Profile completed successfully!");
      navigate("/login");
    } catch (err: any) {
      console.log("err", err);
      message.error(
        err?.response?.data?.message || "Failed to complete profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
            label="Age"
            className="text-xs font-normal text-[#000000] rounded-xl"
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
              className="w-full !h-10 rounded-xl"
              placeholder="YYYY/MM/DD"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full mt-4 bg-[#8869F3] !h-10 rounded-xl"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CompleteGoogleProfile;
