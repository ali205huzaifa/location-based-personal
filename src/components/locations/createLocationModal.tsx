import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { City, Country, ModalMode } from "../../types/user";
import locationAPI from "../../api/locationApi/locationAPI";

const MySwal = withReactContent(Swal);

type BaseProps = {
  open: boolean;
  mode: ModalMode;
  onClose: () => void;
  onSuccess: () => void;
};

type CountryModalProps = BaseProps & {
  type: "country";
  initial?: Partial<Country> & { id?: string };
};

type CityModalProps = BaseProps & {
  type: "city";
  countries: Country[];
  initial?: Partial<City> & { id?: string };
};

export type CreateLocationModalProps = CountryModalProps | CityModalProps;

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";

export default function CreateLocationModal(props: CreateLocationModalProps) {
  const { open, onClose, onSuccess, mode } = props;

  const [countryName, setCountryName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityCountryId, setCityCountryId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (props.type === "country") {
      setCountryName(props.initial?.name || "");
      setCountryCode(props.initial?.code || "");
    } else {
      setCityName(props.initial?.name || "");
      setCityCountryId(
        typeof props.initial?.countryId === "string"
          ? props.initial.countryId
          : props.initial?.countryId?._id || ""
      );
    }
  }, [open]);

  const title = useMemo(() => {
    const noun = props.type === "country" ? "Country" : "City";
    const verb = mode === "create" ? "Add" : "Edit";
    return `${verb} ${noun}`;
  }, [props.type, mode]);

  if (!open) return null;

  const submit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (props.type === "country") {
        if (!countryName.trim() || !countryCode.trim()) {
          await MySwal.fire({
            icon: "warning",
            text: "Country name and code are required.",
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          return;
        }
        if (mode === "create") {
          await locationAPI.CreateCountry({
            name: countryName.trim(),
            code: countryCode.trim(),
          });
        } else {
          await locationAPI.UpdateCountry(String(props.initial?._id), {
            name: countryName.trim(),
            code: countryCode.trim(),
          });
        }
      } else {
        if (!cityName.trim() || !cityCountryId) {
          await MySwal.fire({
            icon: "warning",
            text: "City name and country are required.",
            toast: true,
            position: "top-right",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          return;
        }
        if (mode === "create") {
          await locationAPI.CreateCity({
            name: cityName.trim(),
            countryId: cityCountryId,
          });
        } else {
          await locationAPI.UpdateCity(String(props.initial?._id), {
            name: cityName.trim(),
            countryId: cityCountryId,
          });
        }
      }

      MySwal.fire({
        icon: "success",
        title: "Saved",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      onClose();
      onSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      await MySwal.fire({
        icon: "error",
        title: "Error",
        text: message?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img
              src="/icons/cross-icon.svg"
              alt="Close modal"
              width={15}
              height={15}
            />
          </button>
        </div>

        {props.type === "country" ? (
          <div className="space-y-4">
            <div>
              <input
                value={countryName}
                onChange={(e) => setCountryName(e.target.value)}
                className={inputClass}
                placeholder="Country Name"
              />
            </div>
            <div>
              <input
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className={inputClass}
                placeholder="Country Code"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <select
                value={cityCountryId}
                onChange={(e) => setCityCountryId(e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  Select Country
                </option>
                {props.countries.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <input
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className={inputClass}
                placeholder="City Name"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-start gap-2">
          <button
            onClick={submit}
            disabled={loading}
            className={`rounded-md px-10 py-2 text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#16968F] hover:bg-emerald-700"
            }`}
          >
            {loading
              ? mode === "create"
                ? "Adding..."
                : "Updating..."
              : mode === "create"
              ? "Add"
              : "Update"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 px-8 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
