import { useNavigate } from "react-router-dom";
import type { Job } from "../../types/user";
import { useHasPermission } from "../../hooks/hasPermissions";

interface Props {
  jobs: Job[];
  onEditJob: (job: Job) => void;
}
export default function JobGridDisplay({ jobs, onEditJob }: Props) {
  const navigate = useNavigate();
  const canEditJob = useHasPermission("edit-job");

  const formatDate = (value?: string) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleDateString("en-GB");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 flex flex-col"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-500 text-sm">
              Posted : {formatDate(job.postedDate || job.posted)}
            </p>

            <span
              className={`text-sm font-medium ${
                job.status === "Active" ? "text-[#16968F]" : "text-[#535353]"
              }`}
            >
              {job.status === "Inactive" ? "Archived" : job.status}
            </span>
          </div>

          <h3 className="flex gap-4 text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {job.title}
            <img
              src="/icons/edit-icon.svg"
              alt="Edit Icon"
              width={16}
              height={16}
              className={`${
                canEditJob ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => canEditJob && onEditJob(job)}
            />
          </h3>

          <p className="text-blue-700 text-base font-medium mb-4">
            {job.department}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <img
                  src="/icons/timer.svg"
                  alt="Type Icon"
                  width={20}
                  height={20}
                />
                <span>{job.type}</span>
              </div>

              <div className="flex items-center gap-1">
                <img
                  src="/icons/grid-candidate.svg"
                  alt="Position Icon"
                  width={20}
                  height={20}
                />
                <span>{job.positions || "N/A"} Positions</span>
              </div>

              <div className="flex items-center gap-1">
                <img
                  src="/icons/grid-jobs.svg"
                  alt="Arrangement Icon"
                  width={20}
                  height={20}
                />
                <span>{job.workArrangement || "N/A"}</span>
              </div>
            </div>

            <img
              src="/icons/grid-arrow.svg"
              alt="Arrow Icon"
              width={20}
              height={20}
              className="text-gray-500 cursor-pointer"
              onClick={() => navigate(`/jobs/${job.id}`)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
