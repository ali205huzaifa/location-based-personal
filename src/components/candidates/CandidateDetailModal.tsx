import type { Candidate } from "./CandidateView";

interface Props {
  candidate: Candidate | null;
  onClose: () => void;
  isOpen: boolean;
}

const truncateWithEllipsis = (
  str: string | undefined | null,
  maxLength: number
) => {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength - 3) + "..." : str;
};

export default function CandidateDetailModal({
  candidate,
  onClose,
  isOpen,
}: Props) {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white w-[800px] max-w-2xl rounded-lg p-6 relative shadow-lg overflow-y-auto h-[500px]">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          {" "}
          <img src="/icons/cross-icon.svg" alt="Close" width={15} height={15} />
        </button>

        <h2 className="text-2xl text-Black mb-2">{candidate.fullName}</h2>

        <div className="flex gap-14 mb-2">
          <div className="flex items-center gap-2 text-sm text-[#0C0C0C] w-[160px]">
            <span className="w-4 flex-shrink-0 flex justify-center">
              <img
                src="/icons/location2-icon.svg"
                alt="Location"
                width={12}
                height={12}
              />
            </span>
            <span>{candidate.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-black w-[350px]">
            <span className="w-4 flex-shrink-0 flex justify-center">
              <img
                src="/icons/mail-icon.svg"
                alt="Email"
                width={14}
                height={14}
                className="max-w-[350px]"
              />
            </span>
            <span className="truncate max-w-[200px]">{candidate.email}</span>
          </div>
        </div>

        <div className="flex gap-14 mb-4">
          <div className="flex items-center gap-2 text-sm text-black w-[160px]">
            <span className="w-4 flex-shrink-0 flex justify-center">
              <img
                src="/icons/phone-icon.svg"
                alt="Phone"
                width={14}
                height={14}
              />
            </span>
            <span>+{candidate.phoneNumber}</span>
          </div>

          {candidate.linkedinProfile && (
            <div className="flex items-center gap-2 text-sm text-black w-[350px]">
              <span className="w-4 flex-shrink-0 flex justify-center">
                <img
                  src="/icons/linkedin-icon.svg"
                  alt="LinkedIn"
                  width={16}
                  height={16}
                />
              </span>
              <a
                href={candidate.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate max-w-[350px]"
              >
                {candidate.linkedinProfile}
              </a>
            </div>
          )}
        </div>

        <div className="bg-white font-sans text-gray-900 flex">
          <div className="w-full max-w-5xl bg-white p-2 rounded-xl">
            <div className="flex text-lg mb-4">
              <div className="flex items-center gap-4">
                <img src="/icons/cv-icon.svg" alt="CV" width={20} />
                <span className="text-neutral-500 text-base font-normal leading-snug">
                  Candidate's CV:
                </span>
              </div>
              <div className="flex items-center flex-grow justify-between border border-gray-300 rounded-md p-2 pl-4 ml-16">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {candidate.cvUrl?.split("/").pop()}
                </span>
                <a
                  href={candidate.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white flex items-center justify-center rounded-md w-[85px] py-2 text-xs font-normal"
                >
                  View CV
                </a>
              </div>
            </div>

            {candidate.portfolio && (
              <div className="flex text-lg">
                <div className="flex items-center gap-4">
                  <img
                    src="/icons/link-icon.svg"
                    alt="Portfolio"
                    width={20}
                    height={20}
                  />
                  <span className="text-neutral-500 text-base font-normal leading-snug">
                    Portfolio Link:
                  </span>
                </div>

                <div className="flex items-center flex-grow justify-between border border-gray-300 rounded-md p-2 pl-4 ml-20">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {truncateWithEllipsis(candidate.portfolio, 40)}
                  </span>
                  <a
                    href={candidate.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black flex items-center justify-center text-white rounded-md w-[85px] py-2 text-xs font-normal"
                  >
                    View Link
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-10 text-sm text-black mb-2 mt-4 p-2">
          <div className="flex items-center gap-2">
            <img
              src="/icons/salary-icon.svg"
              alt="Salary"
              width={16}
              height={16}
            />
            <span className="text-neutral-500 text-base font-normal leading-snug pl-4">
              Current Salary:&nbsp;&nbsp;&nbsp;
              <span className="text-black ml-2">
                {candidate.currentSalary} PKR{" "}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 text-base font-normal leading-snug">
              Expected Salary:&nbsp;&nbsp;&nbsp;{" "}
              <span className="text-black">
                {candidate.expectedSalary} PKR{" "}
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-black mb-2 p-2">
          <img
            src="/icons/timer-icon.svg"
            alt="Notice Period"
            width={16}
            height={16}
          />
          <span className="flex items-center text-neutral-500 text-base font-normal font-['Product_Sans'] leading-snug pl-4">
            Notice Period:
            <span className="text-[#000000] ml-6">
              {candidate.noticePeriod}
            </span>
          </span>
        </div>

        <div className="space-y-4">
          {candidate.applicationQuestions.map((q, i) => (
            <div key={i} className="flex items-start gap-3">
              {i === 0 ? (
                <div className="flex-shrink-0 text-blue-500 mt-1">
                  <img
                    src="/icons/questions-icon.svg"
                    alt="Application Questions"
                    width={16}
                    height={16}
                  />
                </div>
              ) : (
                <div className="w-4" />
              )}

              <div>
                <p className="text-neutral-500 text-base font-normal leading-snug">
                  {q.label}
                </p>
                <p className="text-black text-base font-normal leading-tight">
                  {q.answer || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
