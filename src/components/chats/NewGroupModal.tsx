import React, { useEffect, useState } from "react";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ChatAPI from "../../api/chatApi/ChatAPI";

interface Contact {
  grantedTo: string;
  userDetails: {
    _id: string;
    fullName: string;
    username: string;
    image?: string;
  };
}

interface NewGroupModalProps {
  open: boolean;
  onClose: () => void;
  onNext: (selected: string[]) => void;
}

const NewGroupModal: React.FC<NewGroupModalProps> = ({
  open,
  onClose,
  onNext,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchContacts = async () => {
      setLoading(true);
      try {
        const response = await ChatAPI.getMyContacts();
        if (response && Array.isArray(response.data)) {
          setContacts(response.data);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchContacts, 400);
    return () => clearTimeout(delay);
  }, [open, search]);

  if (!open) return null;

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

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
            placeholder="Search contacts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="w-full h-10 rounded-xl mb-6 text-sm ml-1 outline-[#8869F3]"
          />

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" />
            </div>
          ) : (
            <div className="max-h-[450px] overflow-y-auto space-y-2">
              {contacts.length === 0 ? (
                <p className="text-center text-gray-400 text-sm">
                  No contacts found
                </p>
              ) : (
                contacts.map((contact) => {
                  const { userDetails } = contact;
                  const avatar =
                    userDetails.image || "/images/default-chat-profile.svg";
                  return (
                    <div
                      key={userDetails._id}
                      onClick={() => toggleSelect(userDetails._id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                        selected.includes(userDetails._id)
                          ? "bg-purple-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={avatar}
                          alt={userDetails.fullName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-black text-base font-normal">
                            {userDetails.fullName}
                          </p>
                          <p className="text-stone-500 text-sm font-normal">
                            @{userDetails.username}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={selected.includes(userDetails._id)}
                        readOnly
                        className="accent-[#8869F3] w-4 h-4"
                      />
                    </div>
                  );
                })
              )}
            </div>
          )}

          <button
            onClick={() => onNext(selected)}
            disabled={selected.length === 0}
            className="mt-4 w-full !bg-[#8869F3] text-white py-2 rounded-xl disabled:opacity-50 mb-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
