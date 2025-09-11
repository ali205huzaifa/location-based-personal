import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import debounce from "lodash/debounce";
import ClipLoader from "react-spinners/ClipLoader";

import CreateDeptSkillModal from "./createdept";
import { DeptRow } from "./deptRowDisplay";
import { type Department } from "../../types/user";
import deptSkillsAPI from "../../api/deptSkillsApi/deptSkillsAPI";

const MySwal = withReactContent(Swal);

export default function DepartmentsPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState<
    false | { mode: "create" } | { mode: "edit"; item: Department }
  >(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAll = async (pageNumber = 1, search = query) => {
    try {
      setLoading(true);
      const res = await deptSkillsAPI.getAlldept({
        page: pageNumber,
        limit,
        search: search || undefined,
      });

      const list: Department[] = res.data?.data || [];
      const totalItems: number = res.data?.totalItems ?? list.length;

      setItems(Array.isArray(list) ? list : []);
      setTotalPages(Math.max(1, Math.ceil(totalItems / limit)));
      setPage(pageNumber);
    } catch (err: any) {
      await MySwal.fire({
        icon: "error",
        title: "Failed to load departments",
        text: err?.message || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      fetchAll(1, val);
    }, 1000),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  useEffect(() => {
    fetchAll(1);
  }, []);

  const handleDelete = async (id: string) => {
    const c = await MySwal.fire({
      icon: "warning",
      title: "Delete department?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e11d48",
    });
    if (!c.isConfirmed) return;

    try {
      await deptSkillsAPI.Deletedept(id);
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      fetchAll(page, query);
    } catch (err: any) {
      await MySwal.fire({
        icon: "error",
        title: "Error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        text: err?.response?.data?.message || err?.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          onClick={() => setOpenModal({ mode: "create" })}
          className="flex items-center gap-2 bg-[#16968F] text-white px-6 py-3 rounded-lg hover:bg-emerald-700 cursor-pointer"
        >
          Add Department
        </button>

        <div className="relative flex-1">
          <img
            src="/icons/search-icon.svg"
            alt="Search Icon"
            width={16}
            height={16}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search Department"
            className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-4"
            value={query}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="max-w-[200px] px-4 py-3 text-zinc-500 text-base font-normal leading-loose">
                Department
              </th>
              <th className="px-4 py-3 text-zinc-500 text-base font-normal leading-loose">
                Description
              </th>
              <th className="px-4 py-3 w-24" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center">
                  <ClipLoader size={35} color="#16968F" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-red-500">
                  No departments found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <DeptRow
                  key={item._id}
                  item={item}
                  onEdit={() => setOpenModal({ mode: "edit", item })}
                  onDelete={() => handleDelete(item._id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center py-4 gap-6">
        <button
          onClick={() => fetchAll(page - 1, query)}
          disabled={page <= 1}
          className={`px-4 py-2 rounded-md ${
            page <= 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#16968F] text-white hover:bg-emerald-700"
          }`}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => fetchAll(page + 1, query)}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded-md ${
            page >= totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#16968F] text-white hover:bg-emerald-700"
          }`}
        >
          Next
        </button>
      </div>
      {openModal && (
        <CreateDeptSkillModal
          type="department"
          open={!!openModal}
          mode={openModal.mode}
          initial={openModal.mode === "edit" ? openModal.item : undefined}
          onClose={() => setOpenModal(false)}
          onSuccess={() => fetchAll(page, query)}
        />
      )}
    </div>
  );
}
