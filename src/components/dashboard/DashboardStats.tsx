import { useEffect, useState } from "react";
import NoteAPI from "../../api/notesApi/NotesAPI";

const iconMap = {
  shortlisted: "/icons/sc-icon.svg",
  interviewScheduled: "/icons/is-icon.svg",
  hired: "/icons/ch-icon.svg",
  applied: "/icons/jp-icon.svg",
};

const DashboardStats = () => {
  const [stats, setStats] = useState({
    shortlisted: 0,
    interviewScheduled: 0,
    hired: 0,
    applied: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await NoteAPI.getAllStats();
        setStats(data || {});
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statData = [
    {
      label: "Shortlisted Candidates",
      count: stats.shortlisted || 0,
      icon: iconMap.shortlisted,
    },
    {
      label: "Interviews Scheduled",
      count: stats.interviewScheduled || 0,
      icon: iconMap.interviewScheduled,
    },
    {
      label: "Candidates Hired",
      count: stats.hired || 0,
      icon: iconMap.hired,
    },
    {
      label: "Job Applications",
      count: stats.applied || 0,
      icon: iconMap.applied,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {statData.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center justify-between py-3 bg-white border rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <div className="bg-[#F5F6FA] p-2 rounded-md">
              <img src={stat.icon} alt={stat.label} className="w-6 h-6" />
            </div>
            <p className="text-[#16151C] text-[19.5px]">{stat.label}</p>
          </div>
          <p className="text-[#16151C] text-[32.01px]">{stat.count}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
