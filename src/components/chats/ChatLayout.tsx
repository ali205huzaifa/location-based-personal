import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const ChatLayout: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(1);

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <ChatList selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
      <ChatWindow selectedChatId={selectedChatId} />
    </div>
  );
};

export default ChatLayout;
