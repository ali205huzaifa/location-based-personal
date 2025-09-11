import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import RolesCreate from "./RolesCreate";
import RoleAPI from "../../api/roleApi/roleAPI";
import ClipLoader from "react-spinners/ClipLoader";
import RolesBlockDisplay from "./RolesBlockDisplay";
import debounce from "lodash/debounce";
import UsersAPI from "../../api/manage-userApi/UserAPI";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const RolesView = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 10;

  const fetchRoles = async (page = 1, query = "") => {
    setIsLoading(true);
    try {
      const res = await RoleAPI.getAll({ page, limit, search: query });
      const formattedRoles = res.data.data.map((role: any) => ({
        id: role._id,
        name: role.name,
        permissions: role.permissions || [],
      }));
      setRoles(formattedRoles);
      setCurrentPage(page);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      Swal.fire("Error", "Failed to load roles", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useMemo(
    () =>
      debounce((query: string) => {
        fetchRoles(1, query);
      }, 1000),
    []
  );

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      debouncedFetch(searchQuery);
    } else {
      fetchRoles(1, "");
    }

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchQuery]);

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchRoles(currentPage + 1, searchQuery);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) fetchRoles(currentPage - 1, searchQuery);
  };

  const handleEdit = (id: string) => {
    const role = roles.find((r) => r.id === id);
    if (role) {
      setEditingRole(role);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#16968F",
      cancelButtonColor: "#d33",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await RoleAPI.DeleteRole(id);

      await fetchRoles(currentPage, searchQuery);
      Swal.fire({
        text: "Role has been deleted!",
        icon: "success",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      const apiError = err?.response?.data?.error;

      if (apiError && apiError.includes("Role is assigned to users")) {
        try {
          const usersRes = await UsersAPI.getUsersByRole(id);
          const assignedUsers = usersRes.data?.data || [];

          const userListHTML = assignedUsers.length
            ? `<ul style="text-align:left;">
               ${assignedUsers.map((u: any) => `<li>• ${u.name}</li>`).join("")}
             </ul>`
            : "<p>No user names found, but role is assigned.</p>";

          const confirmForceDelete = await Swal.fire({
            title: "Role is assigned to users",
            html: `
            <p>The following users are assigned to this role:</p>
            ${userListHTML}
            <p>Do you want to delete the role and these users?</p>
          `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete all",
            confirmButtonColor: "#16968F",
            cancelButtonColor: "#d33",
            width: 500,
          });

          if (confirmForceDelete.isConfirmed) {
            await RoleAPI.ForceDeleteRole(id);
            await fetchRoles(currentPage, searchQuery);

            Swal.fire({
              text: "Role and assigned users have been deleted.",
              icon: "success",
              toast: true,
              position: "top-right",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          }
        } catch (fetchErr) {
          Swal.fire({
            text: "Failed to fetch assigned users.",
            icon: "error",
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      } else {
        Swal.fire({
          text: "Failed to delete role",
          icon: "error",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const handleAddNew = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSuccess = () => {
    fetchRoles(currentPage, searchQuery);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          className="flex items-center gap-2 bg-[#16968F] px-10 py-3 rounded-xl hover:bg-emerald-700 cursor-pointer text-white text-base font-normal"
          onClick={handleAddNew}
        >
          Add New Role
        </button>

        <div className="relative flex-1">
          <img
            src="/icons/search-icon.svg"
            alt="Search Icon"
            width={20}
            height={20}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search Roles by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-3 pl-14 pr-4"
          />
        </div>
      </div>

      <RolesCreate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editingRole={editingRole}
      />

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <ClipLoader size={50} color="#16968F" />
        </div>
      ) : (
        <RolesBlockDisplay
          roles={roles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {totalPages >= 1 && (
        <div className="flex justify-center mt-6 gap-4 items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RolesView;
