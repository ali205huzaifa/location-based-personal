import { useSelector } from "react-redux";
import DashboardStats from "./DashboardStats";
import NotesSection from "./NotesSection";
import type { RootState } from "../../store";
import ScheduleCard from "./Scheduler";

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  if (!currentUser) return null;

  return (
    <div className="px-4 md:p-6 w-full flex flex-col lg:flex-row">
      <div className="lg:w-2/3 mt-4">
        <DashboardStats />
        <NotesSection userId={currentUser._id} />
      </div>

      <div className="lg:w-1/3 px-4">
        <ScheduleCard />
      </div>
    </div>
  );
}
