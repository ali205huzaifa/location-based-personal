import { useEffect, useState, useMemo } from "react";
import CandidateRowDisplay from "./CandidateRowDisplay";
import CandidateGridDisplay from "./CandidateGridDisplay";
import CandidateFilters from "./CandidateFilters";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";
import CandidatesAPI from "../../api/candidatesApi/CandidateAPI";
import CandidateDetailModal from "./CandidateDetailModal";
import debounce from "lodash/debounce";

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

function buildCandidateFilters({
  candidateName,
  jobTitle,
  candidateLocation,
  candidateGender,
  currentSalary,
  expectedSalary,
  startDate,
  endDate,
}: {
  candidateName: string;
  jobTitle: string;
  candidateLocation: string;
  candidateGender: string;
  currentSalary: number;
  expectedSalary: number;
  startDate: Date;
  endDate: Date;
}) {
  const filters: Record<string, any> = {};

  if (candidateName.trim()) filters.candidateName = candidateName;
  if (jobTitle !== "All Jobs") filters.jobTitle = jobTitle;
  if (candidateLocation !== "By Location")
    filters.candidateLocation = candidateLocation;
  if (candidateGender !== "gender") filters.candidateGender = candidateGender;
  if (currentSalary !== 0) filters["currentSalary[gte]"] = currentSalary;
  if (expectedSalary !== 200000)
    filters["expectedSalary[lte]"] = expectedSalary;

  const defaultStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const defaultEnd = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  );

  const isCustomDateRange =
    startDate.getTime() !== defaultStart.getTime() ||
    endDate.getTime() !== defaultEnd.getTime();

  if (isCustomDateRange) {
    filters.startDate = startDate.toISOString();
    filters.endDate = endDate.toISOString();
  }

  return filters;
}

export default function CandidateView() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [jobTitle, setJobTitle] = useState("All Jobs");
  const [candidateLocation, setCandidateLocation] = useState("By Location");
  const [candidateGender, setCandidateGender] = useState("gender");

  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );

  const [currentSalary, setCurrentSalary] = useState(0);
  const [expectedSalary, setExpectedSalary] = useState(200000);

  const [currentSalaryInput, setCurrentSalaryInput] = useState(0);
  const [expectedSalaryInput, setExpectedSalaryInput] = useState(200000);

  const [filtersTouched, setFiltersTouched] = useState(false);

  const [candidateName, setcandidateName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const fetchCandidates = async (page = 1, query = "") => {
    setLoading(true);
    try {
      const filters = filtersTouched
        ? buildCandidateFilters({
            candidateName,
            jobTitle,
            candidateLocation,
            candidateGender,
            currentSalary,
            expectedSalary,
            startDate,
            endDate,
          })
        : {};

      const params: any = {
        page,
        limit,
        ...filters,
      };

      if (query.trim() !== "") {
        params.candidateName = query;
      }

      const res = await CandidatesAPI.getAll(params);

      const transformed = res.data.data.map((app: any) => ({
        fullName: app.candidate.fullName,
        email: app.candidate.email,
        location: app.candidate.currentLocation,
        currentSalary: app.candidate.currentSalary,
        expectedSalary: app.candidate.expectedSalary,
        createdAt: new Date(app.createdAt).toLocaleDateString(),
        jobTitle: app.job.title,
        phoneNumber: app.candidate.phoneNumber,
        linkedinProfile: app.candidate.linkedinProfile,
        cvUrl: app.candidate.cvUrl,
        portfolio: app.candidate.portfolio,
        noticePeriod: app.candidate.noticePeriod,
        applicationQuestions: app.job.applicationQuestions,
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

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        fetchCandidates(1, query);
      }, 1000),
    []
  );

  const debouncedSetCurrentSalary = useMemo(
    () =>
      debounce((val: number) => {
        setCurrentSalary(val);
        setFiltersTouched(true);
      }, 1000),
    []
  );

  const debouncedSetExpectedSalary = useMemo(
    () =>
      debounce((val: number) => {
        setExpectedSalary(val);
        setFiltersTouched(true);
      }, 1000),
    []
  );

  const debouncedSetStartDate = useMemo(
    () =>
      debounce((val: Date) => {
        setStartDate(val);
        setFiltersTouched(true);
      }, 1000),
    []
  );

  const debouncedSetEndDate = useMemo(
    () =>
      debounce((val: Date) => {
        setEndDate(val);
        setFiltersTouched(true);
      }, 1000),
    []
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
      debouncedSetCurrentSalary.cancel();
      debouncedSetExpectedSalary.cancel();
      debouncedSetStartDate.cancel();
      debouncedSetEndDate.cancel();
    };
  }, []);

  useEffect(() => {
    const page = filtersTouched ? 1 : currentPage;

    if (candidateName.trim() !== "") {
      debouncedFetch(candidateName);
    } else {
      fetchCandidates(page);
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [
    candidateName,
    currentPage,
    filtersTouched,
    jobTitle,
    candidateLocation,
    candidateGender,
    currentSalary,
    expectedSalary,
    startDate,
    endDate,
  ]);

  const handleNextPage = () => {
    if (currentPage < totalPages)
      fetchCandidates(currentPage + 1, candidateName);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) fetchCandidates(currentPage - 1, candidateName);
  };
  return (
    <div className="">
      <div className="px-6">
        <CandidateFilters
          candidateName={candidateName}
          setcandidateName={(val) => {
            setcandidateName(val);
            setFiltersTouched(true);
          }}
          jobTitle={jobTitle}
          setJobTitle={(val) => {
            setJobTitle(val);
            setFiltersTouched(true);
          }}
          candidateLocation={candidateLocation}
          setCandidateLocation={(val) => {
            setCandidateLocation(val);
            setFiltersTouched(true);
          }}
          candidateGender={candidateGender}
          setCandidateGender={(val) => {
            setCandidateGender(val);
            setFiltersTouched(true);
          }}
          currentSalary={currentSalaryInput}
          expectedSalary={expectedSalaryInput}
          setCurrentSalary={(val) => {
            setCurrentSalaryInput(val);
            debouncedSetCurrentSalary(val);
          }}
          setExpectedSalary={(val) => {
            setExpectedSalaryInput(val);
            debouncedSetExpectedSalary(val);
          }}
          startDate={startDate}
          endDate={endDate}
          setStartDate={debouncedSetStartDate}
          setEndDate={debouncedSetEndDate}
          onReset={() => {
            setFiltersTouched(false);
            setJobTitle("All Jobs");
            setCandidateLocation("By Location");
            setCandidateGender("gender");
            setCurrentSalary(0);
            setExpectedSalary(200000);
            setCurrentSalaryInput(0);
            setExpectedSalaryInput(200000);
            setStartDate(
              new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            );
            setEndDate(
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            );
          }}
        />

        <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg mt-4">
          <span className="font-Regular text-[20.38px]">
            Showing all Candidates{" "}
            <span className="text-[11.91px] text-stone-300 text-xs font-normal leading-snug">
              - {candidates.length} Results
            </span>
          </span>

          <div className="flex items-center gap-4">
            <span className="font-Regular text-[11.91px]">
              {view === "list" ? "List view" : "Card view"}
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
