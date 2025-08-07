import { useSelector } from "react-redux";
import DashboardStats from "./DashboardStats";
import NotesSection from "./NotesSection";
import type { RootState } from "../../store";

export default function Dashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  if (!currentUser) return null;

  return (
    <div className="p-6 w-full max-w-[600px] space-y-6">
      <DashboardStats />
      <NotesSection userId={currentUser._id} />
    </div>
  );
}
