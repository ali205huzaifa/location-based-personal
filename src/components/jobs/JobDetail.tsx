import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import CandidatesAPI from "../../api/candidatesApi/CandidateAPI";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import JobProfileTab from "./JobProfileTab";
import JobAssesmentForm from "./JobAssesmentForm";
import JobEvaluationForm from "./JobEvaluationForm";
import { motion, AnimatePresence } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("Candidate Profile");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const initialLoad = useRef(true);
  const [sortOption, setSortOption] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [tempStatus, setTempStatus] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [tempLocation, setTempLocation] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const jobRes = await JobsAPI.getById(id);
        setJob(jobRes.data);

        const counts = jobRes.data.applicationCounts || {};
        setTotalCount(counts.totalApplications || 0);
        setUnreadCount(counts.unreadApplications || 0);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const fetchCandidates = async (
    page: number = currentPage,
    append = false
  ) => {
    if (!id) return;
    try {
      setListLoading(true);

      const params: Record<string, any> = {
        jobId: id,
        page,
        limit: pageSize,
      };

      if (searchTerm.trim()) params.candidateName = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (genderFilter) params.candidateGender = genderFilter;
      if (locationFilter) params.candidateLocation = locationFilter;
      if (sortOption) params.sort = Number(sortOption);

      const res = await CandidatesAPI.getAll(params);
      const data = Array.isArray(res.data.data) ? res.data.data : [];

      if (append) {
        setCandidates((prev) => [...prev, ...data]);
      } else {
        setCandidates(data);
      }

      setCurrentPage(res.data.currentPage || page);

      if (
        data.length < pageSize ||
        res.data.currentPage >= res.data.totalPages
      ) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        text: "Failed to fetch candidates",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      setCandidates([]);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const delayDebounce = setTimeout(() => {
      setCandidates([]);
      setCurrentPage(1);
      fetchCandidates(1, false);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (initialLoad.current) return;
    initialLoad.current = true;
    setCandidates([]);
    setCurrentPage(1);
    fetchCandidates(1, false);
  }, [statusFilter, genderFilter, locationFilter, sortOption]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      !listLoading &&
      hasMore &&
      scrollHeight - scrollTop <= clientHeight + 50
    ) {
      fetchCandidates(currentPage + 1, true);
    }
  };

  const handleSelectCandidate = async (app: any) => {
    setSelectedApplication(app);
    setActiveTab("Candidate Profile");

    if (!app.isRead) {
      try {
        await JobsAPI.UpdateUnreadCountByJobId(app._id, {
          isRead: true,
          readAt: new Date().toISOString(),
        });

        setCandidates((prev: any[]) =>
          prev.map((candidate) =>
            candidate._id === app._id
              ? { ...candidate, isRead: true, readAt: new Date().toISOString() }
              : candidate
          )
        );

        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    }
  };

  const resetFilters = () => {
    setTempStatus("");
    setTempGender("");
    setTempLocation("");
  };

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
          <div className="ml-auto flex items-center gap-8 text-sm text-gray-700">
            <span>Status: {job.status}</span>
            <span className="flex items-center gap-1">
              Posted By:
              <img src="/icons/User.svg" alt="User Icon" className="w-4 h-4" />
              {job?.createdBy?.name || "Unknown"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 ml-10 text-sm mt-3 text-gray-900">
          <span className="capitalize text-slate-900 text-base font-normal">
            {job.jobType.replace(/_/g, " ").toLowerCase()}
          </span>

          <img
            src="/icons/line.svg"
            alt="separator"
            className="w-px h-4 bg-slate-900 mt-1"
          />

          <span className=" capitalize text-slate-900 text-base font-normal">
            {job.experienceLevel} Yrs Experience
          </span>

          <img
            src="/icons/line.svg"
            alt="separator"
            className="w-px h-4 bg-slate-900 mt-1"
          />

          <span className="capitalize text-slate-900 text-base font-normal">
            {job.workplaceType.replace(/_/g, "-").toLowerCase()}
          </span>

          <img
            src="/icons/line.svg"
            alt="separator"
            className="w-px h-4 bg-slate-900 mt-1"
          />

          <span className="text-slate-900 text-base font-normal">
            0{job.totalPositions} Positions
          </span>

          <img
            src="/icons/line.svg"
            alt="separator"
            className="w-px h-4 bg-slate-900 mt-1"
          />

          <span className="text-slate-900 text-base font-normal">
            {job.cityId?.name}
          </span>

          <img
            src="/icons/line.svg"
            alt="separator"
            className="w-px h-4 bg-slate-900 mt-1"
          />

          <span className="capitalize text-slate-900 text-base font-normal">
            {job.gender.toLowerCase() === "other"
              ? "Both genders"
              : job.gender.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="flex flex-1 p-4 gap-8">
        <div className="w-[360px] max-h-[850px] border-r overflow-y-auto py-3 border border-gray-300 rounded-lg p-4 bg-white">
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

          <div className="flex justify-between items-center text-sm mb-2 py-2 border-t border-b border-gray-300">
            <span>Total {totalCount} Applicants</span>
            <span className="justify-start text-neutral-600 text-xs font-normal leading-snug">
              Unread( {unreadCount} )
            </span>
          </div>

          <div
            className="max-h-[700px] overflow-y-auto pr-1"
            onScroll={handleScroll}
          >
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
                        onClick={() => handleSelectCandidate(app)}
                        className={`p-4 cursor-pointer border-b border-gray-300 ${
                          selectedApplication?._id === app._id
                            ? "opacity-10 bg-stone-100"
                            : "hover:bg-gray-100"
                        } ${!app.isRead ? "border-l-2 border-teal-600" : ""}`}
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
                            className={`text-xs font-normal ${
                              app.status === "INTERVIEW_SCHEDULED"
                                ? "text-[#16968F]"
                                : app.status === "REJECTED"
                                ? "text-[#961616]"
                                : app.status === "SHORTLISTED"
                                ? "text-[#A37302]"
                                : app.status === "REVIEWED"
                                ? "text-[#000000]"
                                : app.status === "APPLIED"
                                ? "text-[#000000]"
                                : app.status === "SELECTED"
                                ? "text-[#000000]"
                                : "text-[#000000]"
                            }`}
                          >
                            {app.status
                              .toLowerCase()
                              .replace(/_/g, " ")
                              .replace(/^\w/, (c: string) => c.toUpperCase())}
                          </div>
                        </div>
                        <div className="text-black text-base font-medium">
                          {c?.fullName}
                        </div>
                        <div className="text-indigo-700 text-sm">
                          {c?.currentLocation || "No City"}
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <img
                            src="/icons/comment-icon.svg"
                            alt="List"
                            width={15}
                            height={15}
                          />
                          <div className="justify-start text-neutral-500 text-xs font-medium urbanist leading-tight">
                            {app.comments?.length > 0
                              ? app.comments[app.comments.length - 1].text
                              : "No comment"}
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

        <div className="flex-1 bg-white p-2 overflow-y-auto border rounded-lg max-h-[850px]">
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
                    className={`px-5 py-2 rounded-t-md text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "border-teal-600 text-teal-600 bg-white border"
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
              {activeTab === "Assessment Form" && selectedApplication && (
                <JobAssesmentForm
                  applicationId={selectedApplication._id}
                  assessmentData={selectedApplication.applicationAssessmentData}
                  AssessmentDate={selectedApplication.applicationAssessmentDate}
                  candidateDetails={{
                    name: selectedApplication?.candidate?.fullName || "—",
                    email: selectedApplication?.candidate?.email || "—",
                    phone: selectedApplication?.candidate?.phoneNumber || "—",
                    gender: selectedApplication?.candidate?.gender || "—",
                    location:
                      selectedApplication?.candidate?.currentLocation || "—",
                    positionApplied: selectedApplication?.job?.title || "—",
                  }}
                />
              )}

              {activeTab === "Evaluation Form" && (
                <JobEvaluationForm
                  applicationId={selectedApplication._id}
                  interviewerEvaluations={
                    selectedApplication.interviewerEvaluations
                  }
                />
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
            <div className="flex justify-between items-center mb-4 border-b outline-black/75">
              <h2 className="justify-center text-slate-900 text-2xl font-normal leading-normal mb-2">
                Filters
              </h2>
              <button
                onClick={() => {
                  setIsFilterOpen(false);
                  setTempStatus("");
                  setTempGender("");
                  setTempLocation("");
                  setStatusFilter("");
                  setGenderFilter("");
                  setLocationFilter("");
                  setCurrentPage(1);
                  fetchCandidates(1);
                }}
              >
                <img
                  src="/icons/cross-icon.svg"
                  alt="List"
                  width={15}
                  height={15}
                />
              </button>
            </div>

            <h3 className="justify-center text-neutral-600 text-lg font-normal leading-none mb-4">
              Status Filter
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-6">
              {[
                "APPLIED",
                "REVIEWED",
                "SHORTLISTED",
                "INTERVIEW_SCHEDULED",
                "SELECTED",
                "REJECTED",
              ].map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-4 accent-[#16968F]"
                >
                  <input
                    type="checkbox"
                    value={status}
                    checked={tempStatus === status}
                    onChange={(e) =>
                      setTempStatus(e.target.checked ? e.target.value : "")
                    }
                  />
                  {status
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </label>
              ))}
            </div>
            <div className="border-b outline-black/75" />

            <h3 className="justify-center text-neutral-600 text-lg font-normal leading-none mb-4 mt-4">
              Gender
            </h3>
            <div className="flex gap-10 text-sm mb-6">
              {["MALE", "FEMALE", "OTHER"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-4 accent-[#16968F]"
                >
                  <input
                    type="checkbox"
                    value={gender}
                    checked={tempGender === gender}
                    onChange={(e) =>
                      setTempGender(e.target.checked ? e.target.value : "")
                    }
                  />
                  {gender.charAt(0) + gender.slice(1).toLowerCase()}
                </label>
              ))}
            </div>
            <div className="border-b outline-black/75" />

            <h3 className="justify-center text-neutral-600 text-lg font-normal leading-none mb-4 mt-4">
              Location
            </h3>
            <div className="flex gap-4 text-sm mb-6">
              {["Islamabad", "Rawalpindi"].map((loc) => (
                <label
                  key={loc}
                  className="flex items-center gap-4 accent-[#16968F]"
                >
                  <input
                    type="checkbox"
                    value={loc}
                    checked={tempLocation === loc}
                    onChange={(e) =>
                      setTempLocation(e.target.checked ? e.target.value : "")
                    }
                  />
                  {loc}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-8 mt-4">
              <button
                className="justify-start text-black text-sm font-normal underline"
                onClick={resetFilters}
              >
                Clear Filters
              </button>
              <button
                className="bg-teal-600 text-white text-sm font-normal px-8 py-2 rounded"
                onClick={() => {
                  setStatusFilter(tempStatus);
                  setGenderFilter(tempGender);
                  setLocationFilter(tempLocation);
                  setCurrentPage(1);
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
