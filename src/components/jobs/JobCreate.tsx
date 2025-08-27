import { useState, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import Swal from "sweetalert2";
import type { ApplicationQuestion, JobPayloadType } from "../../types/user";
import ClipLoader from "react-spinners/ClipLoader";

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

type JobCreateProps = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  jobToEdit?: JobPayloadType | null;
  isEdit?: boolean;
};

export default function JobCreate({
  showModal,
  setShowModal,
  jobToEdit,
}: JobCreateProps) {
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [designation, setDesignation] = useState("");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [department, setDepartment] = useState("");
  const [openings, setOpenings] = useState("");
  const [jobType, setJobType] = useState("");
  const [experience, setExperience] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [location, setLocation] = useState("");
  const [jobStatus, setJobStatus] = useState("");

  const [loading, setLoading] = useState(false);

  const [predefinedQuestions, setPredefinedQuestions] = useState({
    currentSalary: false,
    expectedSalary: false,
    noticePeriod: false,
    reasonForSwitching: false,
  });

  useEffect(() => {
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    setStartDate(now.toISOString().split("T")[0]);
    setEndDate(oneMonthLater.toISOString().split("T")[0]);
  }, []);

  const validateForm = () => {
    const newErrors: JobFormErrors = {};
    if (!designation) newErrors.designation = "Please select Job Title";
    if (!jobDescription.trim())
      newErrors.jobDescription = "Please enter Job Description";
    if (skills.length === 0)
      newErrors.skills = "Please enter at least one Required Skill";
    if (!department) newErrors.department = "Please select Job Department";
    if (!selectedGender) newErrors.gender = "Please select Job Preference";
    if (!openings) newErrors.openings = "Please select No of Openings";
    if (!jobType) newErrors.jobType = "Please select Job Type";
    if (!experience)
      newErrors.experience = "Please select Job Experience Level";
    if (!workplace) newErrors.workplace = "Please select Job Workplace Type";
    if (!location) newErrors.location = "Please select Job Location";
    if (!jobStatus) newErrors.jobStatus = "Please select Job Status";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof JobFormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const resetForm = () => {
    setErrors({});
    setDesignation("");
    setJobDescription("");
    setSkills([]);
    setDepartment("");
    setOpenings("");
    setSelectedGender("");
    setJobType("");
    setExperience("");
    setWorkplace("");
    setLocation("");
    setJobStatus("");
    setStartDate(getTodayDate());
    setEndDate(getNextMonthDate());
    setQuestions([]);
    setPredefinedQuestions({
      currentSalary: false,
      expectedSalary: false,
      noticePeriod: false,
      reasonForSwitching: false,
    });
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
        clearError("skills");
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

  const isEdit = !!jobToEdit;

  const handleSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);

    const payload = {
      title: designation,
      description: jobDescription,
      department,
      totalPositions: Number(openings),
      workplaceType: workplace,
      postingStartDate: new Date(startDate).toISOString(),
      postingEndDate: new Date(endDate).toISOString(),
      requiredSkills: skills,
      experienceLevel: experience,
      jobType,
      location,
      status: jobStatus,
      gender: selectedGender?.toUpperCase(),
      applicationQuestions: [
        ...Object.entries(predefinedQuestions)
          .filter(([_, val]) => val)
          .map(([key]) => ({
            label:
              key === "currentSalary"
                ? "Current Salary"
                : key === "expectedSalary"
                ? "Expected Salary"
                : key === "noticePeriod"
                ? "Notice Period"
                : "Reason for switching",
            fieldType: "TEXT",
            isRequired: true,
          })),
        ...questions.map((q) => ({
          label: q,
          fieldType: "TEXT",
          isRequired: true,
        })),
      ],
    };

    const apiCall = isEdit
      ? JobsAPI.UpdateJobById(jobToEdit.id, payload)
      : JobsAPI.AddJob(payload);

    apiCall
      .then(() => {
        Swal.fire({
          title: "Success!",
          text: isEdit
            ? "Job updated Successfully!"
            : "Job posted Successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
        }).then(() => {
          setShowModal(false);
          resetForm();
          window.location.reload();
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          confirmButtonColor: "#16968F",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getNextMonthDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 1);
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (isEdit && jobToEdit) {
      setDesignation(jobToEdit.title || "");
      setJobDescription(jobToEdit.description || "");
      setSkills(jobToEdit.requiredSkills || []);
      setDepartment(jobToEdit.department || "");
      setOpenings(String(jobToEdit.positions || ""));
      setSelectedGender(jobToEdit.gender || "");
      setJobType(jobToEdit.type || "");
      setExperience(jobToEdit.experienceLevel || "");
      setWorkplace(jobToEdit.workArrangement || "");
      setLocation(jobToEdit.location || "");
      setJobStatus(jobToEdit.status || "Active");
      setStartDate(jobToEdit.postingStartDate?.split("T")[0] || getTodayDate());
      setEndDate(jobToEdit.postingEndDate?.split("T")[0] || getNextMonthDate());

      setQuestions(
        (jobToEdit.applicationQuestions || [])
          .filter(
            (q: ApplicationQuestion) =>
              ![
                "Current Salary",
                "Expected Salary",
                "Notice Period",
                "Reason for switching",
              ].includes(q.label)
          )
          .map((q: ApplicationQuestion) => q.label)
      );

      const predefs: Record<
        | "currentSalary"
        | "expectedSalary"
        | "noticePeriod"
        | "reasonForSwitching",
        boolean
      > = {
        currentSalary: false,
        expectedSalary: false,
        noticePeriod: false,
        reasonForSwitching: false,
      };

      (jobToEdit.applicationQuestions || []).forEach(
        (q: ApplicationQuestion) => {
          if (q.label === "Current Salary") predefs.currentSalary = true;
          if (q.label === "Expected Salary") predefs.expectedSalary = true;
          if (q.label === "Notice Period") predefs.noticePeriod = true;
          if (q.label === "Reason for switching")
            predefs.reasonForSwitching = true;
        }
      );

      setPredefinedQuestions(predefs);
    }
  }, [isEdit, jobToEdit]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }],
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
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-[#FFFFFF] w-[90%] max-w-6xl h-[75vh] rounded-xl shadow-xl border border-[#D9D9D9] overflow-y-auto p-6">
            <button
              onClick={() => {
                resetForm();
                setShowModal(false);
              }}
              className="absolute top-4 right-6 text-2xl font-bold text-gray-500 hover:text-black cursor-pointer"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Jobs Icon"
                width={15}
                height={15}
              />
            </button>

            <h2 className="text-2xl font-semibold mb-6 border-b border-gray-400">
              {isEdit ? "Edit Job" : "New Job"}
            </h2>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block mb-4 font-bold">Job title</label>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter Job Title"
                    className="border border-gray-300 rounded-md px-4 py-4 w-full"
                    value={designation}
                    onChange={(e) => {
                      setDesignation(e.target.value);
                      clearError("designation");
                    }}
                  />
                  {errors.designation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.designation}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-4 font-bold">
                    Job Description
                  </label>
                  <div className="border border-gray-300 rounded-md p-2 bg-white">
                    <ReactQuill
                      theme="snow"
                      className="h-[250px] overflow-y-auto"
                      value={jobDescription}
                      onChange={(value) => {
                        setJobDescription(value);
                        clearError("jobDescription");
                      }}
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
                  <label className="block mb-4 font-bold">
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
                    <label className="block font-bold">
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
                        {(
                          [
                            { key: "currentSalary", label: "Current Salary" },
                            { key: "expectedSalary", label: "Expected Salary" },
                            { key: "noticePeriod", label: "Notice Period" },
                            {
                              key: "whySwitch",
                              label: "Reason for switching",
                            },
                          ] as {
                            key: keyof typeof predefinedQuestions;
                            label: string;
                          }[]
                        ).map(({ key, label }) => (
                          <div key={key} className="flex items-center gap-1">
                            <input
                              type="checkbox"
                              className="accent-[#16968F]"
                              checked={predefinedQuestions[key]}
                              onChange={(e) =>
                                setPredefinedQuestions((prev) => ({
                                  ...prev,
                                  [key]: e.target.checked,
                                }))
                              }
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

              <input
                type="hidden"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <input
                type="hidden"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <div>
                <div className="mb-8">
                  <label className="block mb-6 font-bold">Job Department</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-4 py-4 custom-select"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      clearError("department");
                    }}
                  >
                    <option value="">Select Department</option>
                    <option value="MOBILE_APP_DEVELOPMENT">
                      Mobile Development
                    </option>
                    <option value="HUMAN_RESOURCE">Human Resource</option>
                    <option value="WEB_DEVELOPMENT">Web Development</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="ARTIFICIAL_INTELLIGENCE">
                      Artificial Intelligence
                    </option>
                    <option value="BUSINESS_DEVELOPMENT">
                      Business Development
                    </option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="GAME_DEVELOPMENT">Game Development</option>
                  </select>

                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <label className="block mb-6 font-bold">
                      No. of Positions
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4 custom-select"
                      value={openings}
                      onChange={(e) => {
                        setOpenings(e.target.value);
                        clearError("openings");
                      }}
                    >
                      <option value="">Select Job Openings</option>
                      <option value="2">1-2</option>
                      <option value="4">2-4</option>
                      <option value="6">5-6</option>
                      <option value="8">6-8</option>
                      <option value="10">8-10</option>
                    </select>

                    {errors.openings && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.openings}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-6 font-bold">
                      Gender Preference
                    </label>
                    <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md px-4 py-3 justify-center">
                      {[
                        { label: "Male", value: "MALE" },
                        { label: "Female", value: "FEMALE" },
                        { label: "Both", value: "OTHER" },
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setSelectedGender((prev) =>
                              prev === value ? "" : value
                            );
                            clearError("gender");
                          }}
                          className={`cursor-pointer px-3 py-1 rounded transition ${
                            selectedGender === value
                              ? "bg-[#16968F] text-white"
                              : "bg-[#D9D9D9] text-black"
                          }`}
                        >
                          {label}
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
                    <label className="block mb-6 font-bold">Job Type</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4 custom-select"
                      value={jobType}
                      onChange={(e) => {
                        setJobType(e.target.value);
                        clearError("jobType");
                      }}
                    >
                      <option value="">Select Job Type</option>
                      <option value="FULL_TIME">Full Time</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract Based</option>
                      <option value="INTERNSHIP">Internship</option>
                    </select>
                    {errors.jobType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.jobType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-6 font-bold">
                      Experience Level
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4 custom-select"
                      value={experience}
                      onChange={(e) => {
                        setExperience(e.target.value);
                        clearError("experience");
                      }}
                    >
                      <option>Select Experience</option>
                      <option value="0">No Previous Experience</option>
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
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
                    <label className="block mb-6 font-bold">
                      Workplace Type
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4 custom-select"
                      value={workplace}
                      onChange={(e) => {
                        setWorkplace(e.target.value);
                        clearError("workplace");
                      }}
                    >
                      <option value="">Select Job Workplace</option>
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ON_SITE">On-Site</option>
                    </select>
                    {errors.workplace && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workplace}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-6 font-bold">Job Location</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-4 py-4 custom-select"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        clearError("location");
                      }}
                    >
                      <option>Select location</option>
                      <option value="Islamabad">Islamabad</option>
                    </select>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-4 font-bold">Job Status</label>
                  <div className="flex gap-4">
                    {[
                      { label: "Active", value: "Active" },
                      { label: "Archived", value: "Inactive" },
                    ].map(({ label, value }) => (
                      <label key={value} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          value={value}
                          checked={jobStatus === value}
                          onChange={(e) => {
                            setJobStatus(e.target.value);
                            clearError("jobStatus");
                          }}
                          className="accent-[#16968F]"
                        />
                        {label}
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
                    type="button"
                    className={`flex items-center justify-center gap-2 text-white w-full py-3 rounded-md mr-6 cursor-pointer 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#16968F] hover:bg-emerald-700"
    }`}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader size={25} color="#16968F" />
                    ) : (
                      <>
                        <img
                          src="/icons/jobs-icon.svg"
                          alt="Jobs Icon"
                          width={20}
                          height={20}
                        />
                        {jobToEdit ? "Update Job" : "Post Job"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showQuestionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white p-6 rounded-xl shadow-xl border border-[#D9D9D9] w-[400px] relative">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="absolute top-2 right-4 text-xl font-bold text-gray-500 hover:text-black cursor-pointer"
                >
                  <img
                    src="/icons/cross-icon.svg"
                    alt="Jobs Icon"
                    width={15}
                    height={15}
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
