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
  positionType?: string;
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

  type JobType =
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "INTERNSHIP"
    | undefined;

  const formatJobType = (type: JobType): string => {
    switch (type) {
      case "FULL_TIME":
        return "Full Time";
      case "PART_TIME":
        return "Part Time";
      case "CONTRACT":
        return "Contract";
      case "INTERNSHIP":
        return "Internship";
      default:
        return "—";
    }
  };

  const handleExportPDF = () => {
    const logoUrl = "/images/Solutions.png";
    const img = new Image();
    img.src = logoUrl;

    img.onload = () => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      doc.addImage(img, "PNG", 14, 10, 18, 18);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Applicant Assessment Form", pageWidth / 2, 20, {
        align: "center",
      });

      y = 40;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      const leftX = 14;
      const rightX = 120;

      doc.text(`Name:     ${candidateDetails?.name || "—"}`, leftX, y);
      doc.text(`Phone:   +${candidateDetails?.phone || "—"}`, rightX, y);
      y += 8;

      doc.text(`Address:  ${candidateDetails?.location || "—"}`, leftX, y);
      y += 8;

      doc.text(`Email:     ${candidateDetails?.email || "—"}`, leftX, y);
      y += 8;

      doc.text(
        `Position:  ${candidateDetails?.positionApplied || "—"}`,
        leftX,
        y
      );
      doc.text(
        `Job Type: ${formatJobType(candidateDetails?.positionType as JobType)}`,
        rightX,
        y
      );
      y += 8;

      doc.setDrawColor(0);
      doc.line(leftX, y, pageWidth - 14, y);
      y += 10;

      if (assessmentData && assessmentData.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);

        assessmentData.forEach((item) => {
          const splitQuestion = doc.splitTextToSize(
            `Q: ${item.question}`,
            pageWidth - 28
          );
          doc.text(splitQuestion, leftX, y);
          y += splitQuestion.length * 6 + 2;

          doc.setFont("helvetica", "normal");
          const answer =
            item.answer && item.answer.trim() !== ""
              ? item.answer
              : "No answer provided";
          const splitAnswer = doc.splitTextToSize(
            `A: ${answer}`,
            pageWidth - 28
          );
          doc.text(splitAnswer, leftX, y);
          y += splitAnswer.length * 6 + 6;

          if (y > 260 && item !== assessmentData[assessmentData.length - 1]) {
            doc.addPage();
            y = 20;
          }

          doc.setFont("helvetica", "bold");
        });
      } else {
        doc.text("No assessment data available.", leftX, y);
      }

      const safeName = candidateDetails?.name
        ? candidateDetails.name.replace(/\s+/g, "_")
        : "Candidate";

      doc.save(`${safeName}_Assessment_Form.pdf`);
    };
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
