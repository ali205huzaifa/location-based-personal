import type { Department, Skill } from "../../types/user";

export function DeptRow({
  item,
  onEdit,
  onDelete,
}: {
  item: Department;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3 justify-start text-black text-base font-normal leading-loose">
        {item.name}
      </td>
      <td className="px-4 py-3 justify-start text-black text-base font-normal leading-loose">
        {item.description}
      </td>
      <td className="px-4 py-3 w-24 text-right flex gap-4 mr-2">
        <button
          onClick={onEdit}
          className="mr-3 text-gray-700 hover:text-emerald-600"
          aria-label="Edit"
        >
          <img src="/icons/edit-icon.svg" alt="Edit" width={18} height={18} />
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-600"
          aria-label="Delete"
        >
          <img
            src="/icons/delete-icon.svg"
            alt="Delete"
            width={15}
            height={15}
          />
        </button>
      </td>
    </tr>
  );
}

export function SkillRow({
  item,
  onEdit,
  onDelete,
}: {
  item: Skill;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3 justify-start text-black text-base font-normal leading-loose">
        {item.name}
      </td>
      <td className="px-4 py-3 justify-start text-black text-base font-normal leading-loose">
        {item.department?.name || "—"}
      </td>
      <td className="px-4 py-3 w-24 text-right flex gap-4 mr-2">
        <button
          onClick={onEdit}
          className="mr-3 text-gray-700 hover:text-emerald-600"
          aria-label="Edit"
        >
          <img src="/icons/edit-icon.svg" alt="Edit" width={18} height={18} />
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-600"
          aria-label="Delete"
        >
          <img
            src="/icons/delete-icon.svg"
            alt="Delete"
            width={15}
            height={15}
          />
        </button>
      </td>
    </tr>
  );
}
