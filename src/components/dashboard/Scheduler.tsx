import React, { useState, useEffect } from "react";
import SchedularAPI from "../../api/schedularApi/SchedularAPI";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";

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

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const refetchWithFilter = async () => {
    if (startDate && endDate) {
      await fetchSchedules(
        formatLocalDate(startDate),
        formatLocalDate(endDate)
      );
    } else if (startDate) {
      const formatted = formatLocalDate(startDate);
      await fetchSchedules(formatted, formatted);
    } else {
      await fetchSchedules();
    }
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
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  useEffect(() => {
    refetchWithFilter();
  }, [startDate, endDate]);

  const fetchSchedules = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      let res;

      if (start && end) {
        res = await SchedularAPI.getByDateRange(start, end);
      } else {
        const today = new Date().toISOString().split("T")[0];
        res = await SchedularAPI.getAll({
          "startDate[gte]": today,
        });
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
    } finally {
      setLoading(false);
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
      setLoading(true);
      await SchedularAPI.deleteSchedule(editId);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Schedule has been deleted.",
        confirmButtonColor: "#16968F",
      });

      setShowPopup(false);
      resetForm();

      await refetchWithFilter();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Could not delete the schedule.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
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
      setSaving(true);
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

      setLoading(true);
      await refetchWithFilter();
    } catch (error) {
      console.error("Failed to save schedule", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save the schedule. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSaving(false);
      setLoading(false);
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
    const [hmSeconds, ampm] = time.split(" ");

    if (!hmSeconds || !ampm) return time;
    const [hours, minutes] = hmSeconds.split(":");

    return (
      <span>
        {hours}:{minutes}{" "}
        <span className=" text-zinc-900 text-xs font-normal leading-none">
          {ampm}
        </span>
      </span>
    );
  };

  const resetForm = () => {
    setFormDate("");
    setFormTime("");
    setFormTitle("");
    setFormTagline("");
    setEditId(null);
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4 flex flex-col ml-4 border border-[#A2A1A833]">
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-zinc-900 text-xl font-normal leading-7">
          <div>My Schedule</div>
          <div
            className="text-teal-600 text-sm font-normal leading-tight mt-2 cursor-pointer"
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              fetchSchedules();
            }}
          >
            Reset date
          </div>
        </div>
        <div className="w-12 h-12 bg-indigo-500/10 rounded-[9.75px] inline-flex justify-center items-center">
          <button onClick={() => setShowPopup(true)}>
            <img src="/icons/plus-icon.svg" alt="add" className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          className="bg-teal-600 text-white p-2 rounded"
          onClick={() => changeMonth(-1)}
        >
          <img src="/icons/right-arrow.svg" alt="prev" className="w-3 h-3" />
        </button>
        <span className="text-center justify-center text-zinc-900 text-base font-normal leading-normal">
          {currentMonth.toLocaleString("default", { month: "long" })},{" "}
          {currentMonth.getFullYear()}
        </span>
        <button
          className="bg-teal-600 text-white p-2 rounded"
          onClick={() => changeMonth(1)}
        >
          <img src="/icons/left-arrow.svg" alt="next" className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mt-3 text-sm">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-zinc-900 font-normal py-1">
            {d}
          </div>
        ))}

        {monthDays().map((day, idx) => {
          if (!day) return <div key={idx}></div>;

          const dateObj = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );

          const isStart =
            startDate &&
            dateObj.getDate() === startDate.getDate() &&
            dateObj.getMonth() === startDate.getMonth() &&
            dateObj.getFullYear() === startDate.getFullYear();

          const isEnd =
            endDate &&
            dateObj.getDate() === endDate.getDate() &&
            dateObj.getMonth() === endDate.getMonth() &&
            dateObj.getFullYear() === endDate.getFullYear();

          const isInRange =
            startDate && endDate && dateObj > startDate && dateObj < endDate;

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(dateObj)}
              className="relative cursor-pointer text-zinc-900 text-base font-normal"
            >
              {isInRange && <div className="absolute inset-0 bg-violet-100" />}
              {isStart && endDate && (
                <div className="absolute inset-y-0 right-0 w-1/2 bg-violet-100" />
              )}
              {isEnd && startDate && (
                <div className="absolute inset-y-0 left-0 w-1/2 bg-violet-100" />
              )}

              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 mx-auto
            ${isStart || isEnd ? "bg-[#16968F] text-white rounded-full" : ""}
            ${
              !isStart && !isEnd && !isInRange
                ? "hover:bg-gray-200 rounded-full"
                : ""
            }
          `}
              >
                {day}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <ClipLoader size={30} color="#16968F" />
          </div>
        ) : days.length === 0 ? (
          <p className="text-gray-500 text-sm">No schedules found.</p>
        ) : (
          <div className="h-[600px] overflow-y-auto pr-2">
            {days.map((day) => (
              <div key={day.dateLabel} className="mb-4">
                <p className="justify-center text-zinc-900 text-base font-normal leading-normal">
                  {new Intl.DateTimeFormat("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                    .formatToParts(new Date(day.dateLabel))
                    .map((part) => {
                      if (part.type === "weekday") {
                        return part.value + ",";
                      }
                      return part.value;
                    })
                    .join("")}
                </p>

                {day.events.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between py-2"
                  >
                    <span className="justify-center text-zinc-900 text-lg font-normal leading-relaxed">
                      {formatDisplayTime(event.time)}
                    </span>

                    <div className="flex items-start flex-1 ml-2">
                      <img
                        src="/icons/schedule-line.svg"
                        alt="schedule"
                        className="w-4 h-12 mr-2 mt-1"
                      />

                      <div>
                        <p className="text-sm text-gray-700">{event.role}</p>
                        <p className="text-sm text-teal-600 font-medium">
                          {event.task}
                        </p>
                      </div>
                    </div>

                    {event.editable && (
                      <img
                        src="/icons/edit-icon.svg"
                        alt="edit"
                        className="w-4 h-4 cursor-pointer mr-4"
                        onClick={() => handleEditClick(event.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] space-y-6 shadow-lg">
            <div className="flex justify-between items-center border-b pb-2 border-b border-zinc-400">
              <h2 className="flex items-center gap-2 justify-start text-black text-lg font-normal leading-7">
                <img
                  src="/icons/schedular-icon.svg"
                  alt="add"
                  className="w-4 h-4"
                />
                {isEditing ? "Edit Schedule" : "Add Schedule"}
              </h2>
              <button
                onClick={() => {
                  setShowPopup(false);
                  resetForm();
                }}
                className="text-gray-600 hover:text-red-500 text-xl"
              >
                <img
                  src="/icons/cross-icon.svg"
                  alt="close"
                  className="w-4 h-4"
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
              <div className="flex items-center gap-4">
                <label className="text-[#1C1C1C] text-sm font-normal w-[100px]">
                  Select Date:
                </label>
                <div
                  className="relative flex-1 cursor-text"
                  onClick={() =>
                    (
                      document.getElementById(
                        "date-input"
                      ) as HTMLInputElement | null
                    )?.showPicker?.() ||
                    document.getElementById("date-input")?.focus()
                  }
                >
                  <input
                    id="date-input"
                    type="date"
                    className="border rounded px-2 py-2 w-full border-zinc-400 pl-8"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                  <img
                    src="/icons/calender-icon.svg"
                    alt="Calendar Icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-[#1C1C1C] text-sm font-normal w-[100px]">
                  Select Time:
                </label>
                <div
                  className="relative flex-1 cursor-text"
                  onClick={() =>
                    (
                      document.getElementById(
                        "time-input"
                      ) as HTMLInputElement | null
                    )?.showPicker?.() ||
                    document.getElementById("time-input")?.focus()
                  }
                >
                  <input
                    id="time-input"
                    type="time"
                    className="border rounded px-2 py-2 w-full border-zinc-400 pl-8"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                  />
                  <img
                    src="/icons/timer-icon.svg"
                    alt="Timer Icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[#1C1C1C] text-sm font-normal w-[100px]">
                Add Title:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-2 flex-1 border-zinc-400"
                placeholder="Enter title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[#1C1C1C] text-sm font-normal w-[100px]">
                Short Tagline:
              </label>
              <input
                type="text"
                className="border rounded px-2 py-2 flex-1 border-zinc-400"
                placeholder="Enter tagline"
                value={formTagline}
                onChange={(e) => setFormTagline(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3">
              {isEditing && (
                <button
                  onClick={handleDeleteSchedule}
                  className="bg-[#F15C5C] text-xs text-white px-8 py-3 rounded hover:bg-red-600"
                >
                  Delete Schedule
                </button>
              )}
              <button
                onClick={handleSaveSchedule}
                className={`flex text-xs font-normal gap-2 px-10 py-3 rounded text-white ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#16968F] hover:bg-[#127e78]"
                }`}
                disabled={saving}
              >
                {saving ? (
                  <ClipLoader size={20} color="#16968F" />
                ) : isEditing ? (
                  "Save Changes"
                ) : (
                  "Schedule"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCard;
