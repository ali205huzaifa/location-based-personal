import React, { useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { Input, Button, Avatar } from "antd";

const { TextArea } = Input;

const EditProfile: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-black text-2xl font-medium mb-2">
          Edit Profile
        </h2>
        <p className="text-[#666666] text-sm font-normal">
          Update your name, bio, and profile photo to keep your account fresh
          and personal.
        </p>
      </div>

      <div className="mb-4">
        <div className="ttext-[#000000] text-sm font-normal mb-3">
          Display Image
        </div>
        <div className="flex justify-start">
          <div className="relative inline-block">
            <Avatar
              size={80}
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="border-none"
            />
            <div className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition">
              <CameraOutlined className=" w-6 h-6 text-sm pl-1" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-12 rounded-xl border-gray-300 text-[#000000] text-sm font-normal"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 rounded-xl border-gray-300 text-[#000000] text-sm font-normal"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl border-gray-300 text-[#000000] text-sm font-normal"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <TextArea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="h-16 rounded-xl border-gray-300 text-[#000000] text-sm font-normal"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="primary"
            size="large"
            className="!w-36 !h-12 sm:w-auto px-8 bg-[#8869F3] hover:bg-purple-700 border-none rounded-xl text-white text-sm font-normal"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
