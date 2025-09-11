import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import { useHasPermission } from "../../hooks/hasPermissions";
import EmailModal from "./JobEmailModal";

const actions = [
  { label: "Reviewed", value: "REVIEWED" },
  { label: "Shortlisted", value: "SHORTLISTED" },
  { label: "Interview Scheduled", value: "INTERVIEW_SCHEDULED" },
  { label: "Selected", value: "SELECTED" },
  { label: "Rejected", value: "REJECTED" },
];

interface Props {
  application: any;
  onStatusChange?: () => void;
}

const JobProfileTab: React.FC<Props> = ({ application, onStatusChange }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const canEditJob = useHasPermission("schedule-interview");
  const canSendEmail = useHasPermission("send-email");
  const candidate = application.candidate;
  const [selected, setSelected] = useState(
    actions.find((a) => a.value === application.status) || null
  );
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localComments, setLocalComments] = useState(
    application.comments || []
  );

  const handleSelect = async (option: any) => {
    if (!option || option.value === selected?.value) return;
    setSelected(option);

    try {
      await JobsAPI.UpdateApplicantStatusById(application._id, {
        status: option.value,
      });

      if (option.value === "INTERVIEW_SCHEDULED") {
        setShowEmailModal(true);
      } else {
        Swal.fire({
          icon: "success",
          text: `Application status has been updated to ${option.label}.`,
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }

      if (onStatusChange) onStatusChange();
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Failed to update status.",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  useEffect(() => {
    setLocalComments(application.comments || []);
  }, [application._id]);

  useEffect(() => {
    setSelected(actions.find((a) => a.value === application.status) || null);
  }, [application]);

  const excludedLabels = ["Current Salary", "Expected Salary", "Notice Period"];

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
          <div className="w-48">
            <Select
              value={selected}
              onChange={handleSelect}
              options={actions}
              isDisabled={!canEditJob}
              isSearchable={false}
              placeholder="Select status"
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: canEditJob ? "#16968F" : "#e5e7eb",
                  borderRadius: "0.5rem",
                  borderColor: state.isFocused ? "#10b981" : "#16968F",
                  boxShadow: "none",
                  cursor: canEditJob ? "pointer" : "not-allowed",
                  minHeight: "38px",
                  outline: "none",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "white",
                  fontWeight: 500,
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                  fontWeight: 500,
                }),
                option: (base, state) => ({
                  ...base,
                  fontSize: "14px",
                  backgroundColor: state.isSelected
                    ? "#16968F"
                    : state.isFocused
                    ? "#e5f4f2"
                    : "white",
                  color: state.isSelected ? "white" : "#374151",
                  cursor: "pointer",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "white",
                  padding: "4px",
                  "&:hover": {
                    color: "white",
                  },
                }),
              }}
            />
          </div>

          {showEmailModal && (
            <EmailModal
              candidateEmail={candidate.email}
              candidateName={candidate.fullName}
              applicationId={application._id}
              jobTitle={application.job.title}
              onClose={() => setShowEmailModal(false)}
            />
          )}
        </div>
      </div>

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
          <span>{candidate.currentLocation}</span>
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

      <div className="border-b border-gray-400"></div>

      <div className="bg-white font-sans text-gray-900 flex">
        <div className="w-full max-w-5xl bg-white p-2 rounded-xl">
          <div className="flex text-lg mb-6">
            <div className="flex items-center gap-4">
              <img src="/icons/cv-icon.svg" alt="CV" width={20} />
              <span>Candidate's CV:</span>
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
            <div className="flex text-lg mt-3">
              <div className="flex items-center gap-4">
                <img src="/icons/link-icon.svg" alt="Portfolio" width={20} />
                <span>Portfolio Link:</span>
              </div>

              <div className="flex items-center flex-grow justify-between border border-gray-300 rounded-md p-2 pl-4 ml-20">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {candidate.portfolio}
                </span>
                <a
                  href={candidate.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white flex items-center justify-center rounded-md w-[85px] py-2 text-xs font-normal"
                >
                  View Link
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-10 text-lg p-2">
        <div className="flex items-center gap-4">
          <img src="/icons/salary-icon.svg" alt="Salary" width={20} />
          <span className="text-gray-600">
            Current Salary:&nbsp;
            <span className="text-black ml-16">
              {candidate.currentSalary} PKR
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            Expected Salary:&nbsp;
            <span className="text-black ml-8">
              {candidate.expectedSalary} PKR
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-lg p-2">
        <img src="/icons/timer-icon.svg" alt="Notice Period" width={20} />
        <span className="text-gray-600">
          Notice Period:&nbsp;
          <span className="text-black ml-16">{candidate.noticePeriod}</span>
        </span>
      </div>

      {application.job?.applicationQuestions?.length > 0 && (
        <div className="space-y-4 mt-3">
          {application.job.applicationQuestions
            .filter((q: any) => !excludedLabels.includes(q.label))
            .map((q: any, index: number) => {
              let answer: string | null = null;

              switch (q.label) {
                case "Current Salary":
                  answer = application.candidate?.currentSalary;
                  break;
                case "Expected Salary":
                  answer = application.candidate?.expectedSalary;
                  break;
                case "Notice Period":
                  answer = application.candidate?.noticePeriod;
                  break;
                case "Reason for switching":
                  answer = application.candidate?.whySwitch;
                  break;
                default:
                  const additional = application.additionalQuestions?.find(
                    (a: any) => a.question === q.label
                  );
                  answer = additional?.answer || null;
                  break;
              }

              return (
                <div key={index} className="flex items-start gap-3">
                  {index === 0 && (
                    <img
                      src="/icons/questions-icon.svg"
                      alt="Application Questions"
                      width={20}
                      height={20}
                      className="mt-1"
                    />
                  )}
                  {index !== 0 && <div className="w-5" />}

                  <div>
                    <p className="text-neutral-500 text-base font-normal leading-snug">
                      {q.label}
                    </p>
                    <p className="text-black text-base font-normal leading-tight">
                      {answer || "—"}
                    </p>
                  </div>
                </div>
              );
            })}
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
            <span className="text-[#000000] text-base font-normal leading-10">
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
                  <div key={comment._id || index} className="px-4 py-2 text-sm">
                    <div className="flex justify-between items-start">
                      <div className="text-black flex-1">{comment.text}</div>

                      <div className="flex flex-col text-xs text-gray-500 pl-4 whitespace-nowrap">
                        <span className="font-medium text-gray-700">
                          {name}
                        </span>
                        <span>
                          {time} {date}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="px-4 py-6 text-sm text-red-500 text-center">
              No comments yet.
            </div>
          )}
        </div>
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-[350px] rounded-xl shadow-lg p-6 pt-4 relative">
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
                width={20}
                height={20}
              />
              <h3 className="text-lg text-black font-bold">Add Your Comment</h3>
            </div>

            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
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
                      text: "Please enter a comment before submitting.",
                      toast: true,
                      position: "top-right",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
                    });
                    return;
                  }

                  try {
                    const payload = { text: newComment };
                    await JobsAPI.AddComment(application._id, payload);

                    Swal.fire({
                      icon: "success",
                      text: "Your comment has been successfully added!",
                      toast: true,
                      position: "top-right",
                      showConfirmButton: false,
                      timer: 3000,
                      timerProgressBar: true,
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
