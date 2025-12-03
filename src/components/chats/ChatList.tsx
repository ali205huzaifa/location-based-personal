import React, { useEffect, useState } from "react";
import { List, Avatar, Typography, Input, Spin } from "antd";
import ChatAPI from "../../api/chatApi/ChatAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const { Text } = Typography;

interface ChatListProps {
  selectedChatId: string | null;
  onSelectChat: (id: string, isChat: boolean) => void;
  onOpenNewGroup: () => void;
  refreshChats: boolean;
}

interface Contact {
  grantedTo: string;
  user: {
    _id: string;
    fullName: string;
    username: string;
    image?: string;
  };
}

interface Chat {
  _id: string;
  type: string;
  name?: string;
  members: {
    _id: string;
    fullName: string;
    username: string;
    image?: string;
  }[];
}

const ChatList: React.FC<ChatListProps> = ({
  selectedChatId,
  onSelectChat,
  onOpenNewGroup,
  refreshChats,
}) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  const [chats, setChats] = useState<Chat[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatRes = await ChatAPI.getMyChats();
        if (chatRes?.data) setChats(chatRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, [refreshChats]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (search.trim().length === 0) {
        setContacts([]);
        return;
      }

      setLoadingContacts(true);

      try {
        const res = await ChatAPI.getMyContacts({ username: search });
        if (Array.isArray(res?.data?.data)) {
          setContacts(res.data.data);
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("Error fetching contacts", err);
        setContacts([]);
      } finally {
        setLoadingContacts(false);
      }
    };

    const delayDebounce = setTimeout(fetchContacts, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const renderChatItem = (chat: Chat) => {
    const isGroup = chat.type === "Group";

    let displayName = chat.name;
    let avatarSrc = "/images/default-chat-profile.svg";

    if (!isGroup) {
      const otherUser = chat.members.find((m) => m._id !== user?._id);
      displayName = otherUser?.fullName;
      avatarSrc = otherUser?.image || avatarSrc;
    }

    return (
      <List.Item
        onClick={() => onSelectChat(chat._id, true)}
        className={`cursor-pointer px-2 !py-10 transition-colors !h-16 !border-none ${
          selectedChatId === chat._id ? "bg-gray-100" : "!hover:bg-[#EFEFEF]"
        }`}
      >
        <List.Item.Meta
          avatar={<Avatar src={avatarSrc} size={50} />}
          title={<div className="text-black text-base mt-1">{displayName}</div>}
          description={
            <div className="text-stone-500 text-sm font-normal">
              {isGroup
                ? "Group"
                : `@${chat.members.find((m) => m._id !== user?._id)?.username}`}
            </div>
          }
        />
      </List.Item>
    );
  };

  const renderContactItem = (contact: Contact) => {
    const u = contact.user;
    const avatar = u.image || "/images/default-chat-profile.svg";

    return (
      <List.Item
        onClick={() => onSelectChat(u._id, false)}
        className="cursor-pointer px-2 !py-10 transition-colors !h-16 !border-none hover:bg-gray-50"
      >
        <List.Item.Meta
          avatar={<Avatar src={avatar} size={50} />}
          title={<div className="text-black text-base mt-1">{u.fullName}</div>}
          description={
            <div className="text-stone-500 text-sm">@{u.username}</div>
          }
        />
      </List.Item>
    );
  };

  return (
    <div className="xl:w-80 md:w-72 flex flex-col h-full px-2">
      <div className="relative w-full">
        <Input
          placeholder="Search"
          prefix={
            <img src="/icons/search-icon.svg" alt="Icon" className="w-6 h-6" />
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl w-full !h-12 mb-4 outline-[#8869F3] placeholder:!text-[#666666]"
        />

        {/* Clear Icon (shows only when there is text) */}
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      <div
        onClick={onOpenNewGroup}
        className="flex items-center cursor-pointer px-2 mb-4 py-3 hover:bg-[#EFEFEF] max-w-[145px] hover:rounded-xl"
      >
        <img
          src="/icons/group-icon.svg"
          alt="Group Icon"
          className="w-6 h-6 mr-4"
        />
        <Text className="text-[#8869F3] text-base font-normal ml-1">
          New Group
        </Text>
      </div>

      <div className="flex-1 overflow-y-auto border-x border-gray-200 px-2">
        {search.length > 0 ? (
          loadingContacts ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={contacts}
              renderItem={renderContactItem}
            />
          )
        ) : loadingChats ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            className="mt-2"
            dataSource={chats}
            renderItem={renderChatItem}
          />
        )}
      </div>
    </div>
  );
};

export default ChatList;
