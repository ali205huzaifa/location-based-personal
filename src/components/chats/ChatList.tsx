import React from "react";
import { List, Avatar, Typography, Input } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { chats } from "./data";

const { Text } = Typography;

interface ChatListProps {
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onOpenNewGroup: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  selectedChatId,
  onSelectChat,
  onOpenNewGroup,
}) => {
  return (
    <div className="xl:w-80 md:w-72 flex flex-col h-full px-2">
      <div className="flex-shrink-0">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="rounded-xl w-full !h-12 mb-8 outline-[#8869F3]"
        />
        <div
          onClick={onOpenNewGroup}
          className="flex items-center text-purple-600 font-semibold cursor-pointer hover:text-purple-700 transition-colors mb-6"
        >
          <PlusOutlined className="text-base mr-2" />
          <Text className="text-purple-600 font-medium">New Group</Text>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border-x border-gray-200 px-2">
        <List
          itemLayout="horizontal"
          className="mt-2"
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item
              onClick={() => onSelectChat(chat.id)}
              className={`cursor-pointer px-2 !py-4 transition-colors !h-16 !border-none ${
                selectedChatId === chat.id ? "bg-gray-100" : "!hover:bg-gray-50"
              }`}
            >
              <List.Item.Meta
                avatar={<Avatar src={chat.avatar} size={50} />}
                title={
                  <div className="text-black text-base font-normal mt-1">
                    {chat.name}
                  </div>
                }
                description={
                  <div className="text-stone-500 text-sm font-normal">
                    {chat.lastMessage}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ChatList;
