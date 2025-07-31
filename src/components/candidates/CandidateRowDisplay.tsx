import type { Candidate } from "./CandidateView";

interface Props {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
}

export default function CandidateRowDisplay({ candidates, onView }: Props) {
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
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, i) => (
            <tr key={i} className="border-b border-[#CDCDCD] hover:bg-gray-50">
              <td className="p-4">{candidate.fullName}</td>
              <td className="p-4">{candidate.jobTitle}</td>
              <td className="p-4">{candidate.email}</td>
              <td className="p-4">{candidate.location}</td>
              <td className="p-4">
                {candidate.currentSalary} PKR - {candidate.expectedSalary} PKR
              </td>
              <td className="p-4">{candidate.createdAt}</td>
              <td className="p-4 flex items-center">
                <button
                  className="cursor-pointer"
                  onClick={() => onView(candidate)}
                >
                  <img
                    src="/icons/eyeView-icon.svg"
                    alt="View Icon"
                    width={20}
                    height={20}
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
