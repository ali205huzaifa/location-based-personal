import { useSelector } from "react-redux";
import type { RootState } from "../../store";

export default function ProfileView() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  if (!currentUser) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      <section>
        <h2 className="text-2xl font-Regular mb-6">Personal Info</h2>
        <div className="flex items-center space-x-10">
          <div className="relative">
            <img
              src={currentUser.profileImage || "/profile.jpg"}
              alt="Profile"
              className="w-24 h-24 rounded-md object-cover"
            />
            <button className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
              <img
                src="/icons/profile-edit-icon.svg"
                alt="Edit"
                className="w-4 h-4"
              />
            </button>
            <p className="text-sm text-gray-500 mt-2">Profile Picture</p>
          </div>

          <div className="grid grid-cols-3 gap-6 w-full">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-Regular">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-Regular">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-Regular">{currentUser.phoneNumber}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t pt-6">
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
            <p className="text-sm text-gray-500">Access Level</p>
            <p className="font-medium">{currentUser.accessLevel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={currentUser?.isActive === true}
                readOnly
                className="form-checkbox h-4 w-4 text-teal-600 rounded focus:ring-teal-500"
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

      <section className="border-t pt-6 w-full">
        <h2 className="text-2xl font-Regular mb-6">Security & Credentials</h2>
        <div className="grid grid-cols-8 gap-20 items-end">
          <input
            type="password"
            placeholder="Enter your new Password"
            className="col-span-3 border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Re-enter your Password"
            className="col-span-3 border border-gray-300 rounded-md px-4 py-2 w-full"
          />
          <button className="col-span-2 bg-black text-white py-2 rounded-md w-full">
            Change Password
          </button>
        </div>
      </section>

      <div className="flex justify-end mt-6">
        <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md">
          Save changes
        </button>
      </div>
    </div>
  );
}
