import type { Candidate } from "./CandidateView";
import { motion } from "framer-motion";

interface Props {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
}

export default function CandidateRowDisplay({ candidates, onView }: Props) {
  return (
    <div className="bg-white rounded-b-lg shadow overflow-auto p-4">
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

        {candidates.length === 0 ? (
          <tbody>
            <tr>
              <td
                colSpan={7}
                className="text-lg font-bold text-center text-red-500 p-6"
              >
                No candidate found!
              </td>
            </tr>
          </tbody>
        ) : (
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {candidates.map((candidate, i) => (
              <motion.tr
                key={i}
                className="border-b border-[#CDCDCD] bg-white"
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  zIndex: 5,
                }}
                style={{ position: "relative" }}
              >
                <td className="p-4">{candidate.fullName}</td>
                <td className="p-4">{candidate.jobTitle}</td>
                <td className="p-4">{candidate.email}</td>
                <td className="p-4">{candidate.location}</td>
                <td className="p-4">
                  {candidate.currentSalary} PKR - {candidate.expectedSalary} PKR
                </td>
                <td className="p-4">{candidate.createdAt}</td>
                <td className="p-4 flex items-center justify-center">
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
              </motion.tr>
            ))}
          </motion.tbody>
        )}
      </table>
    </div>
  );
}
