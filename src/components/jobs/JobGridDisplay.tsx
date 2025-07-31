import { useNavigate } from "react-router-dom";
import type { Job } from "../../types/user";

interface Props {
  jobs: Job[];
}

export default function JobGridDisplay({ jobs }: Props) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 flex flex-col"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-500 text-sm">
              Posted : {job.postedDate || job.posted}
            </p>
            <span
              className={`text-sm font-medium ${
                job.status === "Active" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {job.status}
            </span>
          </div>

          <h3 className="flex gap-4 text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {job.title}
            <img
              src="/icons/edit-icon.svg"
              alt="Edit Icon"
              width={20}
              height={20}
              className="cursor-pointer"
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
                <span>{job.positions || "N/A"}</span>
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
              width={24}
              height={24}
              className="text-gray-500 cursor-pointer"
              onClick={() => navigate(`/jobs/${job.id}`)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
