import { useNavigate } from "react-router-dom";
import type { Job } from "../../types/user";
import { useHasPermission } from "../../hooks/hasPermissions";

interface Props {
  jobs: Job[];
  onEditJob: (job: Job) => void;
}

function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function JobRowDisplay({ jobs, onEditJob }: Props) {
  const navigate = useNavigate();
  const canEditJob = useHasPermission("edit-job");

  if (jobs.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-red-500 text-lg font-bold">
        No jobs found!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-lg shadow overflow-auto">
      <table className="font-normal w-full text-left border-collapse">
        <thead className="bg-gray-100 text-[#8B8B8B] text-zinc-500 text-base leading-relaxed border-b border-[#D0D0D0]">
          <tr>
            <th className="p-4 font-normal">Job</th>
            <th className="p-4 font-normal">Department</th>
            <th className="p-4 font-normal">Type</th>
            <th className="p-4 font-normal">Location</th>
            <th className="p-4 font-normal">Experience</th>
            <th className="p-4 font-normal">Posted</th>
            <th className="p-4 font-normal">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => {
            const postedDate = job.posted || job.postedDate;

            return (
              <tr
                key={i}
                className="border-b border-[#CDCDCD] hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <td className="p-4 text-[#000000]">{job.title}</td>
                <td className="p-4 text-[#000000]">
                  {toTitleCase(job.department)}
                </td>
                <td className="p-4 text-[#000000]">{toTitleCase(job.type)}</td>
                <td className="p-4 text-[#000000]">{job.location}</td>
                <td className="p-4 text-[#000000]">
                  {job.experience || "N/A"} Years
                </td>
                <td className="p-4 text-[#000000]">
                  {postedDate
                    ? new Date(postedDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="p-4">
                  <span
                    className={`font-medium ${
                      job.status === "Active"
                        ? "text-[#16968F]"
                        : "text-[#535353]"
                    }`}
                  >
                    {job.status === "Inactive" ? "Archived" : job.status}
                  </span>
                </td>
                <td className="p-4 text-left">
                  <div className="flex items-center gap-4">
                    <img
                      src="/icons/edit-icon.svg"
                      alt="Edit Icon"
                      width={18}
                      height={18}
                      className={`${
                        canEditJob
                          ? "cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        canEditJob && onEditJob(job);
                      }}
                    />

                    <img
                      src="/icons/grid-arrow.svg"
                      alt="Arrow Icon"
                      width={16}
                      height={16}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/jobs/${job.id}`);
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
