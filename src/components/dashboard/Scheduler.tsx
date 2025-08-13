import React, { useState, useEffect } from "react";
import SchedularAPI from "../../api/schedularApi/SchedularAPI";
import Swal from "sweetalert2";

interface EventItem {
  id: string;
  time: string;
  role: string;
  task: string;
  editable?: boolean;
  userName?: string;
  userEmail?: string;
  userProfile?: string;
}

interface DaySchedule {
  dateLabel: string;
  events: EventItem[];
}

const ScheduleCard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [days, setDays] = useState<DaySchedule[]>([]);

  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formTagline, setFormTagline] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (date: Date) => {
    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (!endDate) {
      if (date < startDate) {
        setStartDate(date);
        setEndDate(null);
        return;
      }
      setEndDate(date);

      const formattedStart = formatLocalDate(startDate);
      const formattedEnd = formatLocalDate(date);
      fetchSchedules(formattedStart, formattedEnd);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async (start?: string, end?: string) => {
    try {
      let res;
      if (start && end) {
        res = await SchedularAPI.getByDateRange(start, end);
      } else {
        res = await SchedularAPI.getAll();
      }

      const schedulesArray = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      schedulesArray.sort((a: any, b: any) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (dateA !== dateB) {
          return dateA - dateB;
        }

        const parseTime = (timeStr: string) => {
          let [time, meridiem] = timeStr.split(" ");
          let [hours, minutes] = time.split(":").map(Number);
          if (meridiem?.toLowerCase() === "pm" && hours < 12) hours += 12;
          if (meridiem?.toLowerCase() === "am" && hours === 12) hours = 0;
          return hours * 60 + minutes;
        };

        return parseTime(a.time) - parseTime(b.time);
      });

      const grouped: { [dateLabel: string]: EventItem[] } = {};
      schedulesArray.forEach((schedule: any) => {
        const dateLabel = new Date(schedule.date).toLocaleDateString("en-US", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        if (!grouped[dateLabel]) grouped[dateLabel] = [];

        grouped[dateLabel].push({
          id: schedule._id,
          time: schedule.time,
          role: schedule.title,
          task: schedule.shortDescription,
          editable: true,
          userName: schedule.userId?.name,
          userEmail: schedule.userId?.email,
          userProfile: schedule.userId?.profilePicture,
        });
      });

      const formatted: DaySchedule[] = Object.entries(grouped).map(
        ([dateLabel, events]) => ({
          dateLabel,
          events,
        })
      );

      setDays(formatted);
    } catch (error) {
      console.error("Failed to fetch schedules", error);
      Swal.fire({
        icon: "error",
        title: "Error loading schedules",
        text: "Unable to fetch schedules from the server.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleEditClick = async (_id: string) => {
    try {
      const res = await SchedularAPI.GetScheduleById(_id);
      const schedule = res.data;

      const formattedDate = new Date(schedule.date).toISOString().split("T")[0];

      let [timePart, meridiem] = schedule.time.split(" ");
      let [hours, minutes] = timePart.split(":");
      hours = parseInt(hours, 10);

      if (meridiem?.toLowerCase() === "pm" && hours < 12) {
        hours += 12;
      } else if (meridiem?.toLowerCase() === "am" && hours === 12) {
        hours = 0;
      }
      const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}`;

      setFormDate(formattedDate);
      setFormTime(formattedTime);
      setFormTitle(schedule.title);
      setFormTagline(schedule.shortDescription);

      setIsEditing(true);
      setEditId(_id);

      setShowPopup(true);
    } catch (err) {
      console.error("Failed to load schedule", err);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!editId) return;

    const confirmDelete = await Swal.fire({
      icon: "warning",
      title: "Delete Schedule?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await SchedularAPI.deleteSchedule(editId);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Schedule has been deleted.",
        confirmButtonColor: "#16968F",
      });

      setShowPopup(false);
      setEditId(null);
      setIsEditing(false);
      fetchSchedules();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Could not delete the schedule.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleSaveSchedule = async () => {
    if (!formDate || !formTime || !formTitle || !formTagline) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill all fields before saving.",
        confirmButtonColor: "#16968F",
      });
      return;
    }

    const formatTimeTo12Hour = (time24: string) => {
      let [hours, minutes] = time24.split(":");
      let hoursNum = parseInt(hours, 10);
      const ampm = hoursNum >= 12 ? "PM" : "AM";
      hoursNum = hoursNum % 12 || 12;
      return `${hoursNum.toString().padStart(2, "0")}:${minutes}:00 ${ampm}`;
    };

    try {
      if (isEditing && editId) {
        await SchedularAPI.UpdateSchedule(editId, {
          date: formDate,
          time: formatTimeTo12Hour(formTime),
          title: formTitle,
          shortDescription: formTagline,
        });
        Swal.fire({
          icon: "success",
          title: "Schedule updated",
          text: "Your schedule has been updated successfully.",
          confirmButtonColor: "#16968F",
        });
      } else {
        await SchedularAPI.CreateSchedule({
          date: formDate,
          time: formatTimeTo12Hour(formTime),
          title: formTitle,
          shortDescription: formTagline,
        });
        Swal.fire({
          icon: "success",
          title: "Schedule created",
          text: "Your new schedule has been added successfully.",
          confirmButtonColor: "#16968F",
        });
      }

      setShowPopup(false);
      setFormDate("");
      setFormTime("");
      setFormTitle("");
      setFormTagline("");
      setEditId(null);
      setIsEditing(false);

      fetchSchedules();
    } catch (error) {
      console.error("Failed to save schedule", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save the schedule. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const monthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = firstDayOfMonth(year, month);
    const totalDays = daysInMonth(year, month);

    const daysArray: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) daysArray.push(null);
    for (let d = 1; d <= totalDays; d++) daysArray.push(d);

    return daysArray;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4 flex flex-col ml-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg">My Schedule</h3>
        <button onClick={() => setShowPopup(true)}>
          <img src="/icons/plus-icon.svg" alt="add" className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          className="bg-teal-600 text-white p-1 rounded"
          onClick={() => changeMonth(-1)}
        >
          <img src="/icons/right-arrow.svg" alt="prev" className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium">
          {currentMonth.toLocaleString("default", { month: "long" })},{" "}
          {currentMonth.getFullYear()}
        </span>
        <button
          className="bg-teal-600 text-white p-1 rounded"
          onClick={() => changeMonth(1)}
        >
          <img src="/icons/left-arrow.svg" alt="next" className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mt-3 text-sm">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-gray-600 font-medium">
            {d}
          </div>
        ))}
        {monthDays().map((day, idx) =>
          day ? (
            <div
              key={idx}
              onClick={() =>
                handleDateClick(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  )
                )
              }
              className={`cursor-pointer rounded-full px-2 py-1
  ${
    startDate &&
    endDate &&
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) >=
      startDate &&
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) <=
      endDate
      ? "bg-[#16968F] text-white"
      : startDate &&
        !endDate &&
        day === startDate.getDate() &&
        currentMonth.getMonth() === startDate.getMonth()
      ? "bg-[#16968F] text-white"
      : "hover:bg-gray-200"
  }`}
            >
              {day}
            </div>
          ) : (
            <div key={idx}></div>
          )
        )}
      </div>

      <div className="mt-4">
        {days.length === 0 ? (
          <p className="text-gray-500 text-sm">No schedules found.</p>
        ) : (
          days.map((day) => (
            <div key={day.dateLabel} className="mb-4">
              <p className="text-sm font-semibold">{day.dateLabel}</p>
              {day.events.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between py-2 border-b last:border-b-0"
                >
                  <span className="w-14 text-sm font-medium">
                    {formatDisplayTime(event.time)}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{event.role}</p>
                    <p className="text-sm text-teal-600 font-medium">
                      {event.task}
                    </p>
                  </div>
                  {event.editable && (
                    <img
                      src="/icons/edit-icon.svg"
                      alt="edit"
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => handleEditClick(event.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] space-y-6 shadow-lg">
            <div className="flex justify-between items-center border-b pb-2 border-b border-gray-500">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <img
                  src="/icons/schedular-icon.svg"
                  alt="add"
                  className="w-4 h-4"
                />
                {isEditing ? "Edit Schedule" : "Add Schedule"}
              </h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-600 hover:text-red-500 text-xl"
              >
                <img
                  src="/icons/cross-icon.svg"
                  alt="close"
                  className="w-4 h-4"
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium w-[100px]">
                  Select Date:
                </label>
                <input
                  type="date"
                  className="border rounded px-2 py-2 flex-1 border-gray-400"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium w-[100px]">
                  Select Time:
                </label>
                <input
                  type="time"
                  className="border rounded px-2 py-2 flex-1 border-gray-400"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-[100px]">
                Add Title:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-2 flex-1 border-gray-400"
                placeholder="Enter title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium w-[100px]">
                Short Tagline:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-2 flex-1 border-gray-400"
                placeholder="Enter tagline"
                value={formTagline}
                onChange={(e) => setFormTagline(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              {isEditing && (
                <button
                  onClick={handleDeleteSchedule}
                  className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
                >
                  Delete Schedule
                </button>
              )}
              <button
                onClick={handleSaveSchedule}
                className="bg-[#16968F] text-white px-6 py-3 rounded hover:bg-[#127e78]"
              >
                {isEditing ? "Save Changes" : "Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
