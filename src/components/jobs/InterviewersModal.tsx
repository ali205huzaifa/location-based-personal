import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import InterviewerAPI from "../../api/interviewersApi/InterviewersAPI";
import debounce from "lodash/debounce";

interface Interviewer {
  id: string;
  name: string;
}

interface SelectInterviewersModalProps {
  onClose: () => void;
  onSelect: (selected: Interviewer[]) => void;
}

const SelectInterviewersModal: React.FC<SelectInterviewersModalProps> = ({
  onClose,
  onSelect,
}) => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState<
    Interviewer[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchInterviewers = async (query: string) => {
    if (!query.trim()) {
      setInterviewers([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await InterviewerAPI.getAll({ search: query });

      const mapped = (res.data.data || []).map((item: any) => ({
        id: item._id,
        name: item.name,
      }));

      setInterviewers(mapped);
    } catch (err) {
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

  const debouncedFetch = useCallback(debounce(fetchInterviewers, 1000), []);

  const toggleSelect = (interviewer: Interviewer) => {
    setSelectedInterviewers((prev) => {
      const exists = prev.find((i) => i.id === interviewer.id);
      if (exists) {
        return prev.filter((i) => i.id !== interviewer.id);
      }
      return [...prev, interviewer];
    });
  };

  const removeInterviewer = (id: string) => {
    setSelectedInterviewers((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAdd = () => {
    if (selectedInterviewers.length === 0) {
      Swal.fire(
        "Warning",
        "Please select at least one interviewer.",
        "warning"
      );
      return;
    }
    Swal.fire("Success", "Interviewers added successfully!", "success");
    onSelect(selectedInterviewers);
    onClose();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedFetch(query);
  };

  const availableInterviewers = interviewers.filter(
    (person) => !selectedInterviewers.some((sel) => sel.id === person.id)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className="bg-white w-[400px] rounded-lg shadow-lg relative flex flex-col"
        style={{ height: "300px" }}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-base font-medium">Add Interviewers</h2>
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
            onChange={handleSearch}
            className="w-full pl-8 pr-8 py-2 text-sm outline-none custom-select"
          />
          <img
            src="/icons/search-icon.svg"
            alt="Search"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {searchQuery && (
            <div className="mb-2">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <ClipLoader size={30} color="#16968F" />
                </div>
              ) : availableInterviewers.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  {interviewers.length === 0
                    ? "No interviewers found."
                    : "All search results already selected."}
                </p>
              ) : (
                availableInterviewers.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSelect(person)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src="/icons/User.svg"
                        alt=""
                        width={16}
                        height={16}
                      />
                      <span className="text-sm">{person.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedInterviewers.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between py-2 border-b"
            >
              <div className="flex items-center gap-2">
                <img src="/icons/User.svg" alt="" width={16} height={16} />
                <span className="text-sm">{person.name}</span>
              </div>
              <button
                onClick={() => removeInterviewer(person.id)}
                className="text-red-500"
              >
                <img
                  src="/icons/delete-icon.svg"
                  alt="Delete"
                  width={14}
                  height={14}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t gap-6">
          <button
            onClick={handleAdd}
            className="bg-[#16968F] text-white px-8 py-2 rounded text-sm whitespace-nowrap"
          >
            Add Interviewers
          </button>
          <span className="text-xs text-gray-500">
            Email will be sent to them about interview scheduling
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectInterviewersModal;
