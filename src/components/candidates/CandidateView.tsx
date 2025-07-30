import { useEffect, useState } from "react";
import CandidateRowDisplay from "./CandidateRowDisplay";
import CandidateGridDisplay from "./CandidateGridDisplay";
import CandidateFilters from "./CandidateFilters";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import CandidatesAPI from "../../api/candidatesApi/CandidateAPI";

export interface Candidate {
  fullName: string;
  email: string;
  location: string;
  currentSalary: string;
  expectedSalary: string;
  createdAt: string;
  jobTitle: string;
}

export default function CandidateView() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await CandidatesAPI.getAll();
      const transformed = res.data.data.map((app: any) => ({
        fullName: app.candidateId.fullName,
        email: app.candidateId.email,
        location: app.candidateId.currentLocation,
        currentSalary: app.candidateId.currentSalary,
        expectedSalary: app.candidateId.expectedSalary,
        createdAt: new Date(app.createdAt).toLocaleDateString(),
        jobTitle: app.jobId.title,
      }));

      setCandidates(transformed);
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <ClipLoader size={40} color="#000" />
          </div>
        ) : view === "list" ? (
          <CandidateRowDisplay candidates={candidates} />
        ) : (
          <CandidateGridDisplay candidates={candidates} />
        )}
      </div>
    </div>
  );
}
