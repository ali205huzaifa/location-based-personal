import React from "react";
import { chats } from "./data";

interface ChatWindowProps {
  selectedChatId: number | null;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChatId }) => {
  const chat = chats.find((c) => c.id === selectedChatId);

  if (!chat)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
        Select a chat to start messaging
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-xl ml-4 mr-4 mb-4">
      <div className="flex items-center p-4 border-b">
        <img
          src={chat.avatar}
          alt={chat.name}
          className="w-10 h-10 rounded-full mr-3"
        />{" "}
        <div>
          <h3 className="text-black text-base font-normal">{chat.name}</h3>
          <p className="text-[#666666] text-sm font-normal">{chat.username}</p>
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto p-4 space-y-3">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "Me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-xs ${
                msg.sender === "Me"
                  ? "bg-[#8869F3] text-white"
                  : "bg-zinc-100 text-black"
              }`}
            >
              {msg.text}
              <div className="text-[10px] text-gray-400 mt-1">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <img
              src="/icons/eyeOpen-icon.svg"
              alt="Show"
              width={20}
              height={20}
              className="text-gray-500 hover:text-purple-500 cursor-pointer"
            />
          </span>

          <input
            type="text"
            placeholder="Type here..."
            className="w-full h-12 border rounded-xl pl-10 pr-16 py-2 text-[#C3C3C3] text-xs font-normal"
          />

          <button className="absolute inset-y-0 right-4 text-[#8869F3] text-base font-semibold cursor-pointer">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
