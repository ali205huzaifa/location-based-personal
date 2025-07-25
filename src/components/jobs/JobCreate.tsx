import { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

const FontWeightStyle = Quill.import("attributors/style/font");
FontWeightStyle.whitelist = ["normal", "medium", "semibold", "bold"];
Quill.register(FontWeightStyle, true);

type JobFormErrors = {
  designation?: string;
  jobDescription?: string;
  skills?: string;
  department?: string;
  openings?: string;
  gender?: string;
  jobType?: string;
  experience?: string;
  workplace?: string;
  location?: string;
  jobStatus?: string;
};

export default function JobCreate() {
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [designation, setDesignation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [level, setLevel] = useState("");
  const [department, setDepartment] = useState("");
  const [openings, setOpenings] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [location, setLocation] = useState("");
  const [jobStatus, setJobStatus] = useState("");

  const validateForm = () => {
    const newErrors: JobFormErrors = {};
    if (!designation) newErrors.designation = "Please select Job Title";
    if (!jobDescription.trim())
      newErrors.jobDescription = "Please enter Job Description";
    if (skills.length === 0)
      newErrors.skills = "Please enter at least one Required Skill";
    if (!department) newErrors.department = "Please select Job Department";
    if (!openings) newErrors.openings = "Please select No of Openings";
    if (!selectedGender) newErrors.gender = "Please select Job Preference";
    if (!jobType) newErrors.jobType = "Please select Job Type";
    if (!experience)
      newErrors.experience = "Please select Job Experience Level";
    if (!workplace) newErrors.workplace = "Please select Job Workplace Type";
    if (!location) newErrors.location = "Please select Job Location";
    if (!jobStatus) newErrors.jobStatus = "Please select Job Status";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      if (editIndex !== null) {
        const updated = [...questions];
        updated[editIndex] = newQuestion.trim();
        setQuestions(updated);
        setEditIndex(null);
      } else {
        setQuestions([...questions, newQuestion.trim()]);
      }
      setNewQuestion("");
      setShowQuestionModal(false);
    }
  };

  const handleSkillAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleQuestionEdit = (index: number) => {
    setNewQuestion(questions[index]);
    setEditIndex(index);
    setShowQuestionModal(true);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
      [{ size: [] }],
      [{ color: [] }, { background: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["blockquote", "code-block"],
      ["clean"],
    ],
    imageResize: {
      parchment: Quill.import("parchment"),
    },
  };

  const quillFormats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "code-block",
    "align",
    "script",
  ];

  return (
    <div className="bg-white mt-4 relative">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          className="font-Regular flex items-center gap-2 bg-[#16968F] text-white px-6 py-3 rounded-xl hover:bg-emerald-700 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <img
            src="/icons/jobs-icon.svg"
            alt="Jobs Icon"
            width={20}
            height={20}
          />
          Post a Job
        </button>

        <div className="relative flex-1">
          {" "}
          <img
            src="/icons/search-icon.svg"
            alt="Search Icon"
            width={20}
            height={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />{" "}
          <input
            type="text"
            placeholder="start typing to search jobs"
            className="font-Regular w-full border border-gray-300 rounded-md py-3 pl-14 pr-4"
          />{" "}
        </div>

        <button className="font-Regular border border-[#000000] px-6 py-3 rounded-xl cursor-pointer">
          Archived Jobs
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="relative bg-[#FFFFFF] w-[90%] max-w-6xl h-[80vh] rounded-xl shadow-xl border border-[#D9D9D9] overflow-y-auto p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-6 text-2xl font-bold text-gray-500 hover:text-black cursor-pointer"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Jobs Icon"
                width={22}
                height={22}
              />
            </button>

            <h2 className="text-2xl font-semibold mb-6 border-b border-gray-400">
              New Job
            </h2>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block mb-4 text-[16px]">Job title</label>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <select
                    className="border border-gray-300 rounded-md px-4 py-4 w-full"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  >
                    <option value="">Select Designation</option>
                    <option value="Flutter Developer">Flutter Developer</option>
                  </select>

                  <select
                    className="border border-gray-300 rounded-md px-4 py-4 w-full"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="">Select Level</option>
                    <option value="Senior Level">Senior Level</option>
                  </select>
                  {errors.designation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.designation}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-4 text-[16px]">
                    Job Description
                  </label>
                  <div className="border border-gray-300 rounded-md p-2 bg-white">
                    <ReactQuill
                      theme="snow"
                      className="h-[250px] overflow-y-auto"
                      value={jobDescription}
                      onChange={setJobDescription}
                      modules={quillModules}
                      formats={quillFormats}
                    />
                  </div>
                  {errors.jobDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobDescription}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block mb-4 text-lg font-semibold text-gray-800">
                    Required Skills
                  </label>
                  <div className="border border-gray-300 rounded-md p-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center bg-[#D9D9D9] text-gray-700 px-3 py-1 rounded-md text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="ml-2 -mr-1 h-4 w-4 flex items-center justify-center rounded-full hover:bg-gray-300 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-0"
                          >
                            <img
                              src="/icons/Skills-cross-icon.svg"
                              alt="Remove"
                              className="h-2 w-2"
                            />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillAdd}
                      placeholder="Type Skill & press Enter"
                      className="w-full focus:outline-none text-gray-700"
                    />
                  </div>
                  {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block font-medium">
                      Questions{" "}
                      <span className="text-[10px] text-gray-500">
                        for candidates
                      </span>
                    </label>
                    <div className="">
                      <button
                        onClick={() => {
                          setNewQuestion("");
                          setEditIndex(null);
                          setShowQuestionModal(true);
                        }}
                        className="w-20 h-8 flex items-center justify-center rounded-md bg-[#D9D9D9] cursor-pointer"
                      >
                        <img
                          src="/icons/plus-icon.svg"
                          alt="Add Question"
                          width={15}
                          height={15}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-md p-4">
                    <div className="mb-4">
                      <div className="flex items-center gap-5 flex-wrap">
                        {[
                          "Current Salary",
                          "Expected Salary",
                          "Notice Period",
                          "Reason for switching",
                        ].map((label, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              className="accent-[#16968F]"
                            />
                            <span className="text-[12px]">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-300 w-full h-[90px] overflow-y-auto">
                      {questions.map((q, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded mb-2"
                        >
                          <span>{q}</span>
                          <div className="flex gap-2">
                            <button onClick={() => handleQuestionEdit(i)}>
                              <img
                                src="/icons/edit-icon.svg"
                                alt="Edit"
                                className="w-4 h-4"
                              />
                            </button>
                            <button
                              onClick={() =>
                                setQuestions(
                                  questions.filter((_, idx) => idx !== i)
                                )
                              }
                            >
                              <img
                                src="/icons/delete-icon.svg"
                                alt="Delete"
                                className="w-4 h-4"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-8">
                  <label className="block mb-6">Job Department</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-4 py-4"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="">Select Department</option>
                    <option value="App Development">App Development</option>
                  </select>
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <label className="block mb-6">No. of Positions</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4"
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                    >
                      <option value="">Select Job Openings</option>
                      <option value="2-4">2-4</option>
                    </select>

                    {errors.openings && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.openings}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-6">Gender Preference</label>
                    <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md px-4 py-3 justify-center">
                      {["Both", "Male", "Female"].map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setSelectedGender(gender)}
                          className={`cursor-pointer px-3 py-1 rounded transition ${
                            selectedGender === gender
                              ? "bg-[#16968F] text-white"
                              : "bg-[#D9D9D9] text-black"
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <label className="block mb-6">Job Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4"
                      value={department}
                      onChange={(e) => setJobType(e.target.value)}
                    >
                      <option>Select Job Type</option>
                      <option>Full Time</option>
                    </select>
                    {errors.jobType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.jobType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-6">Experience Level</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4"
                      value={department}
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      <option>Select Experience</option>
                      <option>1-3 years</option>
                    </select>
                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <label className="block mb-6">Workplace Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4"
                      value={department}
                      onChange={(e) => setWorkplace(e.target.value)}
                    >
                      <option>Select Job Workplace</option>
                      <option>Remote</option>
                    </select>
                    {errors.workplace && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workplace}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-6">Job Location</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4"
                      value={department}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option>Select location</option>
                      <option>Islamabad</option>
                    </select>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-4">Job Status</label>
                  <div className="flex gap-4">
                    {["Active", "Archived"].map((status) => (
                      <label key={status} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value="Active"
                          checked={jobStatus === "Active"}
                          onChange={(e) => setJobStatus(e.target.value)}
                          className="accent-[#16968F]"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                  {errors.jobStatus && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.jobStatus}
                    </p>
                  )}
                </div>

                <div className="flex justify-end mt-10">
                  <button
                    className="flex items-center justify-center bg-[#16968F] gap-2 text-white w-full py-3 rounded-md hover:bg-emerald-700 mr-6 cursor-pointer"
                    onClick={() => {
                      if (validateForm()) {
                        setShowModal(false);
                      }
                    }}
                  >
                    <img
                      src="/icons/jobs-icon.svg"
                      alt="Jobs Icon"
                      width={20}
                      height={20}
                    />
                    Post Job
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showQuestionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10">
              <div className="bg-white p-6 rounded-xl shadow-xl border border-[#D9D9D9] w-[400px] relative">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-black cursor-pointer"
                >
                  <img
                    src="/icons/cross-icon.svg"
                    alt="Jobs Icon"
                    width={22}
                    height={22}
                  />
                </button>
                <div className="flex items-center gap-2 mb-4">
                  <img
                    src="/icons/Question-icon.svg"
                    alt="Jobs Icon"
                    width={20}
                    height={20}
                  />
                  <h3 className="text-lg font-semibold">
                    {editIndex !== null
                      ? "Edit Custom Question"
                      : "Ask Custom Question"}
                  </h3>
                </div>
                <textarea
                  placeholder="Enter your question"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                <div className="flex justify-left">
                  <button
                    onClick={addQuestion}
                    className="bg-[#16968F] text-white px-4 py-2 rounded-md cursor-pointer"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
