import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import type { Filters } from "../../types/user";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

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
            width={16}
            height={16}
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

      <select
        value={filters.department}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, department: e.target.value }))
        }
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option value="">Select Department</option>
        <option value="MOBILE_APP_DEVELOPMENT">Mobile Development</option>
        <option value="HUMAN_RESOURCE">Human Resource</option>
        <option value="WEB_DEVELOPMENT">Web Development</option>
        <option value="MARKETING">Marketing</option>
        <option value="ARTIFICIAL_INTELLIGENCE">Artificial Intelligence</option>
        <option value="BUSINESS_DEVELOPMENT">Business Development</option>
        <option value="UI/UX">UI/UX</option>
        <option value="GAME_DEVELOPMENT">Game Development</option>
      </select>

      <select
        value={filters.location}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, location: e.target.value }))
        }
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option value="">All locations</option>
        <option value="Islamabad">Islamabad</option>
      </select>

      <select
        value={filters.jobType}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, jobType: e.target.value }))
        }
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option value="">All Job Type</option>
        <option value="FULL_TIME">Full Time</option>
        <option value="PART_TIME">Part Time</option>
        <option value="CONTRACT">Contract</option>
        <option value="INTERNSHIP">Internship</option>
      </select>

      <select
        value={filters.experienceLevel}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            experienceLevel: e.target.value,
          }))
        }
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option>Job Experience</option>
        <option value="0">No Experience</option>
        <option value="0-1">0-1 years</option>
        <option value="1-3">1-3 years</option>
        <option value="3-5">3-5 years</option>
      </select>

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
        className="font-Regular ml-auto items-center gap-2 bg-[#16968F] text-white px-4 py-2 rounded-xl hover:bg-emerald-700 cursor-pointer"
      >
        Reset Filter
      </button>
    </div>
  );
}
