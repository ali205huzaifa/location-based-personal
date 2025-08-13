import React from "react";
import Swal from "sweetalert2";
import JobsAPI from "../../api/jobsApi/JobsAPI";

interface JobAssessmentFormProps {
  applicationId: string;
}

const JobAssesmentForm: React.FC<JobAssessmentFormProps> = ({
  applicationId,
}) => {
  const handleSendForm = async () => {
    try {
      const payload = {};
      await JobsAPI.SendAssessmentForm(applicationId, payload);

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

  return (
    <div className="p-4 bg-white shadow rounded-md">
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
          <span className="font-medium">Status:</span>{" "}
          <span className="text-gray-700">--</span>
        </div>
        <div>
          <span className="font-medium">Form Send Date:</span>{" "}
          <span className="text-gray-700">—</span>
        </div>
      </div>
    </div>
  );
};

export default JobAssesmentForm;
