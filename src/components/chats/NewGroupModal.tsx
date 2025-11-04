import React, { useState } from "react";
import { users } from "./data";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface NewGroupModalProps {
  open: boolean;
  onClose: () => void;
  onNext: (selected: number[]) => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({
  open,
  onClose,
  onNext,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  if (!open) return null;

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-[724px] rounded-3xl overflow-hidden">
        <div className="px-4 py-3 flex justify-between items-center">
          <h2 className="text-black text-base font-medium">New Group Chat</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="px-4 py-2">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="w-full h-10 rounded-xl mb-6 text-sm ml-1 outline-[#8869F3]"
          />

          <div className="max-h-[450px] overflow-y-auto space-y-2">
            {filtered.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleSelect(user.id)}
                className="flex items-center justify-between p-2 rounded-lg cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-black text-base font-normal">
                      {user.name}
                    </p>
                    <p className="text-stone-500 text-sm font-normal">
                      {user.username}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selected.includes(user.id)}
                  readOnly
                  className="accent-[#8869F3] w-4 h-4"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => onNext(selected)}
            disabled={selected.length === 0}
            className="mt-4 w-full bg-[#8869F3] text-white py-2 rounded-xl disabled:opacity-50 mb-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
