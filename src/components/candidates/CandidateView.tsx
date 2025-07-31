import { useEffect, useState } from "react";
import CandidateRowDisplay from "./CandidateRowDisplay";
import CandidateGridDisplay from "./CandidateGridDisplay";
import CandidateFilters from "./CandidateFilters";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import CandidatesAPI from "../../api/candidatesApi/CandidateAPI";
import CandidateDetailModal from "./CandidateDetailModal";

export interface Candidate {
  fullName: string;
  email: string;
  location: string;
  currentSalary: string;
  expectedSalary: string;
  createdAt: string;
  jobTitle: string;
  phoneNumber: string;
  linkedinProfile: string;
  cvUrl: string;
  portfolio: string;
  noticePeriod: string;
  applicationQuestions: string;
}

export default function CandidateView() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchCandidates(currentPage);
  }, [currentPage]);

  const fetchCandidates = async (page = 1) => {
    setLoading(true);
    try {
      const res = await CandidatesAPI.getAll({ page, pageSize });
      const transformed = res.data.data.map((app: any) => ({
        fullName: app.candidateId.fullName,
        email: app.candidateId.email,
        location: app.candidateId.currentLocation,
        currentSalary: app.candidateId.currentSalary,
        expectedSalary: app.candidateId.expectedSalary,
        createdAt: new Date(app.createdAt).toLocaleDateString(),
        jobTitle: app.jobId.title,
        phoneNumber: app.candidateId.phoneNumber,
        linkedinProfile: app.candidateId.linkedinProfile,
        cvUrl: app.candidateId.cvUrl,
        portfolio: app.candidateId.portfolio,
        noticePeriod: app.candidateId.noticePeriod,
        applicationQuestions: app.jobId.applicationQuestions,
      }));

      setCandidates(transformed);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.currentPage || 1);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load candidates", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="px-6">
        <CandidateFilters />

        <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg mt-4">
          <span className="font-Regular text-[20.38px]">
            Showing all Candidates{" "}
            <span className="text-[11.91px]">
              - {candidates.length} Results
            </span>
          </span>

          <div className="flex items-center gap-4">
            <span className="font-Regular text-[11.91px]">
              {view === "list" ? "Showing List view" : "Showing Card view"}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setView("list")}
                className={`cursor-pointer p-1.5 rounded ${
                  view === "list"
                    ? "bg-[#202020] text-black"
                    : "bg-transparent text-white"
                }`}
              >
                <img
                  src="/icons/List-icon.svg"
                  alt="List"
                  width={20}
                  height={20}
                />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`cursor-pointer p-1.5 rounded ${
                  view === "grid"
                    ? "bg-[#202020] text-black"
                    : "bg-transparent text-white"
                }`}
              >
                <img
                  src="/icons/grid-icon.svg"
                  alt="Grid"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>

        <CandidateDetailModal
          candidate={selectedCandidate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <ClipLoader size={40} color="#16968F" />
          </div>
        ) : view === "list" ? (
          <CandidateRowDisplay
            candidates={candidates}
            onView={handleViewCandidate}
          />
        ) : (
          <CandidateGridDisplay
            candidates={candidates}
            onView={handleViewCandidate}
          />
        )}

        {!loading && (
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
