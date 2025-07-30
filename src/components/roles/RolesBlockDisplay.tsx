import React from "react";

interface Role {
  id: string;
  name: string;
}

interface RolesBlockDisplayProps {
  roles: Role[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RolesBlockDisplay: React.FC<RolesBlockDisplayProps> = ({
  roles,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className="border border-gray-300 rounded-lg p-6 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <img
              src="/icons/roles-icon2.svg"
              alt="User Icon"
              className="w-6 h-6"
            />
            <span className="text-md font-medium">{role.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onEdit(role.id)}>
              <img src="/icons/edit-icon.svg" alt="Edit" className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(role.id)}>
              <img
                src="/icons/delete-icon.svg"
                alt="Delete"
                className="w-4 h-4 text-red-500"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RolesBlockDisplay;
