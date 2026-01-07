import React, { useEffect, useState, useCallback, useRef } from "react";
import { Input, Spin, Modal } from "antd";
import debounce from "lodash/debounce";
import ChatAPI from "../../api/chatApi/ChatAPI";

interface Contact {
  grantedTo: string;
  user: {
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

  const isFirstOpen = useRef(false);

  const fetchContacts = async (username?: string) => {
    setLoading(true);
    try {
      const response = await ChatAPI.getMyContacts(
        username ? { username } : {}
      );
      if (response && Array.isArray(response.data?.data)) {
        setContacts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    debounce((value: string) => {
      if (!open) return;

      if (!value.trim()) {
        fetchContacts();
      } else {
        fetchContacts(value.trim());
      }
    }, 300),
    [open]
  );

  useEffect(() => {
    if (open) {
      isFirstOpen.current = true;
      fetchContacts();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (search.trim() !== "") {
      handleSearch(search);
    }
  }, [search, open, handleSearch]);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={730}
      className="rounded-3xl overflow-hidden custom-modal"
      title={
        <span className="text-black text-base font-medium">New Group Chat</span>
      }
    >
      <div className="py-2">
        <Input
          prefix={
            <img src="/icons/search-icon.svg" alt="Icon" className="w-6 h-6" />
          }
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="w-full h-10 rounded-xl mb-6 !text-black text-sm font-normal focus:!border-[#8869F3] hover:!border-[#8869F3] focus-within:!border-[#8869F3]"
        />

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="max-h-[450px] overflow-y-auto space-y-2 no-scrollbar">
            {contacts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm">
                No contacts found
              </p>
            ) : (
              contacts.map(({ user }) => {
                const avatar = user.image || "/images/default-chat-profile.svg";

                return (
                  <div
                    key={user._id}
                    onClick={() => toggleSelect(user._id)}
                    className="flex items-center justify-between py-2 px-2 rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-3">
                      <img src={avatar} className="w-11 h-11 rounded-full" />
                      <div>
                        <p className="text-black text-base font-normal">
                          {user.fullName}
                        </p>
                        <p className="text-stone-500 text-sm font-normal">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={selected.includes(user._id)}
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
          className="mt-8 w-full !bg-[#8869F3] text-white py-2 rounded-xl disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </Modal>
  );
};

export default NewGroupModal;
