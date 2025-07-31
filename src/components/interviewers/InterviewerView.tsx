import { useEffect, useState } from "react";
import InterviewerCreate from "./InterviewerCreate";
import InterviewerRowDisplay from "./InterviewerRowDisplay";
import type { Interviewer } from "../../types/user";
import InterviewerAPI from "../../api/interviewersApi/InterviewersAPI";

export default function InterviewerView() {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [editData, setEditData] = useState<Interviewer | null>(null);

  const fetchInterviewers = async () => {
    try {
      const res = await InterviewerAPI.getAll();
      setInterviewers(res.data);
    } catch (err) {
      console.error("Error fetching interviewers:", err);
    }
  };

  useEffect(() => {
    fetchInterviewers();
  }, []);

  return (
    <div className="">
      <div className="px-6">
        <InterviewerCreate
          fetchInterviewers={fetchInterviewers}
          editData={editData}
          setEditData={setEditData}
        />

        <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
          <span className="font-Regular text-[20.38px]">
            Showing all Interviewers{" "}
            <span className="text-[11.91px]">
              - {interviewers.length} Results
            </span>
          </span>
        </div>

        <InterviewerRowDisplay
          data={interviewers}
          onEdit={(interviewer) => setEditData(interviewer)}
          fetchInterviewers={fetchInterviewers}
        />
      </div>
    </div>
  );
}
