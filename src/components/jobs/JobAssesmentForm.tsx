import React from "react";
import Swal from "sweetalert2";
import JobsAPI from "../../api/jobsApi/JobsAPI";

interface JobAssessmentFormProps {
  applicationId: string;
  AssessmentDate?: string | null;
  assessmentData: {
    question: string;
    answer: string;
    _id: string;
  }[];
}

const JobAssesmentForm: React.FC<JobAssessmentFormProps> = ({
  applicationId,
  AssessmentDate,
  assessmentData,
}) => {
  const handleSendForm = async () => {
    try {
      await JobsAPI.SendAssessmentForm(applicationId, {});

      const payload = {
        applicationAssessmentDate: new Date().toISOString(),
      };
      await JobsAPI.SendAssessmentFormDate(applicationId, payload);

      Swal.fire({
        icon: "success",
        title: "Form Sent",
        text: "The assessment form has been sent to the candidate successfully!",
        showConfirmButton: true,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message || "Failed to send form.",
      });
    }
  };

  const isFilled =
    assessmentData &&
    assessmentData.length > 0 &&
    assessmentData.some((d) => d.answer && d.answer.trim() !== "");

  return (
    <div className="p-4 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Applicant Assessment Form</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          onClick={handleSendForm}
        >
          <img src="/icons/mail-icon2.svg" alt="Send" width={15} height={15} />
          <span>Send Form</span>
        </button>
      </div>

      <div className="flex justify-between items-center border-b border-gray-400 pb-2 mb-4">
        <div>
          <span className="font-normal text-zinc-500">Status:</span>{" "}
          <span className={isFilled ? "text-[#000000]" : "text-[#000000]"}>
            {isFilled ? "Filled" : "Not Filled"}
          </span>
        </div>
        <div>
          <span className="text-neutral-500 text-xs font-normal">
            Form Send Date:
          </span>{" "}
          <span className="text-black text-xs font-normal">
            {AssessmentDate
              ? `${new Date(AssessmentDate).getDate()} ${new Date(
                  AssessmentDate
                ).toLocaleString("en-GB", { month: "long" })} ${new Date(
                  AssessmentDate
                ).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}`
              : "—"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {assessmentData && assessmentData.length > 0 ? (
          assessmentData.map((item, index) => (
            <div key={item._id} className="pb-1">
              <h3 className="justify-start text-[#1C1C1C] text-base font-normal leading-loose">
                {index + 1}. {item.question}
              </h3>
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {item.answer || "No answer provided"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-red-500 font-normal text-center mt-8">
            No assessment data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobAssesmentForm;
