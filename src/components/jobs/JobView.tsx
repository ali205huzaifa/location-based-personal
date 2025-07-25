import { useState } from "react";
import JobCreate from "./JobCreate";
import JobFilters from "./JobFilters";
import JobRowDisplay from "./JobRowDisplay";
import JobGridDisplay from "./JobGridDisplay";

export default function JobsView() {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <div className="px-6">
      <JobCreate />
      <JobFilters />

      <div className="bg-black text-white/80 px-4 py-5 flex items-center justify-between rounded-t-lg mt-4">
        <span className="font-Regular text-[20.38px]">
          Showing all Jobs <span className="text-[11.91px]">- 3 Results</span>
        </span>

        <div className="flex items-center gap-4">
          <span className="font-Regular text-[11.91px]">
            {view === "list" ? "Showing List view" : "Showing Card view"}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`cursor-pointer p-1.5 rounded ${
                view === "list"
                  ? "bg-[#202020] text-black"
                  : "bg-transparent text-white"
              }`}
            >
              <img
                src="/icons/List-icon.svg"
                alt="List"
                width={20}
                height={20}
              />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`cursor-pointer p-1.5 rounded ${
                view === "grid"
                  ? "bg-[#202020] text-black"
                  : "bg-transparent text-white"
              }`}
            >
              <img
                src="/icons/grid-icon.svg"
                alt="Grid"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </div>

      {view === "list" ? <JobRowDisplay /> : <JobGridDisplay />}
    </div>
  );
}
