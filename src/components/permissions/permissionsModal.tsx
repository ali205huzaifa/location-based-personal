import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import RoleAPI from "../../api/roleApi/roleAPI";

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
    { label: "Create User", name: "create-user" },
    { label: "View User", name: "view-user" },
    { label: "Update User", name: "update-user" },
    { label: "Delete User", name: "delete-user" },
    { label: "Create Job", name: "create-job" },
    { label: "Edit Job", name: "edit-job" },
    { label: "View Job", name: "view-job" },
    { label: "Delete Job", name: "delete-job" },
    { label: "Create Application", name: "create-application" },
    { label: "Edit Application", name: "edit-application" },
    { label: "View Application", name: "view-application" },
    { label: "Delete Application", name: "delete-application" },
  ];

  const handleCheckboxChange = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      permissions: selectedPermissions,
    };

    setNameError("");
    setPermissionsError("");

    let hasError = false;

    if (!payload.name) {
      setNameError("Role name is required.");
      hasError = true;
    }

    if (payload.permissions.length === 0) {
      setPermissionsError("At least one permission must be selected.");
      hasError = true;
    }

    if (hasError) return;

    try {
      if (role?.id) {
        await RoleAPI.UpdateRole(role.id, payload);
        Swal.fire({
          title: "Success",
          text: "Role updated successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
        });
      } else {
        await RoleAPI.AddRole(payload.name, payload.permissions);
        Swal.fire({
          title: "Success",
          text: "Role created successfully!",
          icon: "success",
          confirmButtonColor: "#16968F",
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
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
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

        <h2 className="text-lg font-medium mb-4 text-center">
          {role ? "Update Role" : "Create Role"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Role Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                  onChange={() => handleCheckboxChange(perm.name)}
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
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-Regular"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PermissionsModal;
