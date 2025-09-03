import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import type { Filters } from "../../types/user";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const departments = [
  { value: "MOBILE_APP_DEVELOPMENT", label: "Mobile Development" },
  { value: "HUMAN_RESOURCE", label: "Human Resource" },
  { value: "WEB_DEVELOPMENT", label: "Web Development" },
  { value: "MARKETING", label: "Marketing" },
  { value: "ARTIFICIAL_INTELLIGENCE", label: "Artificial Intelligence" },
  { value: "BUSINESS_DEVELOPMENT", label: "Business Development" },
  { value: "UI/UX", label: "UI/UX Designer" },
  { value: "GAME_DEVELOPMENT", label: "Game Development" },
];

const locationOptions = [{ value: "Islamabad", label: "Islamabad" }];

const jobTypeOptions = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const experienceOptions = [
  { value: "0", label: "No Experience" },
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
];

interface JobFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export default function JobFilters({ filters, setFilters }: JobFiltersProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateModalRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (item: { selection: any }) => {
    setFilters((prev) => ({
      ...prev,
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
    }));
  };

  const handleReset = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setFilters({
      department: "All departments",
      location: "All locations",
      jobType: "Job Type",
      experienceLevel: "Job Experience",
      status: "Job Status",
      startDate,
      endDate,
    });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dateModalRef.current &&
        !dateModalRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl flex items-center md:gap-2 lg:gap-4 xl:gap-10 mt-6 flex-wrap">
      <div className="relative">
        <div
          className="flex items-center gap-2 text-sm cursor-pointer"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <img
            src="/icons/calender-icon.svg"
            alt="Calendar"
            width={24}
            height={24}
          />
          <span>
            {filters.startDate ? format(filters.startDate, "dd MMM") : "Start"}{" "}
            - {filters.endDate ? format(filters.endDate, "dd MMM") : "End"}
          </span>
        </div>

        {showDatePicker && (
          <div ref={dateModalRef} className="absolute z-50 mt-2">
            <DateRange
              editableDateInputs={true}
              onChange={handleDateChange}
              moveRangeOnFirstSelection={false}
              ranges={[
                {
                  startDate: filters.startDate || new Date(),
                  endDate: filters.endDate || new Date(),
                  key: "selection",
                },
              ]}
              rangeColors={["#16968F"]}
            />
          </div>
        )}
      </div>

      <Listbox
        value={filters.department}
        onChange={(val) => setFilters((prev) => ({ ...prev, department: val }))}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer bg-white py-2 pl-4 pr-10 text-left focus:outline-none text-zinc-900 text-base font-normal leading-relaxed">
            <span>
              {departments.find((d) => d.value === filters.department)?.label ||
                "All Departments"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">
            {departments.map((d) => (
              <Listbox.Option
                key={d.value}
                value={d.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 rounded-lg ${
                    active ? "bg-teal-100 text-teal-700" : "text-gray-700"
                  }`
                }
              >
                {d.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <Listbox
        value={filters.location}
        onChange={(val) => setFilters((prev) => ({ ...prev, location: val }))}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer bg-white py-2 pl-4 pr-10 text-left focus:outline-none text-zinc-900 text-base font-normal leading-relaxed">
            <span>
              {locationOptions.find((d) => d.value === filters.location)
                ?.label || "All Locations"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">
            {locationOptions.map((d) => (
              <Listbox.Option
                key={d.value}
                value={d.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 rounded-lg ${
                    active ? "bg-teal-100 text-teal-700" : "text-gray-700"
                  }`
                }
              >
                {d.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <Listbox
        value={filters.jobType}
        onChange={(val) => setFilters((prev) => ({ ...prev, jobType: val }))}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer bg-white py-2 pl-4 pr-10 text-left focus:outline-none text-zinc-900 text-base font-normal leading-relaxed">
            <span>
              {jobTypeOptions.find((d) => d.value === filters.jobType)?.label ||
                " Job Type"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">
            {jobTypeOptions.map((d) => (
              <Listbox.Option
                key={d.value}
                value={d.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 rounded-lg ${
                    active ? "bg-teal-100 text-teal-700" : "text-gray-700"
                  }`
                }
              >
                {d.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      <Listbox
        value={filters.experienceLevel}
        onChange={(val) =>
          setFilters((prev) => ({ ...prev, experienceLevel: val }))
        }
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer bg-white py-2 pl-4 pr-10 text-left focus:outline-none text-zinc-900 text-base font-normal leading-relaxed">
            <span>
              {experienceOptions.find(
                (d) => d.value === filters.experienceLevel
              )?.label || "Job Experience"}
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-2 w-full max-h-60 overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">
            {experienceOptions.map((d) => (
              <Listbox.Option
                key={d.value}
                value={d.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 rounded-lg ${
                    active ? "bg-teal-100 text-teal-700" : "text-gray-700"
                  }`
                }
              >
                {d.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {/*
      <select
        value={filters.status}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, status: e.target.value }))
        }
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option value="">Job Status</option>
        <option value="Active">Active</option>
        <option value="InActive">Archived</option>
      </select>
    */}

      <button
        onClick={handleReset}
        className="font-Regular ml-auto items-center gap-2 bg-[#D9D9D9] text-[#000000] px-4 py-2 rounded-xl cursor-pointer"
      >
        Clear Filters
      </button>
    </div>
  );
}
