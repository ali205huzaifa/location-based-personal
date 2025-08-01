import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import InterviewerCreate from "./InterviewerCreate";
import InterviewerRowDisplay from "./InterviewerRowDisplay";
import type { Interviewer } from "../../types/user";
import InterviewerAPI from "../../api/interviewersApi/InterviewersAPI";

export default function InterviewerView() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [editData, setEditData] = useState<Interviewer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchInterviewers = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await InterviewerAPI.getAll({ page, limit });
      setInterviewers(res.data.data);
      setCurrentPage(page);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      console.error("Error fetching interviewers:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to load interviewers",
        text: "Something went wrong while fetching interviewers.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewers(currentPage);
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchInterviewers(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) fetchInterviewers(currentPage - 1);
  };

  return (
    <div className="">
      <div className="px-6">
        <InterviewerCreate
          fetchInterviewers={fetchInterviewers}
          editData={editData}
          setEditData={setEditData}
        />

        <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
          <span className="font-Regular text-[20.38px]">
            Showing all Interviewers{" "}
            <span className="text-[11.91px]">
              - {interviewers.length} Results
            </span>
          </span>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <ClipLoader size={50} color="#16968F" />
          </div>
        ) : (
          <InterviewerRowDisplay
            data={interviewers}
            onEdit={(interviewer) => setEditData(interviewer)}
            fetchInterviewers={fetchInterviewers}
          />
        )}
        {totalPages >= 1 && (
          <div className="flex justify-center mt-6 gap-4 items-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
