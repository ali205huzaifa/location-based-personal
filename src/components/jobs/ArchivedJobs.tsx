import { useState, useEffect, useMemo } from "react";
import debounce from "lodash/debounce";
import ClipLoader from "react-spinners/ClipLoader";
import JobsAPI from "../../api/jobsApi/JobsAPI";
import Swal from "sweetalert2";

interface ArchivedJobsProps {
  onClose: () => void;
}

interface ArchivedJob {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  experience: string;
  posted: string;
}

export default function ArchivedJobs({ onClose }: ArchivedJobsProps) {
  const [jobs, setJobs] = useState<ArchivedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const fetchArchivedJobs = (page = 1, search = "") => {
    setLoading(true);
    JobsAPI.Archivedjobs({
      page,
      limit,
      search: search || undefined,
      status: "Inactive",
    })
      .then((res) => {
        const formattedJobs = res.data.data.map((item: any) => ({
          id: item._id,
          title: item.title,
          department: item.departmentId?.name,
          type: item.jobType,
          location: item.countryId?.name,
          experience: item.experienceLevel,
          posted: new Date(item.postingStartDate).toLocaleDateString(),
        }));
        setJobs(formattedJobs);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error("Failed to fetch archived jobs", err))
      .finally(() => setLoading(false));
  };

  const debouncedFetchArchivedJobs = useMemo(
    () =>
      debounce((page: number, search: string) => {
        fetchArchivedJobs(page, search);
      }, 1000),
    []
  );

  useEffect(() => {
    debouncedFetchArchivedJobs(currentPage, searchTerm);
    return debouncedFetchArchivedJobs.cancel;
  }, [currentPage, searchTerm, debouncedFetchArchivedJobs]);

  const handleConfirmUnarchive = () => {
    if (!selectedJobId) return;

    JobsAPI.UnArchiveJob(selectedJobId)
      .then(() => {
        setJobs((prev) => prev.filter((job) => job.id !== selectedJobId));
        setShowModal(false);

        Swal.fire({
          icon: "success",
          text: "The job has been successfully moved back to active.",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch((err) => {
        console.error("Failed to unarchive job", err);

        Swal.fire({
          icon: "error",
          text: "Failed to unarchive the job. Please try again.",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      });
  };

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between pb-2 mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2 whitespace-nowrap">
          Showing all Archived Jobs{" "}
          <span className="text-sm text-gray-500">{jobs.length} Results</span>
        </h2>

        <div className="flex-1 max-w-xl mx-6 relative">
          <img
            src="/icons/search-icon.svg"
            alt="Search"
            width={18}
            height={18}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-b border-gray-300 pl-6 pr-2 py-1 text-sm focus:outline-none focus:border-gray-500"
          />
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full flex items-center justify-center"
        >
          <img src="/icons/cross-icon.svg" alt="Close" width={15} height={15} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <ClipLoader size={35} color="#16968F" />
        </div>
      ) : (
        <div className="overflow-x-auto border-t border-gray-400">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-6 py-3">Job</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Experience</th>
                <th className="px-6 py-3">Posted</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{job.title}</td>
                  <td className="px-6 py-4">
                    {job.department === "MOBILE_APP_DEVELOPMENT"
                      ? "Mobile_Development"
                      : job.department}
                  </td>
                  <td className="px-6 py-4">{job.type}</td>
                  <td className="px-6 py-4">{job.location}</td>
                  <td className="px-6 py-4">{job.experience}</td>
                  <td className="px-6 py-4">{job.posted}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setShowModal(true);
                      }}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 "
                    >
                      Unarchive job
                    </button>
                  </td>
                </tr>
              ))}

              {jobs.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No archived jobs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages >= 1 && (
        <div className="flex justify-center mt-6 gap-4 items-center">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-black bg-opacity-30 z-50">
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 rounded-full hover:bg-gray-100"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Close"
                width={16}
                height={16}
              />
            </button>

            <h3 className="text-lg font-medium mb-6">
              Do you want to unarchive this Job?
            </h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmUnarchive}
                className="px-12 py-2 text-white bg-[#16968F] rounded hover:bg-[#13837d]"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-12 py-2 text-black border border-gray-300 rounded hover:bg-gray-100"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
