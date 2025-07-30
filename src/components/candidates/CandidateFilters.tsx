import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function CandidateFilters() {
  const [jobType, setJobType] = useState("All Jobs");
  const [location, setLocation] = useState("By Location");
  const [gender, setGender] = useState("Male");

  const getStartAndEndOfCurrentMonth = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate, endDate };
  };

  const initialDates = getStartAndEndOfCurrentMonth();

  const [dateRange, setDateRange] = useState([
    {
      startDate: initialDates.startDate,
      endDate: initialDates.endDate,
      key: "selection",
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const salaryMin = 0;
  const salaryMax = 200000;
  const [minSalary, setMinSalary] = useState(20000);
  const [maxSalary, setMaxSalary] = useState(130000);

  const handleReset = () => {
    const { startDate, endDate } = getStartAndEndOfCurrentMonth();
    setDateRange([
      {
        startDate,
        endDate,
        key: "selection",
      },
    ]);
    setJobType("All Jobs");
    setLocation("By Location");
    setGender("Male");
    setMinSalary(20000);
    setMaxSalary(130000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white mt-4 relative">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-20"></div>

          <div className="relative flex-1">
            {" "}
            <img
              src="/icons/search-icon.svg"
              alt="Search Icon"
              width={20}
              height={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />{" "}
            <input
              type="text"
              placeholder="start typing to search Candidates"
              className="w-full border border-gray-300 rounded-md py-3 pl-14 pr-4"
            />{" "}
          </div>
        </div>
      </div>

      <div className="relative bg-white border border-gray-200 px-4 py-3 rounded-xl flex items-center flex-wrap md:gap-2 lg:gap-2 xl:gap-10 mt-6">
        <div className="relative" ref={datePickerRef}>
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
              {format(dateRange[0].startDate, "dd MMM")} -{" "}
              {format(dateRange[0].endDate, "dd MMM")}
            </span>
          </div>

          {showDatePicker && (
            <div className="absolute z-50 mt-2">
              <DateRange
                editableDateInputs={true}
                onChange={(item: { selection: (typeof dateRange)[0] }) =>
                  setDateRange([item.selection])
                }
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                rangeColors={["#16968F"]}
              />
            </div>
          )}
        </div>

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="text-sm bg-transparent border-none outline-none cursor-pointer"
        >
          <option>All Jobs</option>
          <option>Full Time</option>
          <option>Part Time</option>
          <option>Contract</option>
        </select>

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="text-sm bg-transparent border-none outline-none cursor-pointer"
        >
          <option>By Location</option>
          <option>Lahore</option>
          <option>Islamabad</option>
          <option>Remote</option>
        </select>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="text-sm bg-transparent border-none outline-none cursor-pointer"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <span className="text-sm whitespace-nowrap">Current Salary</span>

          <div className="relative w-[250px] sm:w-[300px] h-6 mt-2">
            <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-300 rounded" />

            <div
              className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-teal-600 rounded"
              style={{
                left: `${
                  ((minSalary - salaryMin) / (salaryMax - salaryMin)) * 100
                }%`,
                width: `${
                  ((maxSalary - minSalary) / (salaryMax - salaryMin)) * 100
                }%`,
              }}
            />

            <input
              type="range"
              min={salaryMin}
              max={salaryMax}
              step={1000}
              value={minSalary}
              onChange={(e) =>
                setMinSalary(Math.min(Number(e.target.value), maxSalary - 1000))
              }
              className="absolute w-full h-1 bg-transparent appearance-none"
            />

            <input
              type="range"
              min={salaryMin}
              max={salaryMax}
              step={1000}
              value={maxSalary}
              onChange={(e) =>
                setMaxSalary(Math.max(Number(e.target.value), minSalary + 1000))
              }
              className="absolute w-full h-1 bg-transparent appearance-none"
            />

            <div className="flex justify-between text-xs text-teal-600 mt-4">
              <span>{minSalary.toLocaleString()}</span>
              <span>{maxSalary.toLocaleString()}</span>
            </div>
          </div>

          <span className="text-sm whitespace-nowrap">Expected Salary</span>
        </div>

        <button
          onClick={handleReset}
          className="font-Regular ml-auto items-center gap-2 bg-[#16968F] text-white px-4 py-2 rounded-xl hover:bg-emerald-700 cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    </>
  );
}
