import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CandidateFilterListbox from "./CandidateFiltersListbox";
import CandidatesAPI from "../../api/candidatesApi/CandidateAPI";
import locationAPI from "../../api/locationApi/locationAPI";

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
  const [locations, setLocations] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const response = await locationAPI.getAllCities();
        if (Array.isArray(response.data.data)) {
          setLocations(
            response.data.data.map((city: { _id: string; name: string }) => ({
              value: city.name,
              label: city.name,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    }
    fetchLocations();
  }, []);

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
              width={16}
              height={16}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setcandidateName(e.target.value)}
              placeholder="Search by Name"
              className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-4"
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
              width={24}
              height={24}
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
          placeholder="All Jobs"
        />

        <CandidateFilterListbox
          value={candidateLocation}
          onChange={setCandidateLocation}
          options={locations}
          placeholder="By Location"
        />

        <CandidateFilterListbox
          value={candidateGender}
          onChange={setCandidateGender}
          options={[
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
            { value: "OTHER", label: "Other" },
          ]}
          placeholder="By Gender"
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-8 w-full sm:w-auto">
          <div className="flex flex-col w-[150px]">
            <Typography variant="body1" className="text-zinc-900">
              Current Salary
            </Typography>
            <div className="flex justify-between text-sm text-gray-700"></div>
            <Slider
              value={currentSalary}
              onChange={(_, val) => setCurrentSalary(val as number)}
              min={0}
              max={100000}
              step={1000}
              valueLabelDisplay="auto"
              sx={{
                color: "#0d9488",
                "& .MuiSlider-rail": {
                  opacity: 0.5,
                  backgroundColor: "#d1d5db",
                },
              }}
            />
            <span className="text-sm text-gray-700">
              {currentSalary.toLocaleString()} PKR
            </span>
          </div>

          <div className="flex flex-col w-[150px]">
            <Typography variant="body1" className="text-zinc-900">
              Expected Salary
            </Typography>
            <div className="flex justify-between text-sm text-gray-700"></div>
            <Slider
              value={expectedSalary}
              onChange={(_, val) => setExpectedSalary(val as number)}
              min={100000}
              max={200000}
              step={1000}
              valueLabelDisplay="auto"
              sx={{
                color: "#0d9488",
                "& .MuiSlider-rail": {
                  opacity: 0.5,
                  backgroundColor: "#d1d5db",
                },
              }}
            />
            <span className="text-sm text-gray-700">
              {expectedSalary.toLocaleString()} PKR
            </span>
          </div>
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
