import React from "react";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, boolean>) => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data: Record<string, boolean> = {};
    permissionsList.forEach((permission) => {
      data[permission.name] = formData.get(permission.name) === "on";
    });

    if (onSubmit) {
      onSubmit(data);
    }

    onClose();
  };

  const permissionsList = [
    { label: "View Jobs List", name: "viewJobsList" },
    { label: "Post Job", name: "postJob" },
    { label: "Edit Job", name: "editJob" },
    { label: "View Candidate List", name: "viewCandidateList" },
    { label: "Add Interviewer", name: "addInterviewer" },
    { label: "Remove Interviewer", name: "removeInterviewer" },
    { label: "View Archive Jobs List", name: "viewArchiveJobsList" },
    { label: "Shortlisted Candidates", name: "shortlistedCandidates" },
    { label: "Interview Scheduled List", name: "interviewScheduledList" },
    { label: "Interviewed List", name: "interviewedList" },
    { label: "Selected Candidates List", name: "selectedCandidatesList" },
    { label: "Send Offer Letter", name: "sendOfferLetter" },
    { label: "Rejected Candidates", name: "rejectedCandidates" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-150 p-6 relative max-h-[90vh] overflow-y-auto shadow-xl border border-[#D9D9D9]">
        <button
          onClick={onClose}
          className="absolute top-7 right-3 text-gray-400 hover:text-black"
        >
          <img
            src="/icons/cross-icon.svg"
            alt="Close modal"
            width={15}
            height={15}
          />
        </button>

        <h2 className="text-lg font-medium mb-4 text-center">Permissions</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mt-6 max-h-64 overflow-y-auto pr-2">
            {permissionsList.map((permission) => (
              <label
                key={permission.name}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  name={permission.name}
                  className="form-checkbox accent-[#16968F]"
                />
                <span className="text-sm">{permission.label}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="px-6 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-Regular"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PermissionsModal;
