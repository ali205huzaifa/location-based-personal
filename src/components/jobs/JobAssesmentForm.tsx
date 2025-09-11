import React, { useState } from "react";
import Swal from "sweetalert2";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import jsPDF from "jspdf";

interface CandidateDetails {
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  location?: string;
  positionApplied?: string;
}

interface JobAssessmentFormProps {
  applicationId: string;
  AssessmentDate?: string | null;
  assessmentData: {
    question: string;
    answer: string;
    _id: string;
  }[];
  candidateDetails?: CandidateDetails;
}

const JobAssesmentForm: React.FC<JobAssessmentFormProps> = ({
  applicationId,
  candidateDetails,
  AssessmentDate,
  assessmentData,
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleSendForm = async () => {
    try {
      setIsSending(true);

      await JobsAPI.SendAssessmentForm(applicationId, {});

      const payload = {
        applicationAssessmentDate: new Date().toISOString(),
      };
      await JobsAPI.SendAssessmentFormDate(applicationId, payload);

      Swal.fire({
        icon: "success",
        text: "The assessment form has been sent to the candidate successfully!",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        text: err?.response?.data?.message || "Failed to send form.",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    if (candidateDetails) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Candidate Name: ${candidateDetails.name}`, 14, y);
      y += 7;
      doc.text(`Email: ${candidateDetails.email}`, 14, y);
      y += 7;
      doc.text(`Phone: ${candidateDetails.phone || "—"}`, 14, y);
      y += 7;
      doc.text(`Gender: ${candidateDetails.gender || "—"}`, 14, y);
      y += 7;
      doc.text(`Location: ${candidateDetails.location || "—"}`, 14, y);
      y += 7;
      doc.text(
        `Position Applied: ${candidateDetails.positionApplied || "—"}`,
        14,
        y
      );
      y += 10;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Applicant Assessment Form", 14, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Application ID: ${applicationId}`, 14, y);
    y += 8;

    doc.text(
      `Form Send Date: ${
        AssessmentDate ? new Date(AssessmentDate).toLocaleString() : "—"
      }`,
      14,
      y
    );
    y += 15;

    if (assessmentData && assessmentData.length > 0) {
      assessmentData.forEach((item, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${item.question}`, 14, y);
        y += 7;

        doc.setFont("helvetica", "normal");
        const answer =
          item.answer && item.answer.trim() !== ""
            ? item.answer
            : "No answer provided";

        const splitAnswer = doc.splitTextToSize(answer, 180);
        const lineHeight = 6;
        doc.text(splitAnswer, 20, y);
        y += splitAnswer.length * lineHeight + 5;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      doc.text("No assessment data available.", 14, y);
    }

    doc.save("Assessment_Form.pdf");
  };

  const isFilled =
    assessmentData &&
    assessmentData.length > 0 &&
    assessmentData.some((d) => d.answer && d.answer.trim() !== "");

  return (
    <div className="p-4 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Applicant Assessment Form</h2>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded text-sm transition
    ${
      isSending || isFilled
        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
        : "bg-[#16968F] text-white hover:bg-teal-700"
    }`}
            onClick={handleSendForm}
            disabled={isSending || isFilled}
            title={isFilled ? "Form already filled" : ""}
          >
            <img
              src="/icons/mail-icon2.svg"
              alt="Send"
              width={15}
              height={15}
            />
            <span>{isSending ? "Sending..." : "Send Form"}</span>
          </button>
          <button
            className="flex items-center gap-2 py-2 px-4 bg-[#16968F] text-white text-sm rounded hover:bg-teal-700 transition"
            onClick={handleExportPDF}
          >
            <img
              src="/icons/export-icon.svg"
              alt="Export"
              width={20}
              height={20}
            />
            Export PDF
          </button>
        </div>
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
