import React, { useState } from "react";
import Swal from "sweetalert2";
import JobsAPI from "../../api/jobsApi/JobsAPI";

interface JobAssessmentFormProps {
  applicationId: string;
}

const JobEvaluationForm: React.FC<JobAssessmentFormProps> = ({
  applicationId,
}) => {
  const [formSent, setFormSent] = useState(false);

  const handleSendForm = async () => {
    try {
      const payload = {};
      await JobsAPI.SendEvaluationForm(applicationId, payload);

      Swal.fire({
        icon: "success",
        title: "Form Sent",
        text: "The Evaluation Form has been sent to the Interviewer successfully!",
        showConfirmButton: true,
      });

      setFormSent(true);
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
        <h2 className="text-lg font-semibold">Evaluation Form</h2>

        {formSent ? (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 transition"
            onClick={() => {}}
          >
            <img
              src="/icons/export-icon.svg"
              alt="List"
              width={22}
              height={22}
            />
            Export PDF
          </button>
        ) : (
          <button
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
            onClick={handleSendForm}
          >
            <img
              src="/icons/mail-icon2.svg"
              alt="Send"
              width={15}
              height={15}
            />
            <span>Send Form</span>
          </button>
        )}
      </div>

      <div>
        <span className="font-medium">Text</span>
      </div>
      <div className="bg-black h-[40px] mt-4 text-white">
        <h1 className="pt-2 ml-16">Average Rating :</h1>
      </div>
    </div>
  );
};

export default JobEvaluationForm;
