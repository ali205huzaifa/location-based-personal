import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import UsersAPI from "../../api/manage-userApi/UserAPI";
import ClipLoader from "react-spinners/ClipLoader";
import type { User } from "../../types/user";
import debounce from "lodash/debounce";

interface Props {
  setUserToEdit: React.Dispatch<React.SetStateAction<User | undefined>>;
  refreshKey: number;
  refreshUsers: () => void;
  searchQuery: string;
}

const UserRowDisplay: React.FC<Props> = ({
  refreshKey,
  refreshUsers,
  setUserToEdit,
  searchQuery,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchUsers = async (page = 1, query = "") => {
    setLoading(true);
    try {
      const res = await UsersAPI.getAll({ page, limit, search: query });
      if (res?.data?.isSuccess) {
        setUsers(res.data.data);
        setTotalItems(res.data.totalItems);
        setCurrentPage(page);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [refreshKey]);

  const debouncedFetchUsers = useMemo(
    () =>
      debounce((query: string) => {
        fetchUsers(1, query);
      }, 1000),
    []
  );

  useEffect(() => {
    debouncedFetchUsers(searchQuery);
    return () => debouncedFetchUsers.cancel();
  }, [searchQuery]);

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16968F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await UsersAPI.DeleteUser(userId);
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted!",
          icon: "success",
          confirmButtonColor: "#16968F",
        });
        refreshUsers();
      } catch {
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };

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
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Roles</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-[#CDCDCD] hover:bg-gray-50 text-[16px]"
                  >
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.role?.name}</td>
                    <td className="p-4">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center flex justify-center space-x-3">
                      <button onClick={() => setUserToEdit(user)}>
                        <img
                          src="/icons/edit-icon.svg"
                          alt="Edit"
                          width={18}
                          height={18}
                        />
                      </button>
                      <button onClick={() => handleDelete(user._id)}>
                        <img
                          src="/icons/delete-icon.svg"
                          alt="Delete"
                          width={15}
                          height={15}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center mt-6 gap-4 items-center">
        <button
          onClick={() => fetchUsers(currentPage + 1, searchQuery)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => fetchUsers(currentPage + 1, searchQuery)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserRowDisplay;
