import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PermissionsModal from "../permissions/permissionsModal";
import UsersAPI from "../../api/manage-userApi/UserAPI";
import type { User } from "../../types/user";

interface Props {
  setUserToEdit: React.Dispatch<React.SetStateAction<User | undefined>>;
  refreshKey: number;
  refreshUsers: () => void;
}

const UserRowDisplay: React.FC<Props> = ({
  refreshKey,
  refreshUsers,
  setUserToEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await UsersAPI.DeleteUser(userId);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        refreshUsers();
      } catch (err) {
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await UsersAPI.getAll();
        if (res?.data?.isSuccess) {
          setUsers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [refreshKey]);

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
            {users.map((user) => (
              <tr
                key={user._id}
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
                <td className="p-4">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-center flex items-center justify-center space-x-3">
                  <button
                    className="cursor-pointer"
                    onClick={() => setUserToEdit(user)}
                  >
                    <img
                      src="/icons/edit-icon.svg"
                      alt="Edit"
                      width={18}
                      height={18}
                    />
                  </button>

                  <button
                    className="cursor-pointer"
                    onClick={() => handleDelete(user._id)}
                  >
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
