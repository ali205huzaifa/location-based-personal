import React, { useEffect, useState } from "react";

interface Props {
  type: "countries" | "cities";
  onSave: (item: any) => void;
  editingItem?: any;
  onCancel: () => void;
}

const CreateLocation: React.FC<Props> = ({
  type,
  onSave,
  editingItem,
  onCancel,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      setFormData({});
    }
  }, [editingItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({});
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      {type === "countries" ? (
        <>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            placeholder="Country name"
            className="border px-2 py-1"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="code"
            value={formData.code || ""}
            placeholder="Code"
            className="border px-2 py-1"
            onChange={handleChange}
            required
          />
        </>
      ) : (
        <>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            placeholder="City name"
            className="border px-2 py-1"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="country"
            value={formData.country || ""}
            placeholder="Country"
            className="border px-2 py-1"
            onChange={handleChange}
            required
          />
        </>
      )}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-1 rounded"
      >
        {editingItem ? "Update" : "Add"}
      </button>
      {editingItem && (
        <button
          type="button"
          className="bg-gray-400 text-white px-4 py-1 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default CreateLocation;
