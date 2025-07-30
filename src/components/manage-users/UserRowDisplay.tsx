import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UsersAPI from "../../api/manage-userApi/UserAPI";
import type { User } from "../../types/user";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

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
      setLoading(true);
      try {
        const res = await UsersAPI.getAll();
        if (res?.data?.isSuccess) {
          setUsers(res.data.data);
          setTotalItems(res.data.totalItems);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshKey]);

  return (
    <div className="relative">
      <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
        <span className="font-Regular text-[20.38px]">
          Showing all Users{" "}
          <span className="text-[11.91px]">- {totalItems} Results</span>
        </span>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <ClipLoader color="#16968F" size={50} />
        </div>
      ) : (
        <div className="bg-white rounded-b-lg shadow-lg overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-[#8B8B8B] uppercase text-sm">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Roles</th>
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
                  <td className="p-4">{user.role.name}</td>
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
      )}
    </div>
  );
};

export default UserRowDisplay;
