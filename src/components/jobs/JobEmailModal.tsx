import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InterviewersModal from "./InterviewersModal";

interface EmailModalProps {
  candidateEmail?: string;
  candidateName?: string;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({
  candidateEmail,
  candidateName,
  onClose,
}) => {
  const [emailTo, setEmailTo] = useState(candidateEmail || "");
  const [emailType, setEmailType] = useState("Interview Scheduled");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedInterviewers, setSelectedInterviewers] = useState<any[]>([]);
  const initialEmailBody = `Dear <strong>${
    candidateName || "[ Selected Candidate Name ]"
  }</strong>,<br><br>

We are pleased to invite you for an interview for the [Job Title] position at IR Solutions.<br><br>

📅 Date: [07 July, 2025]<br>
🕒 Time: [ 02:35 PM ]<br>
📍 Mode: [onsite , IR Solutions , Al-Rehman plaza , 3rd floor , G-11 Markaz , Islamabad. ]<br><br>

Please confirm your availability by replying to this email.<br><br>

Best regards,<br>
IR Solutions HR Team.`;

  const [body, setBody] = useState(initialEmailBody);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white w-[850px] rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <img src="/icons/cross-icon.svg" alt="Close" width={16} height={16} />
        </button>

        <h2 className="text-lg font-semibold mb-6 border-b border-gray-400">
          Send Email
        </h2>

        <div className="mb-4 flex items-center gap-4">
          <label className="w-28 font-medium">Email To:</label>
          <input
            type="email"
            value={emailTo}
            onChange={(e) => setEmailTo(e.target.value)}
            className="border border-gray-300 rounded w-full px-3 py-2"
            placeholder="Enter recipient email"
          />
        </div>

        <div className="mb-4 flex items-center gap-4">
          <label className="w-28 font-medium">Email Type:</label>
          <select
            value={emailType}
            onChange={(e) => setEmailType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="APPLICANTS">Applicants</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button
            className="bg-gray-200 hover:bg-gray-300 rounded px-3 py-2 text-sm flex items-center gap-2"
            onClick={() => setShowSelectModal(true)}
          >
            <img
              src="/icons/mail-interviewer-icon.svg"
              alt="Mail Icon"
              width={16}
              height={16}
            />
            <span>Select Interviewers</span>
          </button>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
            placeholder="Write your email here..."
            className="h-62 mb-4"
          />
        </div>

        {selectedInterviewers.length > 0 && (
          <div className="mb-4">
            <strong>Selected Interviewers:</strong>{" "}
            {selectedInterviewers.map((i) => i.name).join(", ")}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={() => {
              console.log({ emailTo, emailType, date, time, body });
              onClose();
            }}
            className="px-4 py-2 rounded bg-[#16968F] text-white flex items-center gap-2"
          >
            Send Email
            <img
              src="/icons/mail-arrow.svg"
              alt="Mail Icon"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>

      {showSelectModal && (
        <InterviewersModal
          onClose={() => setShowSelectModal(false)}
          onSelect={(interviewers) => setSelectedInterviewers(interviewers)}
        />
      )}
    </div>
  );
};

export default EmailModal;
