import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import RoleAPI from "../../api/roleApi/roleAPI";
import UsersAPI from "../../api/manage-userApi/UserAPI";

interface UserCreateProps {
  userToEdit?: {
    _id: string;
    name: string;
    email: string;
    role: {
      _id: string;
      name: string;
    };
  };
  onClose?: () => void;
  refreshUsers?: () => void;
}

export default function UserCreate({
  userToEdit,
  onClose,
  refreshUsers,
}: UserCreateProps) {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (showModal) {
      RoleAPI.getAll()
        .then((res) => {
          if (Array.isArray(res.data.data)) {
            setRoles(res.data.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching roles:", err);
        });
    }
  }, [showModal]);

  useEffect(() => {
    if (userToEdit) {
      setUsername(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role._id);
      setShowModal(true);
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setRoleError("");

    if (!username.trim()) {
      setUsernameError("Please enter Username");
      isValid = false;
    }
    if (!email.trim()) {
      setEmailError("Please enter Email");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid Email");
      isValid = false;
    }

    if (!userToEdit && !password.trim()) {
      setPasswordError("Please enter Password");
      isValid = false;
    }

    if (!role) {
      setRoleError("Please select a Role");
      isValid = false;
    }

    if (!isValid) return;

    const formData: any = {
      name: username,
      email,
      role,
    };

    try {
      if (userToEdit) {
        await UsersAPI.UpdateUser(userToEdit._id, formData);
        Swal.fire({
          title: "Updated!",
          text: "User updated successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
        });
      } else {
        formData["password"] = password;
        await UsersAPI.signup(formData);
        Swal.fire({
          title: "Created!",
          text: "User created successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
        });
      }

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
      setShowModal(false);
      onClose?.();
      refreshUsers?.();
    } catch (err: any) {
      Swal.fire("Error", "Unexpected error", "error");
    }
  };

  return (
    <div className="bg-white mt-4 relative">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          className="flex items-center gap-2 bg-[#16968F] text-white px-6 py-3 rounded-xl hover:bg-emerald-700 cursor-pointer"
          onClick={() => {
            onClose?.();
            setUsername("");
            setEmail("");
            setPassword("");
            setRole("");
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
            setRoleError("");
            setShowModal(true);
          }}
        >
          <img
            src="/icons/jobs-icon.svg"
            alt="Jobs Icon"
            width={20}
            height={20}
          />
          Add User
        </button>

        <div className="relative flex-1">
          <img
            src="/icons/search-icon.svg"
            alt="Search Icon"
            width={20}
            height={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="start typing to search Users"
            className="w-full border border-gray-300 rounded-md py-3 pl-14 pr-4"
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative bg-white w-[90%] max-w-md rounded-xl shadow-xl border border-[#D9D9D9] p-6">
            <button
              onClick={() => {
                setShowModal(false);
                onClose?.();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Close"
                width={20}
                height={20}
              />
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {userToEdit ? "Edit User" : "Add User"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="w-full border border-gray-300 rounded-md px-4 py-3"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameError && (
                  <p className="text-red-600 text-sm mt-1">{usernameError}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Enter User’s Email"
                  className={`w-full border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  } rounded-md px-4 py-3`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <select
                  className={`w-full border ${
                    roleError ? "border-red-500" : "border-gray-300"
                  } rounded-md px-4 py-3`}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  {roles.map((r: any) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {roleError && (
                  <p className="text-red-600 text-sm mt-1">{roleError}</p>
                )}
              </div>

              {!userToEdit && (
                <div>
                  <input
                    type="password"
                    placeholder="Enter a Strong Password"
                    className="w-full border border-gray-300 rounded-md px-4 py-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                  )}
                </div>
              )}

              <div className="flex justify-left gap-6 mt-6">
                <button
                  type="submit"
                  className="bg-[#16968F] text-white px-8 py-2 rounded-md hover:bg-emerald-700 cursor-pointer"
                >
                  {userToEdit ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="border border-gray-300 px-8 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowModal(false);
                    onClose?.();
                    setUsernameError("");
                    setEmailError("");
                    setPasswordError("");
                    setRoleError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
