import type { Candidate } from "./CandidateView";
import { motion } from "framer-motion";

interface Props {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
}

export default function CandidateRowDisplay({ candidates, onView }: Props) {
  return (
    <div className="bg-white rounded-b-lg shadow overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-[#8B8B8B] text-zinc-500 text-base leading-relaxed border-b border-[#D0D0D0]">
          <tr>
            <th className="p-4 font-normal">Candidate Name</th>
            <th className="p-4 font-normal">Job Applied</th>
            <th className="p-4 font-normal">Email Address</th>
            <th className="p-4 font-normal">Location</th>
            <th className="p-4 font-normal">Current - Expected Salary</th>
            <th className="p-4 font-normal">Applied Date</th>
            <th className="p-4 font-normal">Action</th>
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
                className="border-b border-[#CDCDCD] bg-white cursor-pointer"
                onClick={() => onView(candidate)}
                variants={{
                  hidden: { opacity: 0, x: -40 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{
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
                  {(candidate.currentSalary ?? 0).toLocaleString()} PKR -{" "}
                  {(candidate.expectedSalary ?? 0).toLocaleString()} PKR
                </td>
                <td className="p-4">{candidate.createdAt}</td>
                <td className="px-6">
                  <button
                    className="flex items-center justify-center cursor-pointer"
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
