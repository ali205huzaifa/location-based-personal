import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import InterviewersModal from "./InterviewersModal";
import JobsAPI from "../../api/jobsApi/JobsAPI";

interface EmailModalProps {
  candidateEmail?: string;
  applicationId?: string;
  candidateName?: string;
  jobTitle?: string;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({
  candidateEmail,
  applicationId,
  candidateName,
  jobTitle,
  onClose,
}) => {
  const [emailTo, setEmailTo] = useState(candidateEmail || "");
  const [emailType, setEmailType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [body, setBody] = useState(`
    <p>Dear <strong>${candidateName || "[Candidate Name]"}</strong>,</p>
    <p>We are pleased to invite you for an interview for the <strong>${
      jobTitle || ["Job Title"]
    }</strong> position at IR Solutions.</p> <br>
    <p>📅 Date: [${date || "Select Date"}]</p>
    <p>🕒 Time: [${time || "Select Time"}]</p>
    <p>📍 Mode: [Select Interview Mode]</p> <br>
    <p>Please confirm your availability by replying to this email.</p> <br>
    <p>Best regards,<br />IR Solutions HR Team.</p>
`);

  const [loading, setLoading] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [selectedInterviewers, setSelectedInterviewers] = useState<any[]>([]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hourStr, minute] = timeString.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  const updateBodyWithDateTime = (newDate: string, newTime: string) => {
    const formattedDate = formatDate(newDate);
    const formattedTime = formatTime(newTime);

    setBody((prev) =>
      prev
        .replace(
          /📅 Date:[^<]*/i,
          `📅 Date: ${formattedDate || "[Select Date]"}`
        )
        .replace(
          /🕒 Time:[^<]*/i,
          `🕒 Time: ${formattedTime || "[Select Time]"}`
        )
    );
  };

  const updateBodyWithMode = (newMode: string) => {
    let newModeContent;
    let newCoordinatesContent = "";

    if (newMode === "ON_SITE") {
      newModeContent = `📍 Mode: Onsite, IR Solutions, Al-Rehman Plaza, 3rd floor, G-11 Markaz, Islamabad.`;
      newCoordinatesContent = `<p>Location: <a href="https://www.google.com/maps?q=33.669322,72.999939" target="_blank">View on Google Maps</a></p>`;
    } else if (newMode === "ONLINE") {
      newModeContent = `📍 Mode: Online via Zoom (Paste Meeting Link here).`;
    } else {
      newModeContent = `📍 Mode: [Onsite, IR Solutions, Al-Rehman Plaza, 3rd floor, G-11 Markaz, Islamabad.]`;
    }

    setBody((prev) =>
      prev.replace(
        /<p>📍 Mode:.*?<\/p>(?:<p>Location:.*?<\/p>)?/is,
        `<p>${newModeContent}</p>${newCoordinatesContent}`
      )
    );
  };

  const handleSendEmail = async () => {
    if (!emailTo || selectedInterviewers.length === 0) {
      Swal.fire(
        "Missing Fields",
        "Please enter candidate email & select interviewers!",
        "warning"
      );
      return;
    }

    if (!applicationId) {
      Swal.fire("Error", "Missing application ID!", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: emailTo,
        emailType: "INTERVIEW_SCHEDULED",
        interviewerIds: selectedInterviewers.map((i) => i.id),
        interviewDate: date,
        interviewTime: time,
        body,
      };

      await JobsAPI.SendCandidateEmail(applicationId, payload);

      Swal.fire("Success", "Email sent successfully!", "success");
      onClose();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Failed to send email.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white w-[900px] rounded-lg p-6 relative">
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
          <label className="w-28 font-medium ">Interview Mode:</label>
          <select
            value={emailType}
            onChange={(e) => {
              const newType = e.target.value;
              setEmailType(newType);
              updateBodyWithMode(newType);
            }}
            className="border border-gray-300 rounded px-8 py-2"
          >
            <option value="">Select Mode</option>
            <option value="ON_SITE">On-Site</option>
            <option value="ONLINE">Online</option>
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

          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                updateBodyWithDateTime(e.target.value, time);
              }}
              className="border border-gray-300 rounded px-6 py-2 pr-10 p-1"
            />
            <img
              src="/icons/calender-icon.svg"
              alt="Calendar"
              width={18}
              height={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>('input[type="date"]')
                  ?.showPicker?.()
              }
            />
          </div>

          <div className="relative">
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                updateBodyWithDateTime(date, e.target.value);
              }}
              className="border border-gray-300 rounded px-12 py-2 pr-10 p-1"
            />
            <img
              src="/icons/timer-icon.svg"
              alt="Time"
              width={18}
              height={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>('input[type="time"]')
                  ?.showPicker?.()
              }
            />
          </div>
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
          <div className="mb-4 text-black text-sm font-normal">
            <strong>Selected Interviewers:</strong>{" "}
            {selectedInterviewers.map((i) => i.name).join(", ")}
          </div>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            disabled={loading}
            onClick={handleSendEmail}
            className="px-4 py-2 rounded bg-[#16968F] text-white flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Email"}
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
          preselected={selectedInterviewers.map((i) => i.id)}
        />
      )}
    </div>
  );
};

export default EmailModal;
