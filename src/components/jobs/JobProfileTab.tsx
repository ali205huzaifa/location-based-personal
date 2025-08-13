import React from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import { useHasPermission } from "../../hooks/hasPermissions";
import EmailModal from "./JobEmailModal";

const actions = [
  { label: "Applicants", value: "APPLICANTS" },
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Interview Scheduled", value: "INTERVIEW_SCHEDULED" },
  { label: "Selected", value: "SELECTED" },
  { label: "Rejected", value: "REJECTED" },
];

interface Props {
  application: any;
}

const JobProfileTab: React.FC<Props> = ({ application }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const canEditJob = useHasPermission("schedule-interview");
  const canSendEmail = useHasPermission("send-email");
  const candidate = application.candidate;
  const [selected, setSelected] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState(
    application.comments || []
  );

  const handleSelect = async (value: string) => {
    setSelected(value);
    if (!value) return;

    try {
      await JobsAPI.UpdateApplicantStatusById(application._id, {
        status: value,
      });

      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Application status has been updated to ${value}.`,
        showConfirmButton: true,
      }).then(() => {
        if (value === "INTERVIEW_SCHEDULED") {
          setShowEmailModal(true);
        }
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update application status. Please try again.",
      });
    }
  };

  useEffect(() => {
    setLocalComments(application.comments || []);
  }, [application._id]);

  return (
    <div className="text-sm text-black space-y-4">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl text-[#0E0E2C] mt-2 ">{candidate.fullName}</h2>

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 text-xs rounded-lg bg-[#16968F] text-white 
    ${canSendEmail ? "hover:bg-emerald-700" : "opacity-50 cursor-not-allowed"}`}
            onClick={() => canSendEmail && setShowEmailModal(true)}
            disabled={!canSendEmail}
          >
            <img src="/icons/mail-icon2.svg" alt="Mail" className="w-4 h-4" />
          </button>

          <>
            <select
              className={`bg-[#16968F] text-white px-4 py-2 text-xs rounded-lg 
      ${
        canEditJob
          ? "hover:bg-emerald-700 cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}
              value={selected}
              onChange={(e) => handleSelect(e.target.value)}
              disabled={!canEditJob}
            >
              <option
                value=""
                style={{ backgroundColor: "#ffffff", color: "#000000" }}
              >
                More Actions
              </option>
              {actions.map((action) => (
                <option
                  key={action.value}
                  value={action.value}
                  style={{ backgroundColor: "#ffffff", color: "#000000" }}
                >
                  {action.label}
                </option>
              ))}
            </select>

            {showEmailModal && (
              <EmailModal
                candidateEmail={candidate.email}
                candidateName={candidate.fullName}
                onClose={() => setShowEmailModal(false)}
              />
            )}
          </>
        </div>
      </div>

      <div className="flex gap-20">
        <div className="flex items-center gap-2">
          <img
            src="/icons/location-icon.svg"
            alt="Location"
            width={14}
            height={14}
          />
          <span>{candidate.currentLocation}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/icons/mail-icon.svg" alt="Email" width={14} height={14} />
          <span>{candidate.email}</span>
        </div>
      </div>

      <div className="flex gap-14">
        <div className="flex items-center gap-2">
          <img src="/icons/phone-icon.svg" alt="Phone" width={14} height={14} />
          <span>{candidate.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-2">
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/icons/cv-icon.svg" alt="CV" width={16} height={16} />
          <span className="text-gray-600">
            Candidate's CV:&nbsp;
            <span className="text-black">
              {candidate.cvUrl?.split("/").pop()}
            </span>
          </span>
        </div>
        <a
          href={candidate.cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 border rounded-lg bg-black py-2 px-3 text-xs"
        >
          View CV
        </a>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/icons/link-icon.svg"
            alt="Portfolio"
            width={16}
            height={16}
          />
          <span className="text-gray-600">
            Portfolio Link:&nbsp;
            <span className="text-black break-words">
              {candidate.portfolio}
            </span>
          </span>
        </div>
        <a
          href={candidate.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 border rounded-lg bg-black py-2 px-3 text-xs"
        >
          View Link
        </a>
      </div>

      <div className="flex gap-10">
        <div className="flex items-center gap-2">
          <img
            src="/icons/salary-icon.svg"
            alt="Salary"
            width={16}
            height={16}
          />
          <span className="text-gray-600">
            Current Salary:&nbsp;
            <span className="text-black">{candidate.currentSalary} PKR</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            Expected Salary:&nbsp;
            <span className="text-black">{candidate.expectedSalary} PKR</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <img
          src="/icons/timer-icon.svg"
          alt="Notice Period"
          width={16}
          height={16}
        />
        <span className="text-gray-600">
          Notice Period:&nbsp;
          <span className="text-black">{candidate.noticePeriod}</span>
        </span>
      </div>

      {application.job?.applicationQuestions?.length > 0 && (
        <div>
          <div className="flex items-start gap-2">
            <img
              src="/icons/questions-icon.svg"
              alt="Application Questions"
              width={16}
              height={16}
            />
            <span>Application Questions:</span>
          </div>
          <ul className="ml-6 list-disc text-gray-600 space-y-2 mt-2">
            {application.job.applicationQuestions.map(
              (q: any, index: number) => (
                <li key={index}>
                  <span className="font-medium text-black">{q.label}</span>
                  {application.answers?.[index] && (
                    <div className="ml-4 mt-1 text-gray-700">
                      Answer: {application.answers[index]}
                    </div>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      <div className="mt-6 rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <img
              src="/icons/note-icon.svg"
              alt="Comment Icon"
              width={16}
              height={16}
            />
            <span className="font-semibold text-black text-sm">
              Recruiter Comments
            </span>
          </div>
          <button
            className="w-20 h-8 flex items-center justify-center rounded-md bg-[#D9D9D9] cursor-pointer"
            onClick={() => setShowCommentModal(true)}
          >
            <img
              src="/icons/plus-icon.svg"
              alt="Add Question"
              width={15}
              height={15}
            />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto divide-y">
          {localComments &&
          localComments.filter((c: any) => !c.isDeleted).length > 0 ? (
            localComments
              .filter((c: any) => !c.isDeleted)
              .map((comment: any, index: number) => {
                const name = comment.commentedBy?.name || "Anonymous";
                const createdAt = new Date(comment.createdAt);
                const time = createdAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const date = createdAt.toLocaleDateString("en-GB");

                return (
                  <div key={comment._id || index} className="px-4 py-3 text-sm">
                    <div className="text-black mb-1">{comment.text}</div>
                    <div className="flex justify-end flex-col items-end text-xs text-gray-500">
                      <div>{name}</div>
                      <div className="text-[11px]">
                        {time} {date}
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              No comments yet.
            </div>
          )}
        </div>
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-xl shadow-lg p-6 pt-4 relative">
            <button
              onClick={() => setShowCommentModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Close"
                width={16}
                height={16}
              />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <img
                src="/icons/note-icon.svg"
                alt="Comment Icon"
                width={16}
                height={16}
              />
              <h3 className="text-lg text-black">Add Your Comment</h3>
            </div>

            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Type your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={async () => {
                  if (!newComment.trim()) {
                    Swal.fire({
                      icon: "warning",
                      title: "Empty Comment",
                      text: "Please enter a comment before submitting.",
                    });
                    return;
                  }

                  try {
                    const payload = { text: newComment };
                    await JobsAPI.AddComment(application._id, payload);

                    Swal.fire({
                      icon: "success",
                      title: "Comment Added",
                      text: "Your comment has been successfully added!",
                      showConfirmButton: true,
                    });

                    const response = await JobsAPI.getApplicationById(
                      application._id
                    );
                    setLocalComments(response.data.comments);

                    setNewComment("");
                    setShowCommentModal(false);
                  } catch (error) {
                    console.error("Error posting comment:", error);
                    Swal.fire({
                      icon: "error",
                      title: "Error",
                      text: "Failed to add comment. Please try again.",
                    });
                  }
                }}
                className="text-white px-4 py-2 rounded-md text-sm bg-[#16968F] hover:bg-emerald-700"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobProfileTab;
