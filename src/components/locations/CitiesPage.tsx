import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import debounce from "lodash/debounce";
import ClipLoader from "react-spinners/ClipLoader";
import CreateLocationModal from "./createLocationModal";
import type { City, Country } from "../../types/user";
import locationAPI from "../../api/locationApi/locationAPI";
import { CityRow } from "./locationsRowDisplay";

const MySwal = withReactContent(Swal);

export default function CitiesPage() {
  const [items, setItems] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [openModal, setOpenModal] = useState<
    false | { mode: "create" } | { mode: "edit"; item: City }
  >(false);

  const debouncedSearch = useCallback(
    debounce((val: string) => {
      setQuery(val);
      setPage(1);
    }, 1000),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [cRes, ciRes] = await Promise.all([
        locationAPI.getAllCountries(),
        locationAPI.getAllCities({ page, limit, search: query }),
      ]);

      const cs: Country[] = Array.isArray(cRes.data?.data)
        ? cRes.data.data
        : [];

      const rawCities: any[] = Array.isArray(ciRes.data?.data)
        ? ciRes.data.data
        : [];

      const cities: City[] = rawCities.map((x) => ({
        ...x,
        country: x.countryId,
      }));

      setCountries(cs);
      setItems(cities);
      setTotal(ciRes.data?.total || 0);
    } catch (err: any) {
      await MySwal.fire({
        icon: "error",
        title: "Failed to load cities",
        text: err?.message || "",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [page, query]);

  const handleDelete = async (id: string) => {
    const c = await MySwal.fire({
      icon: "warning",
      title: "Delete city?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#e11d48",
    });
    if (!c.isConfirmed) return;
    try {
      await locationAPI.DeleteCity(id);
      MySwal.fire({
        icon: "success",
        title: "Deleted",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      fetchAll();
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
          className="flex items-center gap-2 bg-[#16968F] text-white px-10 py-3 rounded-lg hover:bg-emerald-700 cursor-pointer"
        >
          <img
            src="/icons/route-location-icon.svg"
            alt="Logo"
            width={12}
            height={12}
          />{" "}
          Add City
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
            placeholder="Search city"
            className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-4"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-semibold">City</th>
              <th className="px-4 py-3 font-semibold">Country</th>
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
                  No cities found
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <CityRow
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

      <div className="flex justify-center items-center mt-6 gap-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {page} of {Math.ceil(total / limit) || 1}
        </span>

        <button
          disabled={page * limit >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      {openModal && (
        <CreateLocationModal
          type="city"
          countries={countries}
          open={!!openModal}
          mode={openModal.mode}
          initial={openModal.mode === "edit" ? openModal.item : undefined}
          onClose={() => setOpenModal(false)}
          onSuccess={fetchAll}
        />
      )}
    </div>
  );
}
