import type { Candidate } from "./CandidateView";

interface Props {
  candidate: Candidate | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function CandidateDetailModal({
  candidate,
  onClose,
  isOpen,
}: Props) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white w-[800px] max-w-2xl rounded-lg p-6 relative shadow-lg overflow-y-auto h-[450px]">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          {" "}
          <img src="/icons/cross-icon.svg" alt="Close" width={15} height={15} />
        </button>

        <h2 className="text-2xl text-[#0E0E2C] mb-2">{candidate.fullName}</h2>

        <div className="flex gap-20 mb-2">
          <div className="flex items-center gap-2 text-sm text-black">
            <img
              src="/icons/location-icon.svg"
              alt="Location"
              width={14}
              height={14}
            />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-black">
            <img
              src="/icons/mail-icon.svg"
              alt="Email"
              width={14}
              height={14}
            />
            <span>{candidate.email}</span>
          </div>
        </div>

        <div className="flex gap-14 mb-4">
          <div className="flex items-center gap-2 text-sm text-black">
            <img
              src="/icons/phone-icon.svg"
              alt="Phone"
              width={14}
              height={14}
            />
            <span>{candidate.phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-black">
            <img
              src="/icons/linkedin-icon.svg"
              alt="LinkedIn"
              width={14}
              height={14}
            />
            <a
              href={candidate.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {candidate.linkedinProfile}
            </a>
          </div>
        </div>

        <div className="flex items-center text-sm justify-between text-black mb-4">
          <div className="flex items-center gap-2">
            <img src="/icons/cv-icon.svg" alt="CV" width={16} height={16} />
            <span className="text-gray-600">
              Candidate's CV:&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="text-black">
                {candidate.cvUrl.split("/").pop()}
              </span>
            </span>
          </div>
          <a
            href={candidate.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 border rounded-lg bg-black py-2 px-3 text-[11.55px]"
          >
            View CV
          </a>
        </div>

        <div className="flex items-center justify-between text-sm text-black mb-4">
          <div className="flex items-center gap-2">
            <img
              src="/icons/link-icon.svg"
              alt="Portfolio"
              width={16}
              height={16}
            />
            <span className="text-gray-600">
              Portfolio
              Link:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span className="break-words text-black">
                {candidate.portfolio}
              </span>
            </span>
          </div>
          <a
            href={candidate.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 border rounded-lg bg-black py-2 px-3 text-[11px]"
          >
            View Link
          </a>
        </div>

        <div className="flex gap-10 text-sm text-black mb-6">
          <div className="flex items-center gap-2">
            <img
              src="/icons/salary-icon.svg"
              alt="Salary"
              width={16}
              height={16}
            />
            <span className="text-gray-600">
              Current Salary:&nbsp;&nbsp;&nbsp;
              <span className="text-black ml-2">
                {candidate.currentSalary} PKR{" "}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">
              Expected Salary:&nbsp;&nbsp;&nbsp;{" "}
              <span className="text-black">
                {candidate.expectedSalary} PKR{" "}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-black mb-4">
          <img
            src="/icons/timer-icon.svg"
            alt="Notice Period"
            width={16}
            height={16}
          />
          <span className="text-gray-600 flex items-center">
            Notice Period:
            <span className="text-black ml-6">{candidate.noticePeriod}</span>
          </span>
        </div>

        <div className="text-sm text-black mb-2">
          <div className="flex items-start gap-2 mb-1">
            <img
              src="/icons/questions-icon.svg"
              alt="Application Questions"
              width={16}
              height={16}
            />
            Application Questions:
          </div>
          <ul className="ml-6 list-disc text-gray-600">
            {Array.isArray(candidate.applicationQuestions) ? (
              candidate.applicationQuestions.map((q, index) => (
                <li key={index}>{q.label}</li>
              ))
            ) : (
              <li>{candidate.applicationQuestions}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
