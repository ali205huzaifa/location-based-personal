const jobs = [
  {
    postedDate: "10/02/2025",
    title: "Unity 3d Developer",
    department: "Game development",
    type: "Full Time",
    positions: "02 Positions",
    workArrangement: "Hybrid",
    status: "Active",
  },
  {
    postedDate: "09/15/2024",
    title: "React JS Developer",
    department: "Web development",
    type: "Part Time",
    positions: "01 Position",
    workArrangement: "Remote",
    status: "Archived",
  },
  {
    postedDate: "08/01/2025",
    title: "Mobile App Developer",
    department: "Mobile development",
    type: "Full Time",
    positions: "03 Positions",
    workArrangement: "On-site",
    status: "Active",
  },
  {
    postedDate: "07/20/2025",
    title: "DevOps Engineer",
    department: "Cloud infrastructure",
    type: "Full Time",
    positions: "01 Position",
    workArrangement: "Hybrid",
    status: "Active",
  },
  {
    postedDate: "06/05/2024",
    title: "Data Scientist",
    department: "Data analytics",
    type: "Full Time",
    positions: "02 Positions",
    workArrangement: "Remote",
    status: "Archived",
  },
];

export default function CandidateGridDisplay() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 font-sans">
      {jobs.map((job, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 flex flex-col border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-500 text-sm">Applied : {job.postedDate}</p>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <img
                src="/icons/location-icon.svg"
                alt="Location Icon"
                width={10}
                height={10}
              />
              <span>Rawalpindi</span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {job.title
              .replace("Developer", "")
              .replace("Engineer", "")
              .replace("Scientist", "")
              .trim()}
          </h3>
          <p className="text-blue-700 text-base font-medium mb-4">
            {job.department
              .replace("development", "Designer")
              .replace("infrastructure", "Specialist")
              .replace("analytics", "Analyst")}
          </p>

          <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold">
              <img
                src="/icons/salary-icon.svg"
                alt="Salary Icon"
                width={20}
                height={20}
              />
              <span>15,000 PKR - 30,000 PKR</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
