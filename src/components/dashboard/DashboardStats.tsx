import { useEffect, useState } from "react";
import NoteAPI from "../../api/notesApi/NotesAPI";

const iconMap = {
  shortlisted: "/icons/sc-icon.svg",
  interviewScheduled: "/icons/is-icon.svg",
  hired: "/icons/ch-icon.svg",
  applied: "/icons/jp-icon.svg",
  activeJobs: "/icons/jp-icon.svg",
  activeApplications: "/icons/sc-icon.svg",
  totalJobs: "/icons/jp-icon.svg",
  totalApplications: "/icons/sc-icon.svg",
};

const DashboardStats = () => {
  const [stats, setStats] = useState({
    shortlisted: 0,
    interviewScheduled: 0,
    hired: 0,
    rejected: 0,
    activeJobs: 0,
    activeApplications: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await NoteAPI.getAllStats();

        const mappedStats = {
          shortlisted: data.applicationStats?.shortlisted || 0,
          interviewScheduled: data.applicationStats?.interviewScheduled || 0,
          hired: data.applicationStats?.hired || 0,
          rejected: data.applicationStats?.rejected || 0,

          activeJobs: data.totals?.activeJobs || 0,
          activeApplications: data.totals?.applicationsAgainstActiveJobs || 0,
          totalJobs: data.totals?.totalJobs || 0,
          totalApplications: data.totals?.totalApplications || 0,
        };

        setStats(mappedStats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statData = [
    {
      label: "Shortlisted Candidates",
      count: stats.shortlisted,
      icon: iconMap.shortlisted,
    },
    {
      label: "Interviews Scheduled",
      count: stats.interviewScheduled,
      icon: iconMap.interviewScheduled,
    },
    { label: "Candidates Hired", count: stats.hired, icon: iconMap.hired },
    {
      label: "Rejected Applications",
      count: stats.rejected,
      icon: iconMap.applied,
    },
    { label: "Active Jobs", count: stats.activeJobs, icon: iconMap.activeJobs },
    {
      label: "Active Applications",
      count: stats.activeApplications,
      icon: iconMap.activeApplications,
    },
    { label: "Total Jobs", count: stats.totalJobs, icon: iconMap.totalJobs },
    {
      label: "Total Applications",
      count: stats.totalApplications,
      icon: iconMap.totalApplications,
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
