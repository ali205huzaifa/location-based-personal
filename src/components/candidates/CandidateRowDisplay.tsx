const candidates = [
  {
    candidateName: "Arslan Mehmood",
    jobApplied: "Junior Unity Developer",
    emailAddress: "arslanmehmood@gmail.com",
    location: "Gulberg",
    salary: "15,000 PKR - 30,000 PKR",
    appliedDate: "12/05/2025",
  },
  {
    candidateName: "Kashif Khan",
    jobApplied: "UI/UX Intern",
    emailAddress: "kashifkhan214@gmail.com",
    location: "Taxila",
    salary: "15,000 PKR - 30,000 PKR",
    appliedDate: "12/06/2025",
  },
  {
    candidateName: "Zainab Rehman",
    jobApplied: "Senior Business Analyst",
    emailAddress: "zainabrehman@gmail.com",
    location: "Islamabad",
    salary: "15,000 PKR - 30,000 PKR",
    appliedDate: "12/05/2025",
  },
];

export default function CandidateRowDisplay() {
  return (
    <div className="bg-white rounded-b-lg shadow overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-400">
          <tr>
            <th className="p-4">Candidate Name</th>
            <th className="p-4">Job Applied</th>
            <th className="p-4">Email Address</th>
            <th className="p-4">Location</th>
            <th className="p-4">Current - Expected Salary</th>
            <th className="p-4">Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, i) => (
            <tr key={i} className="border-b border-[#CDCDCD] hover:bg-gray-50">
              <td className="p-4">{candidate.candidateName}</td>
              <td className="p-4">{candidate.jobApplied}</td>
              <td className="p-4">{candidate.emailAddress}</td>
              <td className="p-4">{candidate.location}</td>
              <td className="p-4">{candidate.salary}</td>
              <td className="p-4">{candidate.appliedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
