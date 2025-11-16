import React, { useEffect, useState } from "react";
import { List, Avatar, Typography, Input, Spin, Popover } from "antd";
import { SearchOutlined } from "@ant-design/icons";
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
  userDetails: {
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
  const [loading, setLoading] = useState(true);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await ChatAPI.getMyChats();
        if (response?.data) {
          setChats(response.data);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [token, refreshChats]);

  const fetchContacts = async () => {
    if (contacts.length > 0) return;
    setLoadingContacts(true);
    try {
      const res = await ChatAPI.getMyContacts();
      if (res?.data && Array.isArray(res.data)) {
        setContacts(res.data);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoadingContacts(false);
    }
  };

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
        className={`cursor-pointer px-2 !py-4 transition-colors !h-16 !border-none ${
          selectedChatId === chat._id ? "bg-gray-100" : "!hover:bg-gray-50"
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
    const { userDetails } = contact;
    const avatarSrc = userDetails.image || "/images/default-chat-profile.svg";

    return (
      <List.Item
        onClick={() => {
          onSelectChat(userDetails._id, false);
          setPopoverVisible(false);
        }}
        className="cursor-pointer px-2 !py-3 hover:bg-gray-50 rounded-md"
      >
        <List.Item.Meta
          avatar={<Avatar src={avatarSrc} size={45} />}
          title={
            <div className="text-black text-sm">{userDetails.fullName}</div>
          }
          description={
            <div className="text-stone-500 text-xs">
              @{userDetails.username}
            </div>
          }
        />
      </List.Item>
    );
  };

  const contactListPopover = (
    <div className="max-h-[400px] w-[300px] overflow-y-auto">
      {loadingContacts ? (
        <div className="flex justify-center items-center py-10">
          <Spin />
        </div>
      ) : contacts.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={contacts}
          renderItem={renderContactItem}
        />
      ) : (
        <div className="text-gray-400 text-center py-6 text-sm">
          No contacts found
        </div>
      )}
    </div>
  );

  return (
    <div className="xl:w-80 md:w-72 flex flex-col h-full px-2">
      <div className="flex-shrink-0">
        <Popover
          content={contactListPopover}
          trigger="click"
          open={popoverVisible}
          onOpenChange={(visible) => {
            setPopoverVisible(visible);
            if (visible) fetchContacts();
          }}
          placement="bottomLeft"
        >
          <Input
            placeholder="Search contacts"
            prefix={<SearchOutlined />}
            onFocus={() => setPopoverVisible(true)}
            readOnly
            className="rounded-xl w-full !h-12 mb-8 outline-[#8869F3] cursor-pointer"
          />
        </Popover>

        <div
          onClick={onOpenNewGroup}
          className="flex items-center text-purple-600 font-semibold cursor-pointer hover:text-purple-700 transition-colors mb-6"
        >
          <img
            src="/icons/group-icon.svg"
            alt="Group Icon"
            className="w-6 h-6 mr-4"
          />
          <Text className="text-[#8869F3] text-base font-normal">
            New Group
          </Text>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border-x border-gray-200 px-2">
        {loading ? (
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
