import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import RoleAPI from "../../api/roleApi/roleAPI";
import ClipLoader from "react-spinners/ClipLoader";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, boolean>) => void;
  role?: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
  onSuccess?: () => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  role,
  onSuccess,
}) => {
  const [nameError, setNameError] = useState("");
  const [permissionsError, setPermissionsError] = useState("");

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setSelectedPermissions([]);
    setNameError("");
    setPermissionsError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setSelectedPermissions(role.permissions || []);
    } else {
      resetForm();
    }
  }, [role]);

  const permissionsList = [
    { label: "View Dashboard", name: "view-dashboard" },
    { label: "View Job", name: "view-job" },
    { label: "View Candidates", name: "view-candidates" },
    /*{ label: "View User", name: "view-user" },
    { label: "View AccessRole", name: "view-accessRole" },*/
    { label: "View Interviewer", name: "view-interviewer" },
    { label: "Create Job", name: "create-job" },
    { label: "Edit Job", name: "edit-job" },
    { label: "Send Email", name: "send-email" },
    { label: "Schedule Interview", name: "schedule-interview" },
    { label: "Send Form", name: "send-form" },
    { label: "Archived Jobs", name: "archived-jobs" },
    { label: "View Locations", name: "view-locations" },
    { label: "View Department", name: "view-deptSkills" },
  ];

  const handleCheckboxChange = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const payload = {
      name: name.trim(),
      permissions: selectedPermissions,
    };

    let hasError = false;

    if (!payload.name) {
      setNameError("Role name is required.");
      hasError = true;
    }

    if (payload.permissions.length === 0) {
      setPermissionsError("At least one permission must be selected.");
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      if (role?.id) {
        await RoleAPI.UpdateRole(role.id, payload);
        Swal.fire({
          text: "Role updated successfully!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await RoleAPI.AddRole(payload.name, payload.permissions);
        Swal.fire({
          text: "Role created successfully!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }

      onSuccess?.();
      onClose();
      resetForm();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        "Something went wrong while saving role.";
      Swal.fire("Error", errorMsg, "error");
      console.error("Failed to save role", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-lg w-[350px] p-6 relative max-h-[90vh] overflow-y-auto shadow-xl border border-[#D9D9D9]">
        <button
          onClick={handleClose}
          className="absolute top-7 right-3 text-gray-400 hover:text-black"
        >
          <img
            src="/icons/cross-icon.svg"
            alt="Close modal"
            width={15}
            height={15}
          />
        </button>

        <h2 className="text-lg font-medium mb-4 text-center">Access Role</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Role Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              autoComplete="off"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Enter role name"
            />
            {nameError && (
              <div className="text-red-500 text-sm mt-1">{nameError}</div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 pr-2">
            {permissionsList.map((perm) => (
              <label key={perm.name} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={perm.name}
                  checked={selectedPermissions.includes(perm.name)}
                  onChange={() => {
                    handleCheckboxChange(perm.name);
                    if (permissionsError) setPermissionsError("");
                  }}
                  className="form-checkbox accent-[#16968F]"
                />
                <span className="text-sm">{perm.label}</span>
              </label>
            ))}
            {permissionsError && (
              <div className="text-red-500 text-sm mt-1">
                {permissionsError}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 text-white py-2 rounded-md font-Regular 
    ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-teal-600 hover:bg-teal-700"
    }`}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PermissionsModal;
