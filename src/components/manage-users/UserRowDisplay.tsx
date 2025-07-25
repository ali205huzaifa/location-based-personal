import React, { useState } from "react";
import PermissionsModal from "../permissions/permissionsModal";

interface User {
  name: string;
  email: string;
  lastUpdated: string;
}

const users: User[] = [
  {
    name: "Arslan Rehman",
    email: "ArslanRehman123@gmail.com",
    lastUpdated: "12/02/2025",
  },
  {
    name: "Saba Rauf",
    email: "Saba0215@gmail.com",
    lastUpdated: "12/02/2025",
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    lastUpdated: "10/01/2025",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    lastUpdated: "05/15/2025",
  },
];

const UserRowDisplay: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <div className="bg-white rounded-b-lg shadow-lg overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-[#8B8B8B] uppercase text-sm">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Permissions</th>
              <th className="p-4 font-medium">Last Updated</th>
              <th className="p-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className="border-b border-[#CDCDCD] hover:bg-gray-50 font-Regular text-[16px]"
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <button
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-xl text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Manage permissions
                  </button>
                </td>
                <td className="p-4">{user.lastUpdated}</td>
                <td className="p-4 text-center flex items-center justify-center space-x-3">
                  <button className="cursor-pointer">
                    <img
                      src="/icons/edit-icon.svg"
                      alt="Edit"
                      width={18}
                      height={18}
                    />
                  </button>

                  <button className="cursor-pointer">
                    <img
                      src="/icons/delete-icon.svg"
                      alt="Delete"
                      width={15}
                      height={15}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PermissionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UserRowDisplay;
