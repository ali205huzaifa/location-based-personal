import { useSelector } from "react-redux";
import DashboardStats from "./DashboardStats";
import NotesSection from "./NotesSection";
import type { RootState } from "../../store";
import ScheduleCard from "./Scheduler";

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  if (!currentUser) return null;

  return (
    <div className="p-6 w-full flex gap-6">
      <div className="flex-1 max-w-[600px] space-y-6">
        <DashboardStats />
        <NotesSection userId={currentUser._id} />
      </div>

      <div className="w-[450px]">
        <ScheduleCard />
      </div>
    </div>
  );
}
