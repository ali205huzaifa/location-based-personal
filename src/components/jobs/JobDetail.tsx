import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import ClipLoader from "react-spinners/ClipLoader";
import JobProfileTab from "./JobProfileTab";

export default function JobDetailView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [activeTab, setActiveTab] = useState("Candidate Profile");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobRes, allApplicationsRes] = await Promise.all([
          JobsAPI.getById(id),
          JobsAPI.getAllApplications(),
        ]);

        setJob(jobRes.data);

        const jobCandidates = allApplicationsRes.data.data.filter(
          (app: any) => app.jobId === id
        );

        setCandidates(jobCandidates);
      } catch (err) {
        console.error("Failed to load job/candidates", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
              {job?.updatedBy?.name || "Unknown"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 ml-10 text-sm mt-3 text-gray-900">
          <span className="capitalize">
            {job.jobType.replace(/_/g, " ").toLowerCase()}
          </span>{" "}
          |<span>{job.experienceLevel} Level</span> |
          <span className="capitalize">{job.workplaceType.toLowerCase()}</span>{" "}
          |<span>{job.totalPositions} Position(s)</span> |
          <span>{job.location}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[340px] border-r overflow-y-auto px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between border rounded-lg px-4 py-2 bg-white shadow-sm mb-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
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
              />
              <img
                src="/icons/calender-icon.svg"
                alt="Calendar"
                className="w-4 h-4 opacity-60 cursor-pointer"
              />
              <select
                className="text-sm text-gray-800 bg-transparent focus:outline-none cursor-pointer"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="text-sm mb-2 py-2 border-t border-b border-gray-300">
            Total {candidates.length} Applicants
          </div>
          <div className="h-[400px] overflow-y-auto pr-1">
            <ul className="space-y-2">
              {candidates.map((app: any) => {
                const c = app.candidate;
                return (
                  <li
                    key={app._id}
                    onClick={() => {
                      setSelectedApplication(app);
                      setActiveTab("Candidate Profile");
                    }}
                    className={`bg-white p-3 shadow-sm hover:bg-gray-100 cursor-pointer border-b border-gray-300 ${
                      selectedApplication?._id === app._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <div>{new Date(app.appliedAt).toLocaleDateString()}</div>
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
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex-1 bg-white p-2 overflow-y-auto ml-10">
          {selectedApplication ? (
            <>
              <div className="flex gap-10 border-b mb-4">
                {["Candidate Profile", "Questions Form", "Evaluation Form"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`py-2 px-4 capitalize border-b-2 ${
                        activeTab === tab
                          ? "border-teal-600 text-teal-600"
                          : "border-transparent"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.replace(/^\w/, (c) => c.toUpperCase())}
                    </button>
                  )
                )}
              </div>

              {activeTab === "Candidate Profile" && (
                <JobProfileTab application={selectedApplication} />
              )}
              {activeTab === "Questions Form" && (
                <div className="text-sm text-gray-600">
                  Questions Form goes here
                </div>
              )}
              {activeTab === "Evaluation Form" && (
                <div className="text-sm text-gray-600">
                  Evaluation Form goes here
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-600 text-center mt-20">
              Select a candidate to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
