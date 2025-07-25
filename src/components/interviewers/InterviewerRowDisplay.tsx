const interviewer = [
  {
    name: "Arslan Rehman",
    email: "ArslanRehman123@gmail.com",
    dept: "Dev Ops",
    lastUpdated: "12/02/2025",
  },
  {
    name: "Saba Rauf",
    email: "Saba0215@gmail.com",
    dept: "SQA Engineer",
    lastUpdated: "12/02/2025",
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    dept: "web Development",
    lastUpdated: "10/01/2025",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    dept: "Mobile Development",
    lastUpdated: "05/15/2025",
  },
];

export default function InterviewerRowDisplay() {
  return (
    <div className="bg-white rounded-b-lg shadow-lg overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-[#8B8B8B] uppercase text-sm">
          <tr>
            <th className="p-4 font-medium">Name</th>
            <th className="p-4 font-medium">Email</th>
            <th className="p-4 font-medium">Department</th>
            <th className="p-4 font-medium">Last Updated</th>
            <th className="p-4 font-medium text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {interviewer.map((interviewer, i) => (
            <tr key={i} className="border-b border-[#CDCDCD] hover:bg-gray-50">
              <td className="p-4">{interviewer.name}</td>
              <td className="p-4">{interviewer.email}</td>
              <td className="p-4">{interviewer.dept}</td>
              <td className="p-4">{interviewer.lastUpdated}</td>
              <td className="p-4 text-center flex items-center justify-center space-x-3">
                <button className="cursor-pointer">
                  <img
                    src="/icons/edit-icon.svg"
                    alt="Edit"
                    width={18}
                    height={18}
                  />
                </button>

                <button className="cursor-pointer">
                  <img
                    src="/icons/delete-icon.svg"
                    alt="Delete"
                    width={15}
                    height={15}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
