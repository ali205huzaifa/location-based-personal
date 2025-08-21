import React from "react";
import { motion } from "framer-motion";

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
  if (roles.length === 0) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-red-500 font-medium text-lg"> No roles found!</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {roles.map((role) => (
        <motion.div
          key={role.id}
          className="border border-gray-300 rounded-lg p-6 flex items-center justify-between shadow-sm bg-white"
          variants={{
            hidden: { opacity: 0, x: -40 },
            visible: { opacity: 1, x: 0 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
            zIndex: 5,
          }}
          style={{ position: "relative" }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/icons/roles-icon2.svg"
              alt="User Icon"
              className="w-6 h-6"
            />
            <span className="text-md font-medium text-gray-800">
              {role.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEdit(role.id)}
              className="hover:scale-110 transition-transform"
            >
              <img src="/icons/edit-icon.svg" alt="Edit" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(role.id)}
              className="hover:scale-110 transition-transform"
            >
              <img
                src="/icons/delete-icon.svg"
                alt="Delete"
                className="w-4 h-4"
              />
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RolesBlockDisplay;
