import { useState } from "react";

export default function UserCreate() {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;

    setUsernameError("");
    setEmailError("");
    setPasswordError("");

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
    if (!password.trim()) {
      setPasswordError("Please enter Password");
      isValid = false;
    }

    if (!isValid) return;

    const formData = { username, email, password };
    console.log("Submitted User:", formData);

    setUsername("");
    setEmail("");
    setPassword("");
    setShowModal(false);
  };

  return (
    <div className="bg-white mt-4 relative">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          className="flex items-center gap-2 bg-[#16968F] text-white px-6 py-3 rounded-xl hover:bg-emerald-700 cursor-pointer"
          onClick={() => {
            setShowModal(true);
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
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
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Close"
                width={22}
                height={22}
              />
            </button>

            <h2 className="text-xl font-semibold mb-4">Add User</h2>

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

              <div className="flex justify-left gap-6 mt-6">
                <button
                  type="submit"
                  className="bg-[#16968F] text-white px-8 py-2 rounded-md hover:bg-emerald-700 cursor-pointer"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="border border-gray-300 px-8 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowModal(false);
                    setUsernameError("");
                    setEmailError("");
                    setPasswordError("");
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
