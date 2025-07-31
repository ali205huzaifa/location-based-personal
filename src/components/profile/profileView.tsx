import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import Swal from "sweetalert2";
import UsersAPI from "../../api/manage-userApi/UserAPI";

export default function ProfileView() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  if (!currentUser) return <p>Loading...</p>;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState(
    currentUser.profileImage || ""
  );

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      const response = await UsersAPI.ImageUrl({
        name: file.name,
        fileType: file.type.split("/")[1],
        type: file.type,
      });

      const { uploadUrl, fileUrl } = response.data;
      setProfileImageUrl(fileUrl);

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Could not upload image.",
      });
    }
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;

    if (!profileImageUrl) {
      Swal.fire({
        icon: "warning",
        title: "Missing Profile Image",
        text: "Please upload a profile image before saving changes.",
      });
      return;
    }

    try {
      await UsersAPI.UpdateUser(currentUser._id, {
        name: currentUser.name,
        email: currentUser.email,
        role:
          typeof currentUser.role === "string"
            ? currentUser.role
            : currentUser.role.name,
        profileImage: profileImageUrl,
      });

      Swal.fire({
        icon: "success",
        title: "Profile updated successfully!",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Something went wrong.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!form.currentPassword)
      newErrors.currentPassword = "Current password is required.";
    if (!form.newPassword) newErrors.newPassword = "New password is required.";
    if (!form.confirmNewPassword)
      newErrors.confirmNewPassword = "Please confirm new password.";
    else if (form.newPassword !== form.confirmNewPassword)
      newErrors.confirmNewPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await UsersAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmNewPassword: form.confirmNewPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Password changed successfully!",
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed to change password",
        text: "Something went wrong.",
      });
    }
  };

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl p-6 space-y-10">
      <section>
        <h2 className="text-2xl font-Regular mb-6">Personal Info</h2>
        <div className="flex items-center space-x-10">
          <div className="relative">
            <div className="flex w-[250px] items-center gap-4 mt-2">
              <p className="text-sm text-gray-500">Profile Picture</p>
              <img
                src={currentUser.profileImage || "/profile.jpg"}
                alt="Profile"
                className="w-24 h-24 rounded-md object-cover"
              />
            </div>

            <button
              onClick={handleEditClick}
              className="absolute -top-2 -right-0 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <img
                src="/icons/profile-icon.svg"
                alt="Edit"
                className="w-6 h-6"
              />
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-4 gap-6 w-full md:pl-30 pl-6">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-Regular">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-Regular">{currentUser.email}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-300 pt-6">
        <h2 className="text-2xl font-Regular mb-6">Role & Access</h2>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">User Role</p>
            <p>
              {typeof currentUser?.role === "string"
                ? currentUser.role
                : currentUser?.role?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentUser?.isActive === true}
                readOnly
                className="form-checkbox accent-[#16968F] h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <span className="font-Regular">
                {currentUser?.isActive ? "Active" : "Inactive"}
              </span>
            </label>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Login</p>
            <p className="font-medium">{currentUser.lastLogin}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-300 pt-6 w-full">
        <h2 className="text-2xl font-Regular mb-6">Security & Credentials</h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="md:col-span-3">
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter your previous Password"
              value={form.currentPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div className="md:col-span-3">
            <input
              type="password"
              name="newPassword"
              placeholder="Enter your new Password"
              value={form.newPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="md:col-span-3">
            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Re-enter your Password"
              value={form.confirmNewPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSubmit}
              className="bg-black text-white py-2 rounded-md w-full"
            >
              Change Password
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveChanges}
          className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2 rounded-md"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}
