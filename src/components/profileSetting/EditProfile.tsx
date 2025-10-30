import React, { useState } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { Input, Button, Avatar } from "antd";

const { TextArea } = Input;

const EditProfile: React.FC = () => {
  const [fullName, setFullName] = useState("Alex Costa");
  const [username, setUsername] = useState("alex12");
  const [email, setEmail] = useState("alex123@gmail.com");
  const [bio, setBio] = useState(
    "Finding hidden gems in every city 🗺️ Let's connect where the map meets memories ✈️"
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Edit Profile
        </h2>
        <p className="text-sm text-gray-600">
          Update your name, bio, and profile photo to keep your account fresh
          and personal.
        </p>
      </div>

      <div className="mb-8">
        <div className="text-sm font-medium text-gray-700 mb-3">
          Display Image
        </div>
        <div className="flex justify-center">
          <div className="relative inline-block">
            <Avatar
              size={120}
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="border-4 border-white shadow-md"
            />
            <div className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition">
              <CameraOutlined className="text-sm" />
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
            className="h-11 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
            className="h-11 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Choose a username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email / Phone Number
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
            rows={3}
            className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="pt-4">
          <Button
            type="primary"
            size="large"
            className="w-full sm:w-auto px-8 bg-purple-600 hover:bg-purple-700 border-none rounded-lg font-medium"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
