import { useNavigate } from "react-router-dom";

const jobs = [
  {
    id: "1",
    title: "Flutter Developer",
    department: "App Development",
    type: "Part Time",
    experience: "1-3 Years",
    posted: "12/10/2025",
    status: "Active",
  },
  {
    id: "2",
    title: "React js Developer",
    department: "Backend Development",
    type: "Full time",
    experience: "2-4 Years",
    posted: "23/05/2025",
    status: "Archived",
  },
  {
    id: "3",
    title: "UI UX Designer",
    department: "Designing",
    type: "Full time",
    experience: "0-1 Years",
    posted: "18/06/2025",
    status: "Active",
  },
];

export default function JobRowDisplay() {
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
              <td className="p-4">{job.experience}</td>
              <td className="p-4">{job.posted}</td>
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
                <img
                  src="/icons/grid-arrow.svg"
                  alt="Arrow Icon"
                  width={24}
                  height={24}
                  className="inline-block cursor-pointer"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
