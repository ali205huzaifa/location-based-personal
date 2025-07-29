export default function CandidateSearchBar() {
  return (
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
  );
}
