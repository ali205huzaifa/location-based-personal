import { useEffect, useState } from "react";
import JobCreate from "./JobCreate";
import JobFilters from "./JobFilters";
import JobRowDisplay from "./JobRowDisplay";
import JobGridDisplay from "./JobGridDisplay";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import type { Job, JobPayloadType } from "../../types/user";
import ClipLoader from "react-spinners/ClipLoader";

export default function JobsView() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [jobToEdit, setJobToEdit] = useState<JobPayloadType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = (page = 1) => {
    setLoading(true);
    JobsAPI.getAll({ page, limit })
      .then((res) => {
        const formattedJobs = res.data.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          department: item.department,
          type: item.jobType,
          experience: item.experienceLevel,
          posted: item.postingStartDate,
          status: item.status,
          positions: item.totalPositions,
          workArrangement: item.workplaceType,
          location: item.location,
          requiredSkills: item.requiredSkills,

          description: item.description,
          experienceLevel: item.experienceLevel,
          employmentType: item.employmentType,
          postingStartDate: item.postingStartDate,
          postingEndDate: item.postingEndDate,
          salaryRange: item.salaryRange,
        }));

        setJobs(formattedJobs);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
      })
      .finally(() => setLoading(false));
  };

  const handleEditJob = (job: Job) => {
    JobsAPI.getById(job.id)
      .then((res) => {
        const jobData = res.data;

        const formattedJob: JobPayloadType = {
          id: jobData._id,
          title: jobData.title,
          department: jobData.department,
          type: jobData.jobType,
          experienceLevel: jobData.experienceLevel,
          posted: jobData.postingStartDate,
          status: jobData.status,
          positions: jobData.totalPositions,
          workArrangement: jobData.workplaceType,
          location: jobData.location,
          requiredSkills: jobData.requiredSkills,
          description: jobData.description,
          employmentType: jobData.employmentType,
          postingStartDate: jobData.postingStartDate,
          postingEndDate: jobData.postingEndDate,
          salaryRange: jobData.salaryRange,
          skills: jobData.skills,
        };

        setJobToEdit(formattedJob);
        setShowModal(true);
      })
      .catch((err) => {
        console.error("Failed to fetch job details:", err);
      });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="px-6 mt-4">
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
        <JobCreate
          showModal={showModal}
          isEdit={!!jobToEdit}
          jobToEdit={jobToEdit}
          setShowModal={setShowModal}
        />
      )}
      <JobFilters />

      <div className="bg-black text-white/80 px-4 py-5 flex items-center justify-between rounded-t-lg mt-4">
        <span className="font-Regular text-[20.38px]">
          Showing all Jobs{" "}
          <span className="text-[11.91px]">- {jobs.length} Results</span>
        </span>

        <div className="flex items-center gap-4">
          <span className="font-Regular text-[11.91px]">
            {view === "list" ? "Showing List view" : "Showing Card view"}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`cursor-pointer p-1.5 rounded ${
                view === "list"
                  ? "bg-[#202020] text-black"
                  : "bg-transparent text-white"
              }`}
            >
              <img
                src="/icons/List-icon.svg"
                alt="List"
                width={20}
                height={20}
              />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`cursor-pointer p-1.5 rounded ${
                view === "grid"
                  ? "bg-[#202020] text-black"
                  : "bg-transparent text-white"
              }`}
            >
              <img
                src="/icons/grid-icon.svg"
                alt="Grid"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10 min-h-[200px]">
          <ClipLoader size={35} color="#16968F" />
        </div>
      ) : view === "list" ? (
        <JobRowDisplay jobs={jobs} onEditJob={handleEditJob} />
      ) : (
        <JobGridDisplay jobs={jobs} onEditJob={handleEditJob} />
      )}

      {totalPages >= 1 && (
        <div className="flex justify-center mt-6 gap-4 items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
