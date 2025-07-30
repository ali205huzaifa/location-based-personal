import type { Candidate } from "./CandidateView";

interface Props {
  candidates: Candidate[];
}

export default function CandidateRowDisplay({ candidates }: Props) {
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
          {candidates.map((c, i) => (
            <tr key={i} className="border-b border-[#CDCDCD] hover:bg-gray-50">
              <td className="p-4">{c.fullName}</td>
              <td className="p-4">{c.jobTitle}</td>
              <td className="p-4">{c.email}</td>
              <td className="p-4">{c.location}</td>
              <td className="p-4">
                {c.currentSalary} PKR - {c.expectedSalary} PKR
              </td>
              <td className="p-4">{c.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
