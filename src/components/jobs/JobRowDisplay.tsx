import { useNavigate } from "react-router-dom";
import type { Job } from "../../types/user";

interface Props {
  jobs: Job[];
}

export default function JobRowDisplay({ jobs }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-b-lg shadow overflow-auto">
      <table className="font-Regular w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-400">
          <tr>
            <th className="p-4">Job</th>
            <th className="p-4">Department</th>
            <th className="p-4">Type</th>
            <th className="p-4">Experience</th>
            <th className="p-4">Posted</th>
            <th className="p-4">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr key={i} className="border-b border-[#CDCDCD] hover:bg-gray-50">
              <td className="p-4">{job.title}</td>
              <td className="p-4">{job.department}</td>
              <td className="p-4">{job.type}</td>
              <td className="p-4">{job.experience || "N/A"}</td>
              <td className="p-4">{job.posted || job.postedDate}</td>
              <td className="p-4">
                <span
                  className={`font-medium ${
                    job.status === "Active"
                      ? "text-emerald-600"
                      : "text-gray-400"
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="p-4 text-left">
                <div className="flex items-center gap-8">
                  <img
                    src="/icons/edit-icon.svg"
                    alt="Edit Icon"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
                  <img
                    src="/icons/grid-arrow.svg"
                    alt="Arrow Icon"
                    width={20}
                    height={20}
                    className="cursor-pointer"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
