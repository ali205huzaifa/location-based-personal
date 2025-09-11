import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import RoleAPI from "../../api/roleApi/roleAPI";
import UsersAPI from "../../api/manage-userApi/UserAPI";
import type { User } from "../../types/user";
import ClipLoader from "react-spinners/ClipLoader";

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
  setUserToEdit: React.Dispatch<React.SetStateAction<User | undefined>>;
  onClose?: () => void;
  refreshUsers?: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function UserCreate({
  userToEdit,
  setUserToEdit,
  onClose,
  refreshUsers,
  searchQuery,
  setSearchQuery,
}: UserCreateProps) {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const [loading, setLoading] = useState(false);

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

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let isValid = true;

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

    if (!userToEdit) {
      if (!password.trim()) {
        setPasswordError("Please enter Password");
        isValid = false;
      } else if (!validatePassword(password)) {
        setPasswordError(
          "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character."
        );
        isValid = false;
      }
    }

    if (!role) {
      setRoleError("Please select a Role");
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    const formData: any = {
      name: username,
      email,
      role,
    };

    try {
      if (userToEdit) {
        await UsersAPI.UpdateUser(userToEdit._id, formData);
        Swal.fire({
          text: "User updated successfully!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        formData["password"] = password;
        await UsersAPI.signup(formData);
        Swal.fire({
          text: "User created successfully!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
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
      Swal.fire({
        text: "Something went wrong",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mt-4 relative">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          className="flex items-center gap-2 bg-[#16968F] text-white px-6 py-3 rounded-xl hover:bg-emerald-700 cursor-pointer"
          onClick={() => {
            onClose?.();
            setUserToEdit(undefined);
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
          Add New User
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name"
            className="w-full border border-gray-300 rounded-md py-3 pl-14 pr-4"
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white w-[90%] max-w-md rounded-xl shadow-xl border border-[#D9D9D9] p-6">
            <button
              onClick={() => {
                setShowModal(false);
                setUserToEdit(undefined);
                onClose?.();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Close"
                width={15}
                height={15}
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
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                />
                {emailError && (
                  <p className="text-red-600 text-sm mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <select
                  className={`w-full border ${
                    roleError ? "border-red-500" : "border-gray-300"
                  } rounded-md px-4 py-3 custom-select`}
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (roleError) setRoleError("");
                  }}
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a Strong Password"
                    className={`w-full border ${
                      passwordError ? "border-red-500" : "border-gray-300"
                    } rounded-md px-4 py-3 pr-12`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                  />

                  <img
                    src={
                      showPassword
                        ? "/icons/eyeView-icon.svg"
                        : "/icons/eyeView-slash-icon.svg"
                    }
                    alt="Toggle Password"
                    width={20}
                    height={20}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                  {passwordError && (
                    <p className="text-red-600 text-sm mt-1 absolute bottom-[-45px]">
                      {passwordError}
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-left gap-6 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 text-white px-12 py-2 rounded-md mt-8 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#16968F] hover:bg-emerald-700"
    }`}
                >
                  {loading ? (
                    <ClipLoader size={25} color="#16968F" />
                  ) : (
                    <>{userToEdit ? "Update" : "Create"}</>
                  )}
                </button>
                <button
                  type="button"
                  className="border border-gray-300 px-12 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer mt-8"
                  onClick={() => {
                    setShowModal(false);
                    setUserToEdit(undefined);
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
