import React from "react";

interface Props {
  type: "countries" | "cities";
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}

const LocationRowDisplay: React.FC<Props> = ({
  type,
  item,
  onEdit,
  onDelete,
}) => {
  return (
    <tr className="border-b">
      {type === "countries" ? (
        <>
          <td className="p-2">{item.name}</td>
          <td className="p-2">{item.code}</td>
        </>
      ) : (
        <>
          <td className="p-2">{item.name}</td>
          <td className="p-2">{item.country}</td>
        </>
      )}
      <td className="p-2 space-x-2">
        <button onClick={onEdit} className="text-blue-600">
          ✏️
        </button>
        <button onClick={onDelete} className="text-red-600">
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default LocationRowDisplay;
