import type { Candidate } from "./CandidateView";

interface Props {
  candidates: Candidate[];
}

export default function CandidateGridDisplay({ candidates }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 font-sans">
      {candidates.map((candidate, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 flex flex-col border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-500 text-sm">
              Applied: {candidate.createdAt}
            </p>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
              <img
                src="/icons/location-icon.svg"
                alt="Location Icon"
                width={10}
                height={10}
              />
              <span>{candidate.location}</span>
            </div>
          </div>

          <h3 className="text-xl md:text-2xl text-gray-800 mb-1">
            {candidate.fullName}
          </h3>
          <p className="text-blue-700 text-base mb-4">{candidate.jobTitle}</p>

          <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold">
              <img
                src="/icons/salary-icon.svg"
                alt="Salary Icon"
                width={20}
                height={20}
              />
              <span>
                {candidate.currentSalary} PKR - {candidate.expectedSalary} PKR
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
