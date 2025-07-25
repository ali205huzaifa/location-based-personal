import { useNavigate } from "react-router-dom";

const jobs = [
  {
    id: "1",
    postedDate: "10/02/2025",
    title: "Unity 3d Developer",
    department: "Game development",
    type: "Full Time",
    positions: "02 Positions",
    workArrangement: "Hybrid",
    status: "Active",
  },
  {
    id: "2",
    postedDate: "09/15/2024",
    title: "React JS Developer",
    department: "Web development",
    type: "Part Time",
    positions: "01 Position",
    workArrangement: "Remote",
    status: "Archived",
  },
  {
    id: "3",
    postedDate: "08/01/2025",
    title: "Mobile App Developer",
    department: "Mobile development",
    type: "Full Time",
    positions: "03 Positions",
    workArrangement: "On-site",
    status: "Active",
  },
  {
    id: "4",
    postedDate: "07/20/2025",
    title: "DevOps Engineer",
    department: "Cloud infrastructure",
    type: "Full Time",
    positions: "01 Position",
    workArrangement: "Hybrid",
    status: "Active",
  },
  {
    id: "5",
    postedDate: "06/05/2024",
    title: "Data Scientist",
    department: "Data analytics",
    type: "Full Time",
    positions: "02 Positions",
    workArrangement: "Remote",
    status: "Archived",
  },
];

export default function JobGridDisplay() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 flex flex-col"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-500 text-sm">Posted : {job.postedDate}</p>
            <span
              className={`text-sm font-medium ${
                job.status === "Active" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {job.status}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {job.title}
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
                <span>{job.positions}</span>
              </div>

              <div className="flex items-center gap-1">
                <img
                  src="/icons/grid-jobs.svg"
                  alt="Arrangement Icon"
                  width={20}
                  height={20}
                />
                <span>{job.workArrangement}</span>
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
