import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SmtpAPI from "../../api/smtpApi/smtpAPI";

interface SmtpCreateProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any | null;
}

interface SmtpForm {
  provider: string;
  host: string;
  port: number;
  email: string;
  password: string;
}

export default function SmtpCreate({
  open,
  onClose,
  onSuccess,
  editData,
}: SmtpCreateProps) {
  const [form, setForm] = useState<SmtpForm>({
    provider: "",
    host: "",
    port: 0,
    email: "",
    password: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        provider: editData.provider || "",
        host: editData.host || "",
        port: editData.port || 0,
        email: editData.email || "",
        password: editData.password || "",
      });
    } else {
      setForm({ provider: "", host: "", port: 0, email: "", password: "" });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form };

      if (editData?._id) {
        await SmtpAPI.UpdateSmtp(editData._id, payload as any);

        Swal.fire({
          text: "SMTP Configuration updated successfully!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await SmtpAPI.CreateSmtp(payload as any);

        Swal.fire({
          text: "SMTP Configuration created successfully!",
          icon: "success",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving SMTP:", err);
      Swal.fire({
        text: "Failed to save SMTP configuration!",
        icon: "error",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-4">
          {editData ? "Edit SMTP Configuration" : "Add SMTP Configuration"}
        </h3>

        <div className="flex flex-col gap-3 mb-4">
          {["provider", "host", "port", "email", "password"].map((field) => (
            <input
              key={field}
              type={
                field === "password"
                  ? "password"
                  : field === "port"
                  ? "number"
                  : "text"
              }
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className="border rounded p-2"
            />
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded border bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded bg-[#16968F] text-white hover:bg-teal-700"
          >
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
