interface RowProps {
  smtp: any;
  onEdit: (smtp: any) => void;
  onDelete: (id: string) => void;
  onToggleRequest: (id: string) => void;
}

export default function SmtpRowDisplay({
  smtp,
  onEdit,
  onDelete,
  onToggleRequest,
}: RowProps) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2 font-normal">{smtp.provider}</td>
      <td className="p-2 font-normal">{smtp.host}</td>
      <td className="p-2 font-normal">{smtp.port}</td>
      <td className="p-2 font-normal">{smtp.email}</td>

      <td className="p-2 font-normal">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={smtp.isDefault || false}
            onChange={(e) => {
              if (e.target.checked) {
                onToggleRequest(smtp._id);
              }
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-600 relative transition">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
          </div>
        </label>
      </td>

      <td className="p-2 flex gap-2">
        <div className="flex gap-4">
          <button onClick={() => onEdit(smtp)}>
            <img
              src="/icons/edit-icon.svg"
              alt="Edit Icon"
              width={18}
              height={18}
            />
          </button>
          <button onClick={() => onDelete(smtp._id)}>
            <img
              src="/icons/delete-icon.svg"
              alt="Delete"
              width={15}
              height={15}
            />
          </button>
        </div>
      </td>
    </tr>
  );
}
