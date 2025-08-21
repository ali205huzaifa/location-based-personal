import { useEffect, useState } from "react";
import InterviewerAPI from "../../api/interviewersApi/InterviewersAPI";
import type { Interviewer } from "../../types/user";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

interface Props {
  fetchInterviewers: () => Promise<void>;
  editData: Interviewer | null;
  setEditData: React.Dispatch<React.SetStateAction<Interviewer | null>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

export default function InterviewerCreate({
  fetchInterviewers,
  editData,
  setEditData,
  searchQuery,
  setSearchQuery,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [departmentError, setDepartmentError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setEmail(editData.email);
      setDepartment(editData.designation);
      setShowModal(true);
    }
  }, [editData]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setNameError("");
    setEmailError("");
    setDepartmentError("");
    setEditData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let isValid = true;

    if (!name.trim()) {
      setNameError("Please enter Interviewer Name");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Please enter Email");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid Email");
      isValid = false;
    }

    if (!department.trim()) {
      setDepartmentError("Please enter Department");
      isValid = false;
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    const formData = { name, email, designation: department };

    try {
      if (editData) {
        await InterviewerAPI.UpdateInterviewer(editData._id, formData);
        Swal.fire({
          title: "Updated!",
          text: "Interviewer updated successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
        });
      } else {
        await InterviewerAPI.CreateInterviewer(formData);
        Swal.fire({
          title: "Created!",
          text: "Interviewer created successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
        });
      }

      await fetchInterviewers();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error("API Error:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong.",
        confirmButtonColor: "#16968F",
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
            setShowModal(true);
            resetForm();
          }}
        >
          <img
            src="/icons/jobs-icon.svg"
            alt="Jobs Icon"
            width={20}
            height={20}
          />
          Add Interviewer
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
            placeholder="Start typing to search Interviewers By Name"
            className="w-full border border-gray-300 rounded-md py-3 pl-14 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
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

            <h2 className="text-xl font-semibold mb-6">
              {editData ? "Update Interviewer" : "Add Interviewer"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Enter Interviewer Name"
                  className={`w-full border ${
                    nameError ? "border-red-500" : "border-gray-300"
                  } rounded-md px-4 py-3`}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                />
                {nameError && (
                  <p className="text-red-600 text-sm mt-1">{nameError}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Enter Interviewer Email"
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
                <input
                  type="text"
                  placeholder="Enter Department Name"
                  className={`w-full border ${
                    departmentError ? "border-red-500" : "border-gray-300"
                  } rounded-md px-4 py-3`}
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (departmentError) setDepartmentError("");
                  }}
                />
                {departmentError && (
                  <p className="text-red-600 text-sm mt-1">{departmentError}</p>
                )}
              </div>

              <div className="flex justify-left gap-6 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 text-white px-10 py-2 rounded-md 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#16968F] hover:bg-emerald-700"
    }`}
                >
                  {loading ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    <>{editData ? "Update" : "Add"}</>
                  )}
                </button>
                <button
                  type="button"
                  className="border border-gray-300 px-8 py-2 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
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
