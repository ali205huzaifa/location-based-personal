import React from "react";
import { Avatar, Typography, Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { chats } from "./data";

const { Text } = Typography;
const { TextArea } = Input;

interface ChatWindowProps {
  selectedChatId: number | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChatId }) => {
  const chat = chats.find((c) => c.id === selectedChatId);

  if (!chat)
    return (
      <div
        style={{
          width: "70%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
        }}
      >
        Select a chat to start messaging
      </div>
    );

  return (
    <div style={{ width: "70%", display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "#fff",
        }}
      >
        <Avatar src={chat.avatar} size={44} />
        <div>
          <Text strong style={{ fontSize: 16 }}>
            {chat.name}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {chat.username}
          </Text>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.sender === "Me" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: msg.sender === "Me" ? "#722ED1" : "#f0f0f0",
                color: msg.sender === "Me" ? "white" : "black",
                padding: "12px 16px",
                borderRadius: "20px",
                maxWidth: "60%",
              }}
            >
              <div>{msg.text}</div>
              <div style={{ fontSize: 11, marginTop: 4, opacity: 0.7 }}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 20px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#fff",
        }}
      >
        <TextArea
          rows={1}
          placeholder="Type here..."
          style={{ borderRadius: 20, resize: "none" }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          size="large"
          style={{ background: "#722ED1" }}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
