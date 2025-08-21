import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import ClipLoader from "react-spinners/ClipLoader";
import JobProfileTab from "./JobProfileTab";
import JobAssesmentForm from "./JobAssesmentForm";
import JobEvaluationForm from "./JobEvaluationForm";
import CandidatesAPI from "../../api/candidatesApi/CandidateAPI";
import Swal from "sweetalert2";

import { motion, AnimatePresence } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function JobDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [activeTab, setActiveTab] = useState("Candidate Profile");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");

  const resetFilters = () => {
    setStatusFilter("");
    setGenderFilter("");
    setLocationFilter("");
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobRes, applicationsRes] = await Promise.all([
          JobsAPI.getById(id),
          JobsAPI.getApplicationsByJob(id),
        ]);

        setJob(jobRes.data);
        setCandidates(applicationsRes.data.data);
      } catch (err: any) {
        console.error("Failed to load job/candidates", err);

        Swal.fire({
          icon: "error",
          title: "Failed to Load Data",
          text:
            err?.response?.data?.message ||
            err?.message ||
            "Something went wrong while fetching job details or candidates.",
          confirmButtonColor: "#16968F",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const fetchCandidates = async () => {
    try {
      setListLoading(true);

      const params: Record<string, any> = {
        jobId: id,
      };

      if (searchTerm.trim()) params.candidateName = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (genderFilter) params.candidateGender = genderFilter;
      if (locationFilter) params.candidateLocation = locationFilter;

      params.sort = sortOption ? Number(sortOption) : -1;

      const res = await CandidatesAPI.getAll(params);
      const arr = Array.isArray(res.data.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      setCandidates(arr);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch candidates. Please try again.",
        confirmButtonColor: "#16968F",
      });
      setCandidates([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const delayDebounce = setTimeout(() => {
      fetchCandidates();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const delayDebounce = setTimeout(() => {
      fetchCandidates();
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (!sortOption) return;
    fetchCandidates();
  }, [sortOption]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <ClipLoader size={35} color="#16968F" loading />
      </div>
    );
  }

  if (!job) {
    return <div className="text-center text-red-600">Job not found.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-6 py-4 bg-white border-gray-300">
        <div className="text-sm text-blue-600 ml-10 capitalize">
          {job.department?.replace(/_/g, " ").toLowerCase()}
        </div>

        <div className="flex flex-wrap justify-between items-start mt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/jobs")}
              className="text-gray-600 hover:text-blue-600 transition text-xl"
              title="Back to Jobs"
            >
              <img
                src="/icons/back-icon.svg"
                alt="List"
                width={10}
                height={10}
              />
            </button>
            <h1 className="text-2xl ml-4 font-Regular">{job.title}</h1>
            <span className="ml-3 text-gray-600 text-sm">
              #{job._id.slice(-6)}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-4 text-sm text-gray-700">
            <span>Status: {job.status}</span>
            <span className="flex items-center gap-1">
              Posted By:
              <img src="/icons/User.svg" alt="User Icon" className="w-4 h-4" />
              {job?.createdBy?.name || "Unknown"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 ml-10 text-sm mt-3 text-gray-900">
          <span className="capitalize">
            {job.jobType.replace(/_/g, " ").toLowerCase()}
          </span>{" "}
          |<span>{job.experienceLevel} Level</span> |
          <span className="capitalize">{job.workplaceType.toLowerCase()}</span>{" "}
          |<span>{job.totalPositions} Positions</span> |
          <span>{job.location}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        <div className="w-[340px] border-r overflow-y-auto py-3 border border-gray-300 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between border rounded-lg px-4 py-2 mb-4">
            <div className="flex gap-2 w-full max-w-sm">
              <img
                src="/icons/search-icon.svg"
                alt="Search"
                className="w-4 h-4 opacity-60"
              />
              <input
                type="text"
                placeholder="Search by name"
                className="outline-none text-sm w-full placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <img
                src="/icons/filtering-icon.svg"
                alt="Filter"
                className="w-4 h-4 opacity-60 cursor-pointer"
                onClick={() => setIsFilterOpen(true)}
              />
              <select
                className="text-sm text-gray-800 bg-transparent focus:outline-none cursor-pointer mr-4"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="-1">Newest</option>
                <option value="1">Oldest</option>
              </select>
            </div>
          </div>

          <div className="text-sm mb-2 py-2 border-t border-b border-gray-300">
            Total {candidates.length} Applicants
          </div>
          <div className="h-[400px] overflow-y-auto pr-1">
            {listLoading ? (
              <div className="flex justify-center items-center py-10">
                <ClipLoader size={35} color="#16968F" loading />
              </div>
            ) : candidates.length === 0 ? (
              <p className="text-center text-lg text-red-500 mt-4">
                No candidates found
              </p>
            ) : (
              <motion.ul
                className="space-y-2"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {candidates.map((app) => {
                    const c = app.candidate;
                    return (
                      <motion.li
                        key={app._id}
                        onClick={() => {
                          setSelectedApplication(app);
                          setActiveTab("Candidate Profile");
                        }}
                        className={`bg-white p-3 shadow-sm cursor-pointer border-b border-gray-300 ${
                          selectedApplication?._id === app._id
                            ? "bg-blue-50"
                            : "hover:bg-gray-100"
                        }`}
                        variants={itemVariants}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                          <div>
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </div>
                          <div
                            className={`font-semibold ${
                              app.status === "Interviewed"
                                ? "text-green-600"
                                : app.status === "Rejected"
                                ? "text-red-500"
                                : app.status === "SHORTLISTED"
                                ? "text-yellow-600"
                                : app.status === "Send Offer Letter"
                                ? "text-purple-600"
                                : "text-gray-500"
                            }`}
                          >
                            {app.status}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{c?.fullName}</div>
                        <div className="text-xs text-blue-600 mt-2">
                          {c?.currentLocation || "No City"}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <img
                            src="/icons/comment-icon.svg"
                            alt="List"
                            width={15}
                            height={15}
                          />
                          <div className="text-xs text-gray-700">
                            {app.recruiterComment || "No comment"}
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>
        </div>

        <div className="flex-1 bg-white p-2 overflow-y-auto border rounded-lg">
          {selectedApplication ? (
            <>
              <div className="flex gap-2 mb-4 border-b border-gray-400">
                {[
                  "Candidate Profile",
                  "Assessment Form",
                  "Evaluation Form",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-t-md border-t border-l border-r text-sm font-medium transition-colors
        ${
          activeTab === tab
            ? "border-teal-600 text-teal-600 bg-white"
            : "border-gray-300 text-gray-600 hover:border-teal-500 hover:text-teal-600"
        }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "Candidate Profile" && (
                <JobProfileTab
                  application={selectedApplication}
                  onStatusChange={fetchCandidates}
                />
              )}
              {activeTab === "Assessment Form" && (
                <JobAssesmentForm applicationId={selectedApplication._id} />
              )}
              {activeTab === "Evaluation Form" && (
                <JobEvaluationForm applicationId={selectedApplication._id} />
              )}
            </>
          ) : (
            <div className="text-gray-600 text-center mt-20">
              Select a candidate to view details
            </div>
          )}
        </div>
      </div>
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[750px]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-400">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  fetchCandidates();
                }}
              >
                {" "}
                <img
                  src="/icons/cross-icon.svg"
                  alt="List"
                  width={15}
                  height={15}
                />
              </button>
            </div>

            <h3 className="font-medium mb-4">Status Filter</h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-6">
              {[
                "APPLICANTS",
                "REVIEWED",
                "SHORTLISTED",
                "INTERVIEW_SCHEDULED",
                "SELECTED",
                "REJECTED",
              ].map((status) => {
                const label = status
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase());

                return (
                  <label
                    key={status}
                    className="flex items-center gap-4 accent-[#16968F]"
                  >
                    <input
                      type="checkbox"
                      value={status}
                      checked={statusFilter === status}
                      onChange={(e) =>
                        setStatusFilter(e.target.checked ? e.target.value : "")
                      }
                    />
                    {label}
                  </label>
                );
              })}
            </div>
            <div className="border-b border-gray-400" />

            <h3 className="font-medium mb-4 mt-4">Gender</h3>
            <div className="flex gap-10 text-sm mb-6">
              {["MALE", "FEMALE", "OTHER"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-4 accent-[#16968F]"
                >
                  <input
                    type="checkbox"
                    value={gender}
                    checked={genderFilter === gender}
                    onChange={(e) =>
                      setGenderFilter(e.target.checked ? e.target.value : "")
                    }
                  />
                  {gender.charAt(0) + gender.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
            <div className="border-b border-gray-400" />

            <h3 className="font-medium mb-4 mt-4">Location</h3>
            <div className="flex gap-4 text-sm mb-6">
              {["Islamabad", "Rawalpindi"].map((loc) => (
                <label
                  key={loc}
                  className="flex items-center gap-4 accent-[#16968F]"
                >
                  <input
                    type="checkbox"
                    value={loc}
                    checked={locationFilter === loc}
                    onChange={(e) =>
                      setLocationFilter(e.target.checked ? e.target.value : "")
                    }
                  />
                  {loc}
                </label>
              ))}
            </div>
            <div className="border-b border-gray-400" />

            <div className="flex justify-end gap-4 mt-4">
              <button className="text-gray-600" onClick={resetFilters}>
                Clear Filters
              </button>
              <button
                className="bg-teal-600 text-white px-4 py-1 rounded"
                onClick={() => {
                  fetchCandidates();
                  setIsFilterOpen(false);
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
