import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Spin } from "antd";
import { io, Socket } from "socket.io-client";
import ChatAPI from "../../api/chatApi/ChatAPI";

interface Message {
  _id?: string;
  chatId?: string;
  senderId?: string;
  ciphertext?: string;
  encryptedKey?: string;
  createdAt?: string;
}

interface Member {
  _id: string;
  fullName: string;
  username: string;
  image?: string;
}

interface ChatData {
  _id: string;
  type: string;
  members: string[];
  messages: Message[];
  memberDetails: Member[];
}

interface ChatWindowProps {
  selectedChatId: string | null;
  isExistingChat: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem("token");

export const socket: Socket = io(API_BASE_URL, {
  transports: ["websocket"],
  auth: { token },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedChatId,
  isExistingChat,
}) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  useEffect(() => {
    if (!chatData?._id || !user?._id) return;

    const handleNewMessage = (newMsg: Message) => {
      if (newMsg.chatId === chatData._id && newMsg.senderId !== user._id) {
        setChatData((prev) =>
          prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev
        );
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [chatData?._id, user?._id]);

  const handleSendMessage = () => {
    if (!input.trim() || !chatData || !user?._id) return;

    const ciphertext = btoa(input.trim());
    const messageData = {
      chatId: chatData._id,
      encryptedKey: "demoKey",
      ciphertext,
    };

    socket.emit("sendMessage", messageData);

    const newMessage: Message = {
      senderId: user._id,
      ciphertext,
      createdAt: new Date().toISOString(),
      chatId: chatData._id,
    };

    setChatData((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, newMessage],
          }
        : prev
    );

    setInput("");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !chatData || !user?._id) return;

    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPEG, or MP4 files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64File = reader.result as string;
      const messageData: Message = {
        senderId: user._id,
        chatId: chatData._id,
        ciphertext: btoa(base64File),
        createdAt: new Date().toISOString(),
      };

      socket.emit("sendMessage", messageData);
      setChatData((prev) =>
        prev ? { ...prev, messages: [...prev.messages, messageData] } : prev
      );
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (!selectedChatId || !user?._id) return;

    const fetchChat = async () => {
      setLoading(true);
      setChatData(null);

      try {
        let data;
        if (isExistingChat) {
          const res = await ChatAPI.getMessagesbyChatId(selectedChatId);
          data = {
            _id: selectedChatId,
            messages: res.data || [],
            memberDetails: [],
          };
        } else {
          const res = await ChatAPI.OnetoOneChat({
            participantId: selectedChatId,
          });
          data = res?.data;
          if (data) socket.emit("joinChat", data._id);
        }

        if (data) setChatData(data);
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [selectedChatId, user?._id, isExistingChat]);

  if (!selectedChatId)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
        Select a chat to start messaging
      </div>
    );

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );

  const otherUser = chatData?.memberDetails?.find((m) => m._id !== user?._id);
  const avatar = otherUser?.image || "/images/default-chat-profile.svg";
  const username = otherUser?.username;
  const fullName = otherUser?.fullName;

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-xl ml-4 mr-4 mb-4">
      <div className="flex items-center p-4 border-b">
        <img
          src={avatar}
          alt={username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="text-black text-base font-normal">{fullName}</h3>
          <p className="text-[#666666] text-sm font-normal">@{username}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {chatData && chatData.messages && chatData.messages.length > 0 ? (
          chatData.messages.map((msg, index) => {
            const isMine = msg.senderId === user?._id;

            let decodedText = "";
            let isImage = false;
            let isVideo = false;

            if (msg.ciphertext) {
              try {
                decodedText = atob(msg.ciphertext);

                if (decodedText.startsWith("data:image/")) {
                  isImage = true;
                } else if (decodedText.startsWith("data:video/")) {
                  isVideo = true;
                }
              } catch {
                decodedText = msg.ciphertext;
              }
            }

            return (
              <div
                key={msg._id || index}
                className={`flex flex-col ${
                  isMine ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex p-3 max-w-md mt-2 ${
                    isMine
                      ? "bg-[#8869F3] text-white rounded-2xl rounded-br-none"
                      : "bg-zinc-100 text-black rounded-2xl rounded-bl-none"
                  }`}
                >
                  {isImage ? (
                    <img
                      src={decodedText}
                      alt="Sent media"
                      className="max-w-xs max-h-60 rounded-lg object-cover"
                    />
                  ) : isVideo ? (
                    <video
                      src={decodedText}
                      controls
                      className="max-w-xs max-h-60 rounded-lg"
                    />
                  ) : (
                    decodedText
                  )}
                </div>
                <div
                  className={`text-stone-500 text-xs font-normal mt-1 ${
                    isMine ? "text-right" : "text-left"
                  }`}
                >
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : ""}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <div className="relative w-full">
          <span
            className="absolute inset-y-0 left-3 flex items-center"
            onClick={handleAttachmentClick}
          >
            <img
              src="/icons/attachment-icon.svg"
              alt="Attach"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </span>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <input
            type="text"
            placeholder="Type here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="w-full h-12 border rounded-xl pl-12 pr-16 py-2 placeholder:text-[#C3C3C3] text-xs font-normal text-gray-800 !outline-[#8869F3]"
          />
          <button
            onClick={handleSendMessage}
            className="absolute inset-y-0 right-4 text-[#8869F3] text-base font-medium cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
