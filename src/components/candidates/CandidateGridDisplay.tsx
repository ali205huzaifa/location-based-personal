import type { Candidate } from "./CandidateView";
import { motion } from "framer-motion";

interface Props {
  candidates: Candidate[];
  onView: (candidate: Candidate) => void;
}

export default function CandidateGridDisplay({ candidates, onView }: Props) {
  if (candidates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center h-40 text-red-500 text-lg font-bold"
      >
        No candidate found!
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 font-sans"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.12 },
        },
      }}
    >
      {candidates.map((candidate, i) => (
        <motion.div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 flex flex-col border border-gray-200 
                     transition-shadow duration-300"
          onClick={() => onView(candidate)}
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            zIndex: 5,
          }}
          style={{ position: "relative" }}
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

          <div className="flex items-center mt-auto pt-4 border-t border-gray-100 justify-between">
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
            <div>
              <img
                src="/icons/eyeView-icon.svg"
                alt="View Icon"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => onView(candidate)}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
