import InterviewerCreate from "./InterviewerCreate";
import InterviewerRowDisplay from "./InterviewerRowDisplay";

export default function InterviewerView() {
  return (
    <div className="">
      <div className="px-6">
        <InterviewerCreate />

        <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
          <span className="font-Regular text-[20.38px]">
            Showing all Interviewers{" "}
            <span className="text-[11.91px]">- 3 Results</span>
          </span>
        </div>

        <InterviewerRowDisplay />
      </div>
    </div>
  );
}
