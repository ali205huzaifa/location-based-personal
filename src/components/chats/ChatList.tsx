import React from "react";
import { List, Avatar, Typography, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { chats } from "./data";

const { Text } = Typography;

interface ChatListProps {
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({ selectedChatId, onSelectChat }) => {
  return (
    <div style={{ width: "30%", height: "100vh", borderRight: "1px solid #f0f0f0" }}>
      <div style={{ padding: "16px" }}>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ borderRadius: 20 }}
        />
      </div>

      <List
        itemLayout="horizontal"
        dataSource={chats}
        renderItem={(chat) => (
          <List.Item
            onClick={() => onSelectChat(chat.id)}
            style={{
              background: selectedChatId === chat.id ? "#f5f5f5" : "transparent",
              cursor: "pointer",
              padding: "12px 16px",
            }}
          >
            <List.Item.Meta
              avatar={<Avatar src={chat.avatar} size={40} />}
              title={<Text strong>{chat.name}</Text>}
              description={<Text type="secondary">{chat.lastMessage}</Text>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ChatList;
