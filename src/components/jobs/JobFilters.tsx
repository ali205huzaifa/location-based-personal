import { useState, useRef } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function JobFilters() {
  const [department, setDepartment] = useState("All departments");
  const [location, setLocation] = useState("All locations");
  const [jobType, setJobType] = useState("Job Type");
  const [experience, setExperience] = useState("Job Experience");
  const [status, setStatus] = useState("Job Status");

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
  const datePickerRef = useRef(null);

  const handleReset = () => {
    const { startDate, endDate } = getStartAndEndOfCurrentMonth();
    setDateRange([
      {
        startDate,
        endDate,
        key: "selection",
      },
    ]);
    setDepartment("All departments");
    setLocation("All locations");
    setJobType("Job Type");
    setExperience("Job Experience");
    setStatus("Job Status");
  };

  return (
    <div className="bg-white border border-gray-200 px-6 py-4 rounded-xl flex items-center md:gap-2 lg:gap-4 xl:gap-10 mt-6 flex-wrap">
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
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option>All departments</option>
        <option>App Development</option>
        <option>Marketing</option>
      </select>

      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option>All locations</option>
        <option>Islamabad</option>
        <option>Lahore</option>
      </select>

      <select
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option>Job Type</option>
        <option>Full Time</option>
        <option>Part Time</option>
      </select>

      <select
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option>Job Experience</option>
        <option>0-1 years</option>
        <option>2-4 years</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="font-Regular text-sm border-none outline-none bg-transparent cursor-pointer"
      >
        <option>Job Status</option>
        <option>Active</option>
        <option>Archived</option>
      </select>

      <button
        onClick={handleReset}
        className="font-Regular ml-auto items-center gap-2 bg-[#16968F] text-white px-4 py-2 rounded-xl hover:bg-emerald-700 cursor-pointer"
      >
        Reset Filter
      </button>
    </div>
  );
}
