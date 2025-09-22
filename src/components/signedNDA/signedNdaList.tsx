import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import debounce from "lodash/debounce";
import signedNdaAPI from "../../api/signedNdaApi/signedNdaAPI";
import SignedNdaView from "./signedNdaView";
import SignedNdaRowDisplay from "./signedNdaRowDisplay";
import type { NdaDocument } from "../../types/user";

export default function SignedNdaList() {
  const [ndaDocs, setNdaDocs] = useState<any[]>([]);
  const [editData, setEditData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchNdaDocs = async (page = 1, query = "") => {
    setIsLoading(true);
    try {
      const res = await signedNdaAPI.getAll({ page, limit, search: query });
      setNdaDocs(res.data.data);
      setCurrentPage(page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load NDA documents",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        fetchNdaDocs(1, query);
      }, 800),
    []
  );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      debouncedFetch(searchQuery);
    } else {
      fetchNdaDocs(1, "");
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchQuery]);

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchNdaDocs(currentPage + 1, searchQuery);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) fetchNdaDocs(currentPage - 1, searchQuery);
  };

  return (
    <div className="px-6">
      <SignedNdaView
        fetchNdaDocs={() => fetchNdaDocs(currentPage, searchQuery)}
        editData={editData}
        setEditData={setEditData}
      />

      <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
        <span className="font-Regular text-[20px]">
          Showing all NDAs{" "}
          <span className="text-[12px]">- {ndaDocs.length} Results</span>
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <ClipLoader size={40} color="#16968F" />
        </div>
      ) : (
        <SignedNdaRowDisplay
          data={ndaDocs}
          onEdit={(nda: NdaDocument) => setEditData(nda)}
          fetchNdaDocs={() => fetchNdaDocs(currentPage, searchQuery)}
        />
      )}

      {totalPages > 0 && (
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
  );
}
