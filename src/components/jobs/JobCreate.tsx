import { useState, useEffect } from "react";
import Select from "react-select";
import type { StylesConfig, GroupBase } from "react-select";
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
      ["bold", "italic", "underline"],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
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
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "code-block",
    "align",
    "script",
  ];

  const customStyles: StylesConfig<any, false, GroupBase<any>> = {
    control: (base) => ({
      ...base,
      backgroundColor: "white",
      borderRadius: "0.5rem",
      borderColor: "#D9D9D9",
      minHeight: "50px",
      padding: "4px 8px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#D9D9D9",
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: "black",
      fontWeight: 400,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? "#16968F"
        : state.isFocused
        ? "#e5f4f2"
        : "white",
      color: state.isSelected
        ? "white"
        : state.isFocused
        ? "#16968F"
        : "#374151",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "black",
      padding: "4px",
      "&:hover": {
        color: "black",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div className="bg-white mt-4 relative">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white w-full h-full rounded-none shadow-xl border border-[#D9D9D9] overflow-y-auto p-6">
            <button
              onClick={() => {
                resetForm();
                setShowModal(false);
              }}
              className="absolute top-8 right-6 text-2xl font-bold text-gray-500 hover:text-black cursor-pointer"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Close"
                width={20}
                height={20}
              />
            </button>

            {isEdit && jobToEdit ? (
              <div className="flex items-center justify-between border-b border-gray-400 pb-3 mb-4 pr-10">
                <h2 className="text-black text-2xl font-normal leading-10 flex items-center gap-2">
                  Edit Job
                  <span className="text-gray-500 text-base">
                    #{jobToEdit.id.slice(-6)}
                  </span>
                </h2>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <span className="justify-start text-zinc-900 text-sm font-medium urbanist leading-7">
                    Posted by :
                  </span>
                  <img
                    src="/icons/User.svg"
                    alt="User"
                    className="w-4 h-4 text-gray-500"
                  />
                  <span>{jobToEdit.createdBy?.name}</span>
                </div>
              </div>
            ) : (
              <h2 className="text-black text-2xl font-normal leading-10 mb-4 border-b border-gray-400">
                New Job
              </h2>
            )}

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block mb-4 justify-start text-zinc-900 text-base font-normal leading-loose">
                  Job title
                </label>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Enter Job Title"
                    className="border border-gray-300 rounded-md px-4 py-3 w-full"
                    maxLength={25}
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
                  <label className="block mb-4 justify-start text-zinc-900 text-base font-normal leading-loose">
                    Job Description
                  </label>
                  <div className="border border-gray-300 rounded-md bg-white">
                    <ReactQuill
                      theme="snow"
                      className="
    [&_.ql-toolbar]:sticky 
    [&_.ql-toolbar]:top-0 
    [&_.ql-toolbar]:z-10 
    [&_.ql-toolbar]:bg-white 
    overflow-hidden 
    [&_.ql-container]:max-h-[220px] 
    [&_.ql-container]:overflow-y-auto
  "
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
                  <label className="block mb-4 justify-start text-zinc-900 text-base font-normal leading-loose">
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
                    <label className="block justify-start text-zinc-900 text-base font-normal leading-loose">
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

              <div className="border-l border-gray-300 pl-8">
                <div className="mb-8">
                  <label className="block mb-6 justify-start text-zinc-900 text-base font-normal leading-loose">
                    Job Department
                  </label>
                  <Select
                    value={
                      department
                        ? {
                            value: department,
                            label: department
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (char) => char.toUpperCase()),
                          }
                        : null
                    }
                    onChange={(option) => {
                      setDepartment(option?.value || "");
                      clearError("department");
                    }}
                    options={[
                      {
                        value: "MOBILE_APP_DEVELOPMENT",
                        label: "Mobile Development",
                      },
                      { value: "HUMAN_RESOURCE", label: "Human Resource" },
                      { value: "WEB_DEVELOPMENT", label: "Web Development" },
                      { value: "MARKETING", label: "Marketing" },
                      {
                        value: "ARTIFICIAL_INTELLIGENCE",
                        label: "Artificial Intelligence",
                      },
                      {
                        value: "BUSINESS_DEVELOPMENT",
                        label: "Business Development",
                      },
                      { value: "UI/UX", label: "UI/UX" },
                      { value: "GAME_DEVELOPMENT", label: "Game Development" },
                    ]}
                    styles={customStyles}
                    placeholder="Select Department"
                  />

                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.department}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <label className="block mb-6 justify-start text-zinc-900 text-base font-normal leading-loose">
                      No. of Positions
                    </label>
                    <Select
                      value={
                        openings ? { value: openings, label: openings } : null
                      }
                      onChange={(option) => {
                        setOpenings(option?.value || "");
                        clearError("openings");
                      }}
                      options={[
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                      ]}
                      styles={customStyles}
                      placeholder="Select Job Openings"
                    />

                    {errors.openings && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.openings}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-6 justify-start text-zinc-900 text-base font-normal leading-loose">
                      Gender Preference
                    </label>
                    <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md px-4 py-2 justify-center">
                      {[
                        { label: "Both", value: "OTHER" },
                        { label: "Male", value: "MALE" },
                        { label: "Female", value: "FEMALE" },
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
                    <label className="block mb-6 justify-start text-zinc-900 text-base font-normal leading-loose">
                      Job Type
                    </label>
                    <Select
                      value={
                        jobType
                          ? {
                              value: jobType,
                              label: jobType
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase()),
                            }
                          : null
                      }
                      onChange={(option) => {
                        setJobType(option?.value || "");
                        clearError("jobType");
                      }}
                      options={[
                        { value: "FULL_TIME", label: "Full Time" },
                        { value: "PART_TIME", label: "Part Time" },
                        { value: "CONTRACT", label: "Contract Based" },
                        { value: "INTERNSHIP", label: "Internship" },
                      ]}
                      styles={customStyles}
                      placeholder="Select Job Type"
                    />

                    {errors.jobType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.jobType}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-6 justify-start text-zinc-900 text-base font-normal leading-loose">
                      Experience Level
                    </label>
                    <Select
                      value={
                        experience
                          ? {
                              value: experience,
                              label: experience
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase()),
                            }
                          : null
                      }
                      onChange={(option) => {
                        setExperience(option?.value || "");
                        clearError("experience");
                      }}
                      options={[
                        { value: "0", label: "No Previous Experience" },
                        { value: "0-1", label: "0-1 years" },
                        { value: "1-3", label: "1-3 years" },
                        { value: "3-5", label: "3-5 years" },
                      ]}
                      styles={customStyles}
                      placeholder="Select Experience"
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div>
                    <label className="block mb-6 justify-start text-zinc-900 text-base font-normal leading-loose">
                      Workplace Type
                    </label>
                    <Select
                      value={
                        workplace
                          ? {
                              value: workplace,
                              label: workplace
                                .replace(/_/g, "-")
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase()),
                            }
                          : null
                      }
                      onChange={(option) => {
                        setWorkplace(option?.value || "");
                        clearError("workplace");
                      }}
                      options={[
                        { value: "REMOTE", label: "Remote" },
                        { value: "HYBRID", label: "Hybrid" },
                        { value: "ON_SITE", label: "On-Site" },
                      ]}
                      styles={customStyles}
                      placeholder="Select Job Workplace"
                    />
                    {errors.workplace && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workplace}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-6 justify-start text-zinc-900 text-base font-normal leading-loose">
                      Job Location
                    </label>
                    <Select
                      value={
                        location ? { value: location, label: location } : null
                      }
                      onChange={(option) => {
                        setLocation(option?.value || "");
                        clearError("location");
                      }}
                      options={[{ value: "Islamabad", label: "Islamabad" }]}
                      styles={customStyles}
                      placeholder="Select Location"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-4 justify-start text-zinc-900 text-base font-normal leading-loose">
                    Job Status
                  </label>
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

                <div className="fixed bottom-10 right-0 w-1/2 px-8">
                  <button
                    type="button"
                    className={`flex items-center justify-center gap-2 text-white w-full py-3 rounded-md cursor-pointer 
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
                        {jobToEdit ? "Save changes" : "Post Job"}
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
                    className="bg-[#16968F] text-white px-8 py-2 rounded-md cursor-pointer"
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
