import { useNavigate } from "react-router-dom";
import type { Job } from "../../types/user";
import { useHasPermission } from "../../hooks/hasPermissions";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center h-40 text-red-500 text-lg font-bold"
      >
        No jobs found!
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-b-lg shadow overflow-auto p-4">
      <table className="font-Regular w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-400">
          <tr>
            <th className="p-4">Job</th>
            <th className="p-4">Department</th>
            <th className="p-4">Type</th>
            <th className="p-4">Experience</th>
            <th className="p-4">Location</th>
            <th className="p-4">Posted</th>
            <th className="p-4">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <motion.tbody
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {jobs.map((job, i) => {
            const postedDate = job.posted || job.postedDate;

            return (
              <motion.tr
                key={i}
                className="border-b border-[#CDCDCD] hover:bg-gray-50 cursor-pointer"
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.01, backgroundColor: "#f9fafb" }}
              >
                <td className="p-4">{job.title}</td>
                <td className="p-4">{toTitleCase(job.department)}</td>
                <td className="p-4">{toTitleCase(job.type)}</td>
                <td className="p-4">{job.experience || "N/A"} Years</td>
                <td className="p-4">{job.location}</td>
                <td className="p-4">
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
                      width={16}
                      height={16}
                      className={`${
                        canEditJob
                          ? "cursor-pointer"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => canEditJob && onEditJob(job)}
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
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}
