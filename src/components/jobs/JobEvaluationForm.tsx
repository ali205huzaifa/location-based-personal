import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import InterviewerAPI from "../../api/interviewersApi/InterviewersAPI";
import ClipLoader from "react-spinners/ClipLoader";
import jsPDF from "jspdf";

interface EvaluationItem {
  _id: string;
  query: string;
  rating?: number;
  comment?: string;
}

interface InterviewerEvaluation {
  _id: string;
  interviewerId: {
    name: string;
    email: string;
    _id: string;
  };
  evaluationItems: EvaluationItem[];
}

interface JobEvaluationFormProps {
  applicationId: string;
  interviewerEvaluations: InterviewerEvaluation[];
}

interface Interviewer {
  id: string;
  name: string;
}

const JobEvaluationForm: React.FC<JobEvaluationFormProps> = ({
  applicationId,
  interviewerEvaluations,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendForm = async () => {
    try {
      setIsSending(true);
      const payload = {
        interviewerEvaluationDate: new Date().toISOString(),
      };

      await JobsAPI.SendEvaluationForm(applicationId, payload);

      Swal.fire({
        icon: "success",
        title: "Form Sent",
        text: "The Evaluation Form has been sent successfully!",
        confirmButtonColor: "#16968F",
      });
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.message?.message || "Failed to send form.",
        confirmButtonColor: "#16968F",
      });
    } finally {
      setIsSending(false);
    }
  };

  const getInterviewerAvgRating = (evalItems: EvaluationItem[]) => {
    if (!evalItems || evalItems.length === 0) return "N/A";
    const total = evalItems.reduce((sum, item) => sum + (item.rating || 0), 0);
    return (total / evalItems.length).toFixed(1);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Job Evaluation Report", 20, 20);

    let y = 40;
    interviewerEvaluations.forEach((evalItem, index) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.text(
        `${index + 1}. Evaluator: ${
          evalItem.interviewerId?.name || "Unknown"
        } (${evalItem.interviewerId?.email || "N/A"})`,
        20,
        y
      );
      y += 8;

      if (evalItem.evaluationItems?.length > 0) {
        evalItem.evaluationItems.forEach((item) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(`• ${item.query}`, 25, y);
          y += 7;
          doc.text(`   Rating: ${item.rating ?? "N/A"}`, 30, y);
          y += 7;
          doc.text(
            `   Comment: ${item.comment || "No comments provided"}`,
            30,
            y
          );
          y += 12;
        });
      } else {
        doc.text("   No evaluation details provided.", 25, y);
        y += 12;
      }

      doc.text(
        `   Average: ${getInterviewerAvgRating(evalItem.evaluationItems)}/10`,
        25,
        y
      );
      y += 14;
    });

    const allRatings = interviewerEvaluations.flatMap(
      (ev) => ev.evaluationItems.map((item) => item.rating || 0) || []
    );
    const avg =
      allRatings.length > 0
        ? (
            allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
          ).toFixed(1)
        : "N/A";

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(14);
    doc.text(`Overall Average Rating: ${avg}/10`, 20, y + 10);

    doc.save("job-evaluation.pdf");
  };

  const handleAddInterviewers = async (selected: Interviewer[]) => {
    try {
      const payload = { interviewers: selected.map((s) => s.id) };
      await JobsAPI.UpdateInterviewerInApplicationById(applicationId, payload);

      Swal.fire({
        icon: "success",
        title: "Interviewers Updated",
        text: "Interviewers have been updated successfully!",
        confirmButtonColor: "#16968F",
      });

      setShowModal(false);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err?.response?.data?.message?.message ||
          "Failed to update interviewers.",
        confirmButtonColor: "#16968F",
      });
    }
  };

  const allRatings = interviewerEvaluations.flatMap(
    (ev) => ev.evaluationItems.map((item) => item.rating || 0) || []
  );
  const avgRating =
    allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(
          1
        )
      : "N/A";

  return (
    <div className="p-4 bg-white rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#303030]">
          Evaluation Form
        </h2>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-[#16968F] text-white text-sm rounded hover:bg-teal-700 transition"
            onClick={() => setShowModal(true)}
          >
            <img
              src="/icons/manageUser-icon.svg"
              alt="Add"
              width={25}
              height={25}
            />
          </button>
          <button
            className="flex items-center gap-2 py-2 px-4 bg-[#16968F] text-white text-sm rounded hover:bg-teal-700 transition"
            onClick={handleSendForm}
            disabled={isSending}
          >
            <img
              src="/icons/mail-icon2.svg"
              alt="Export"
              width={16}
              height={16}
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

      <div className="bg-black h-[40px] mt-6 text-white flex items-center px-4 rounded">
        <h1 className="text-sm font-medium">Average Rating: {avgRating}/10</h1>
      </div>

      <div className="space-y-6 mt-6">
        {interviewerEvaluations && interviewerEvaluations.length > 0 ? (
          interviewerEvaluations.map((evalItem, index) => (
            <div key={evalItem._id} className="pb-4">
              <div className="flex justify-between items-center border-b border-gray-200">
                <h3 className="text-zinc-900 text-lg font-normal leading-loose">
                  {index + 1}. <span>Interviewer :</span>{" "}
                  {evalItem.interviewerId?.name || "Unknown"}
                </h3>
                <span className="font-normal text-gray-900">
                  Average Rating :{" "}
                  {getInterviewerAvgRating(evalItem.evaluationItems)}/10
                </span>
              </div>

              {evalItem.evaluationItems?.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {evalItem.evaluationItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center text-sm text-gray-700 px-4 py-2 border-b border-gray-200"
                    >
                      <p className="flex-1 pr-4">{item.query}</p>
                      <span className="text-gray-900">
                        Rating : {item.rating ?? "N/A"}/10
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-4">
                  No evaluation details provided.
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-red-500 font-normal text-center">
            No evaluations submitted by interviewers yet.
          </p>
        )}
      </div>

      {showModal && (
        <InterviewersModalInline
          onClose={() => setShowModal(false)}
          onSelect={handleAddInterviewers}
        />
      )}
    </div>
  );
};

const InterviewersModalInline: React.FC<{
  onClose: () => void;
  onSelect: (selected: Interviewer[]) => void;
}> = ({ onClose, onSelect }) => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const res = await InterviewerAPI.getAll({});
        const mapped = (res.data.data || []).map((item: any) => ({
          id: item._id,
          name: item.name,
        }));
        setInterviewers(mapped);
      } catch {
        Swal.fire("Error", "Failed to load interviewers", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (selected.length === 0) {
      Swal.fire("Warning", "Please select at least one interviewer", "warning");
      return;
    }
    const selectedObjs = interviewers.filter((i) => selected.includes(i.id));
    onSelect(selectedObjs);
  };

  const filtered = interviewers.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white w-[400px] rounded-lg shadow-lg relative flex flex-col h-[350px]">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-base font-medium">Select Interviewers</h2>
          <button onClick={onClose}>
            <img
              src="/icons/cross-icon.svg"
              alt="Close"
              width={16}
              height={16}
            />
          </button>
        </div>

        <div className="relative border-b">
          <input
            type="text"
            placeholder="Search interviewers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-sm outline-none custom-select"
          />
          <img
            src="/icons/search-icon.svg"
            alt="Search"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <ClipLoader size={30} color="#16968F" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No interviewers found.</p>
          ) : (
            filtered.map((person) => (
              <label
                key={person.id}
                className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <img src="/icons/User.svg" alt="" width={16} height={16} />
                  <span className="text-sm">{person.name}</span>
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(person.id)}
                  onChange={() => toggleSelect(person.id)}
                  className="ml-2 accent-[#16968F]"
                />
              </label>
            ))
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t gap-6">
          <button
            onClick={handleAdd}
            className="bg-[#16968F] text-white px-8 py-2 rounded text-sm whitespace-nowrap"
          >
            Add Interviewers
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobEvaluationForm;
