import { useEffect, useState } from "react";
import JobCreate from "./JobCreate";
import JobFilters from "./JobFilters";
import JobRowDisplay from "./JobRowDisplay";
import JobGridDisplay from "./JobGridDisplay";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import type { Job } from "../../types/user";

export default function JobsView() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    JobsAPI.getAll()
      .then((res) => {
        const formattedJobs = res.data.data.map((item: any) => ({
          id: item.jobId._id,
          title: item.jobId.title,
          department: item.jobId.department,
          type: item.jobId.jobType,
          experience: item.jobId.experienceLevel,
          posted: item.jobId.postingStartDate,
          status: item.jobId.status,
        }));

        setJobs(formattedJobs);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-6">
      <JobCreate />
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
      {Array.isArray(jobs) && !loading ? (
        view === "list" ? (
          <JobRowDisplay jobs={jobs} />
        ) : (
          <JobGridDisplay jobs={jobs} />
        )
      ) : (
        <div className="p-4">Loading or no jobs available...</div>
      )}
    </div>
  );
}
