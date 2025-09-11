import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import InterviewerAPI from "../../api/interviewersApi/InterviewersAPI";

interface Interviewer {
  id: string;
  name: string;
}

interface InterviewersModalProps {
  onClose: () => void;
  onSelect: (selected: Interviewer[]) => void;
  preselected?: string[];
}

const InterviewersModal: React.FC<InterviewersModalProps> = ({
  onClose,
  onSelect,
  preselected = [],
}) => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>(
    preselected || []
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedInterviewers(preselected || []);
  }, [preselected]);

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
      } catch (err) {
        Swal.fire("Error", "Failed to load interviewers", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedInterviewers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sel) => sel !== id);
      }
      return [id, ...prev];
    });
  };

  const sortedInterviewers = [...interviewers].sort((a, b) => {
    const aSel = selectedInterviewers.includes(a.id);
    const bSel = selectedInterviewers.includes(b.id);
    if (aSel && !bSel) return -1;
    if (!aSel && bSel) return 1;
    return 0;
  });

  const filteredInterviewers = sortedInterviewers.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (selectedInterviewers.length === 0) {
      Swal.fire("Warning", "Please select at least one interviewer", "warning");
      return;
    }

    const selectedObjs = interviewers.filter((i) =>
      selectedInterviewers.includes(i.id)
    );

    onSelect(selectedObjs);

    Swal.fire({
      icon: "success",
      text: "Interviewers added successfully!",
      toast: true,
      position: "top-right",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div
        className="bg-white w-[400px] rounded-lg shadow-lg relative flex flex-col"
        style={{ height: "350px" }}
      >
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
          ) : filteredInterviewers.length === 0 ? (
            <p className="text-gray-500 text-sm">No interviewers found.</p>
          ) : (
            filteredInterviewers.map((person) => (
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
                  checked={selectedInterviewers.includes(person.id)}
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
          <span className="text-xs text-gray-500">
            Email will be sent to them about interview scheduling
          </span>
        </div>
      </div>
    </div>
  );
};

export default InterviewersModal;
