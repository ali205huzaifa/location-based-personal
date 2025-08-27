import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CandidateFilterListbox from "./CandidateFiltersListbox";
import CandidatesAPI from "../../api/candidatesApi/CandidateAPI";

interface CandidateFiltersProps {
  candidateName: string;
  setcandidateName: (val: string) => void;

  jobTitle: string;
  setJobTitle: (val: string) => void;

  candidateLocation: string;
  setCandidateLocation: (val: string) => void;

  candidateGender: string;
  setCandidateGender: (val: string) => void;

  currentSalary: number;
  expectedSalary: number;
  setCurrentSalary: (val: number) => void;
  setExpectedSalary: (val: number) => void;

  startDate: Date;
  endDate: Date;
  setStartDate: (val: Date) => void;
  setEndDate: (val: Date) => void;

  onReset: () => void;
}

export default function CandidateFilters({
  candidateName,
  setcandidateName,
  jobTitle,
  setJobTitle,
  candidateLocation,
  setCandidateLocation,
  candidateGender,
  setCandidateGender,
  currentSalary,
  expectedSalary,
  setCurrentSalary,
  setExpectedSalary,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onReset,
}: CandidateFiltersProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [titles, setTitles] = useState<{ value: string; label: string }[]>([]);

  const salaryMin = 0;
  const salaryMax = 200000;

  useEffect(() => {
    async function fetchTitles() {
      try {
        const { data } = await CandidatesAPI.fetchTitles();
        if (Array.isArray(data)) {
          setTitles(
            data.map((title: string) => ({
              value: title,
              label: title,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching titles:", err);
      }
    }
    fetchTitles();
  }, []);

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
        <div className="flex flex-wrap items-center gap-2 mb-4">
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
              value={candidateName}
              onChange={(e) => setcandidateName(e.target.value)}
              placeholder="Start typing to search Candidates By their Name"
              className="w-full border border-gray-300 rounded-md py-3 pl-14 pr-4"
            />
          </div>
        </div>
      </div>

      <div className="relative bg-white border border-gray-200 px-4 py-3 rounded-xl flex items-center flex-wrap md:gap-2 lg:gap-2 xl:gap-2 mt-6">
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
              {format(startDate, "dd MMM")} - {format(endDate, "dd MMM")}
            </span>
          </div>

          {showDatePicker && (
            <div className="absolute z-50 mt-2">
              <DateRange
                ranges={[
                  {
                    startDate,
                    endDate,
                    key: "selection",
                  },
                ]}
                rangeColors={["#16968F"]}
                onChange={(item: {
                  selection: { startDate: Date; endDate: Date };
                }) => {
                  setStartDate(item.selection.startDate);
                  setEndDate(item.selection.endDate);
                }}
              />
            </div>
          )}
        </div>

        <CandidateFilterListbox
          value={jobTitle}
          onChange={setJobTitle}
          options={titles}
          placeholder="Select Job Title"
        />

        <CandidateFilterListbox
          value={candidateLocation}
          onChange={setCandidateLocation}
          options={[
            { value: "Islamabad", label: "Islamabad" },
            { value: "Rawalpindi", label: "Rawalpindi" },
            { value: "Lahore", label: "Lahore" },
          ]}
          placeholder="Select Location"
        />

        <CandidateFilterListbox
          value={candidateGender}
          onChange={setCandidateGender}
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
            { value: "OTHER", label: "Other" },
          ]}
          placeholder="Select Gender"
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <span className="text-sm whitespace-nowrap">Current Salary</span>

          <div className="relative w-[150px] sm:w-[200px] mt-2">
            <div className="flex justify-between text-sm text-gray-700 mb-1 px-1">
              <span>{currentSalary.toLocaleString()}</span>
              <span>{expectedSalary.toLocaleString()}</span>
            </div>

            <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-300 rounded" />

            <div
              className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-teal-600 rounded"
              style={{
                left: `${
                  ((currentSalary - salaryMin) / (salaryMax - salaryMin)) * 100
                }%`,
                width: `${
                  ((expectedSalary - currentSalary) / (salaryMax - salaryMin)) *
                  100
                }%`,
              }}
            />

            <input
              type="range"
              step={1000}
              min={salaryMin}
              max={salaryMax}
              value={currentSalary}
              onChange={(e) =>
                setCurrentSalary(
                  Math.min(Number(e.target.value), expectedSalary - 1000)
                )
              }
              className="absolute w-full pointer-events-auto z-10"
            />
            <input
              type="range"
              step={1000}
              min={salaryMin}
              max={salaryMax}
              value={expectedSalary}
              onChange={(e) =>
                setExpectedSalary(
                  Math.max(Number(e.target.value), currentSalary + 1000)
                )
              }
              className="absolute w-full pointer-events-auto z-10"
            />

            <div className="flex justify-between text-xs text-teal-600 mt-8">
              <span>{salaryMin.toLocaleString()}</span>
              <span>{salaryMax.toLocaleString()}</span>
            </div>
          </div>

          <span className="text-sm whitespace-nowrap">Expected Salary</span>
        </div>

        <button
          onClick={onReset}
          className="font-Regular ml-auto items-center bg-[#16968F] text-white px-4 py-2 rounded-xl hover:bg-emerald-700 cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    </>
  );
}
