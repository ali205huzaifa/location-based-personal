import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SmtpRowDisplay from "./SmtpRowDisplay";
import SmtpCreate from "./SmtpCreate";
import SmtpAPI from "../../api/smtpApi/smtpAPI";

export default function SmtpView() {
  const [smtpList, setSmtpList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      const res = await SmtpAPI.getAll();
      setSmtpList(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching SMTP configs:", err);
      setSmtpList([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await SmtpAPI.DeleteSmtp(id);
      Swal.fire({
        text: "SMTP Configuration deleted successfully!",
        icon: "success",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      fetchData();
    } catch (err) {
      console.error("Error deleting SMTP:", err);
      Swal.fire({
        text: "Failed to delete SMTP configuration!",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  const handleEdit = (smtp: any) => {
    setEditData(smtp);
    setOpen(true);
  };

  const handleToggleRequest = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to set this as the default SMTP configuration?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16968F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, set as default",
    });

    if (confirm.isConfirmed) {
      handleSetDefault(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await SmtpAPI.SetSmtpDefault(id);
      Swal.fire({
        text: "Default SMTP updated successfully!",
        icon: "success",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      fetchData();
    } catch (err) {
      console.error("Error setting default SMTP:", err);
      Swal.fire({
        text: "Failed to set default SMTP!",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="px-8 py-3 rounded-lg bg-[#16968F] text-white hover:bg-teal-700"
        >
          Add Smtp
        </button>
      </div>

      <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
        <span className="font-Regular text-[20px]">
          Showing all Smtps{" "}
          <span className="text-[12px]">- {smtpList.length} Results</span>
        </span>
      </div>

      <div className="bg-white rounded-b-lg overflow-auto">
        <table className="font-normal w-full text-left border-collapse">
          <thead className="bg-gray-100 text-[#8B8B8B] text-zinc-500 text-base leading-relaxed border-[#D0D0D0]">
            <tr>
              <th className="p-4 font-normal">Provider</th>
              <th className="p-4 font-normal">Host</th>
              <th className="p-4 font-normal">Port</th>
              <th className="p-4 font-normal">Email</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {smtpList.length > 0 ? (
              smtpList.map((smtp) => (
                <SmtpRowDisplay
                  key={smtp._id}
                  smtp={smtp}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleRequest={handleToggleRequest}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-red-500 font-medium"
                >
                  No configuration found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SmtpCreate
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchData}
        editData={editData}
      />
    </div>
  );
}
