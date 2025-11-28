import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Spin } from "antd";
import { io, Socket } from "socket.io-client";
import sodium from "libsodium-wrappers";
import ChatAPI from "../../api/chatApi/ChatAPI";
import { encryptForChat } from "../../util/Encryption";
import { decryptMessage } from "../../util/Decryption";

interface MessageFromAPI {
  _id?: string;
  chatId?: string;
  senderId?: any;
  ciphertext?: any;
  nonce?: any;
  createdAt?: string;
  media?: any[];
}

interface Member {
  _id: string;
  fullName: string;
  username: string;
  image?: string;
  userPublicKey?: string;
}

interface ChatData {
  _id: string;
  type?: string;
  members?: string[];
  messages?: MessageFromAPI[];
  memberDetails?: Member[];
}

interface ChatWindowProps {
  selectedChatId: string | null;
  isExistingChat: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedChatId,
  isExistingChat,
}) => {
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const token = localStorage.getItem("token");
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages]);

  useEffect(() => {
    (async () => {
      await sodium.ready;
    })();
  }, []);

  useEffect(() => {
    if (!token) return;

    const s = io(API_BASE_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current = s;

    // s.on("connect", () => {
    //   console.log("socket connected", s.id);
    // });

    s.on("connect_error", (err: any) => {
      console.error("Socket connection failed", err?.message ?? err);
    });

    // s.onAny((event, ...args) => {
    // });

    return () => {
      try {
        s.removeAllListeners();
        s.disconnect();
      } catch (e) {}
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !user?._id) return;

    const s = io(API_BASE_URL, {
      transports: ["websocket"],
      auth: { token },
    });

    socketRef.current = s;

    s.on("connect", () => {
      //console.log("Socket connected", s.id);
      if (chatData?._id) {
        s.emit("joinChat", chatData._id);
      }
    });

    // s.on("connect_error", (err) => {
    //   console.error("Socket connection failed", err?.message ?? err);
    // });

    // s.onAny((event, ...args) => {
    //   console.log("Socket event received:", event, args);
    // });

    const handleNewMessage = async (msg: any) => {
      msg = typeof msg?.data === "string" ? JSON.parse(msg.data) : msg;
      const actualMsg = msg.data ?? msg;
      if (actualMsg.sender?._id === user._id) return;
      if (!chatData?._id || actualMsg.chatId !== chatData._id) return;
      const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
      if (!myPrivateKeyBase64) return;

      try {
        const isSender = actualMsg.sender?._id === user._id;

        const ciphertext = isSender
          ? actualMsg.ciphertext?.forSender
          : actualMsg.ciphertext?.forRecipient;

        const nonce = isSender
          ? actualMsg.nonce?.forSender
          : actualMsg.nonce?.forRecipient;

        const senderPublicKey = actualMsg.sender?.userPublicKey;

        let plaintext = "[Failed to decrypt]";
        if (ciphertext && nonce && senderPublicKey) {
          plaintext = await decryptMessage(
            ciphertext,
            nonce,
            senderPublicKey,
            myPrivateKeyBase64,
            actualMsg._id
          );
        }

        setChatData((prev) =>
          prev
            ? { ...prev, messages: [...(prev.messages || []), actualMsg] }
            : prev
        );

        (window as any)._decryptedMessages =
          (window as any)._decryptedMessages || {};
        (window as any)._decryptedMessages[actualMsg._id] = plaintext;
      } catch (err) {
        console.error("Realtime decrypt failed", err);
      }
    };

    s.on("newMessage", handleNewMessage);

    return () => {
      s.removeAllListeners();
      s.disconnect();
      socketRef.current = null;
    };
  }, [token, user?._id, chatData?._id]);

  useEffect(() => {
    if (!selectedChatId || !user?._id) return;

    const fetchChat = async () => {
      setLoading(true);
      setChatData(null);

      try {
        let data: any = null;

        if (isExistingChat) {
          const res = await ChatAPI.getMessagesbyChatId(selectedChatId);

          const apiMessages = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];

          const members =
            apiMessages[0]?.chat?.members?.map((m: any) => ({
              _id: m._id,
              fullName: m.fullName,
              username: m.username,
              userPublicKey: m.userPublicKey,
              image: m.image,
            })) || [];

          data = {
            _id: selectedChatId,
            messages: apiMessages,
            memberDetails: members,
          };
        } else {
          const res = await ChatAPI.OnetoOneChat({
            participantId: selectedChatId,
          });
          data = res?.data;
          if (data && socketRef.current)
            socketRef.current.emit("joinChat", data._id);
        }

        if (data) {
          setChatData(data);

          const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
          if (!myPrivateKeyBase64) {
            console.warn(
              "Private key missing - skipping decryption of fetched messages"
            );
            return;
          }

          (window as any)._decryptedMessages =
            (window as any)._decryptedMessages || {};

          for (const msg of data.messages || []) {
            try {
              const isSender = msg.senderId?._id === user._id;
              const ciphertext = isSender
                ? msg.ciphertext?.forSender
                : msg.ciphertext?.forRecipient;
              const nonce = isSender
                ? msg.nonce?.forSender
                : msg.nonce?.forRecipient;
              const senderPublicKey = msg.senderId?.userPublicKey;

              if (ciphertext && nonce && senderPublicKey) {
                const plaintext = await decryptMessage(
                  ciphertext,
                  nonce,
                  senderPublicKey,
                  myPrivateKeyBase64,
                  msg._id
                );
                (window as any)._decryptedMessages[msg._id] = plaintext;
              } else {
                (window as any)._decryptedMessages[msg._id] =
                  "[Missing encryption data]";
              }
            } catch (err) {
              console.error("Failed to decrypt message", msg._id, err);
              (window as any)._decryptedMessages[msg._id] =
                "[Failed to decrypt]";
            }
          }
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [selectedChatId, user?._id, isExistingChat]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatData || !user?._id) return;

    const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
    const myPublicKeyBase64 = localStorage.getItem("publicKey")?.trim();

    if (!myPrivateKeyBase64 || !myPublicKeyBase64) {
      console.error("Missing keys in localStorage");
      return;
    }

    const other = chatData.memberDetails?.find((m) => m._id !== user._id);
    const receiverPublicKey = other?.userPublicKey?.trim();
    if (!receiverPublicKey) {
      console.error("Receiver public key missing");
      return;
    }

    try {
      const encrypted = await encryptForChat({
        message: input.trim(),
        myPrivateKeyBase64,
        myPublicKeyBase64,
        receiverPublicKeyBase64: receiverPublicKey,
      });

      socketRef.current?.emit("sendMessage", {
        chatId: chatData._id,
        ciphertext: encrypted.ciphertext,
        nonce: encrypted.nonce,
      });

      const localMsg: MessageFromAPI = {
        _id: `local-${Date.now()}`,
        chatId: chatData._id,
        senderId: {
          _id: user._id,
          fullName: user.fullName,
          username: user.username,
        },
        ciphertext: encrypted.ciphertext,
        nonce: encrypted.nonce,
        createdAt: new Date().toISOString(),
      };

      (window as any)._decryptedMessages =
        (window as any)._decryptedMessages || {};
      (window as any)._decryptedMessages[localMsg._id!] = input.trim();

      setChatData((prev) =>
        prev
          ? { ...prev, messages: [...(prev.messages || []), localMsg] }
          : prev
      );
      setInput("");
    } catch (err) {
      console.error("Encryption failed", err);
      alert("Failed to encrypt message");
    }
  };

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
    reader.onload = async () => {
      const base64File = reader.result as string;

      const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
      const myPublicKeyBase64 = localStorage.getItem("publicKey")?.trim();
      const other = chatData.memberDetails?.find((m) => m._id !== user._id);
      const receiverPublicKey = other?.userPublicKey?.trim();

      if (!myPrivateKeyBase64 || !myPublicKeyBase64 || !receiverPublicKey) {
        console.error("Keys missing - cannot send attachment");
        return;
      }

      try {
        const encrypted = await encryptForChat({
          message: base64File,
          myPrivateKeyBase64,
          myPublicKeyBase64,
          receiverPublicKeyBase64: receiverPublicKey,
        });

        socketRef.current?.emit("sendMessage", {
          chatId: chatData._id,
          ciphertext: encrypted.ciphertext,
          nonce: encrypted.nonce,
          media: [{ name: file.name, mime: file.type }],
        });

        const localMsg: MessageFromAPI = {
          _id: `local-${Date.now()}`,
          chatId: chatData._id,
          senderId: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
          },
          ciphertext: encrypted.ciphertext,
          nonce: encrypted.nonce,
          createdAt: new Date().toISOString(),
          media: [{ name: file.name, mime: file.type }],
        };

        (window as any)._decryptedMessages =
          (window as any)._decryptedMessages || {};
        (window as any)._decryptedMessages[localMsg._id!] = base64File;

        setChatData((prev) =>
          prev
            ? { ...prev, messages: [...(prev.messages || []), localMsg] }
            : prev
        );
      } catch (err) {
        console.error("Failed encrypting file", err);
        alert("Failed to encrypt attachment");
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

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

  const getDecrypted = (msgId?: string, ciphertext?: any) => {
    (window as any)._decryptedMessages =
      (window as any)._decryptedMessages || {};
    if (msgId && (window as any)._decryptedMessages[msgId])
      return (window as any)._decryptedMessages[msgId];

    if (ciphertext && typeof ciphertext === "string") {
      try {
        return atob(ciphertext);
      } catch {
        return ciphertext;
      }
    }

    return "[Encrypted message]";
  };

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
            const isMine = msg.senderId?._id === user?._id;

            const decrypted = getDecrypted(msg._id, msg.ciphertext);

            let isImage = false;
            let isVideo = false;
            if (typeof decrypted === "string") {
              if (decrypted.startsWith("data:image/")) isImage = true;
              else if (decrypted.startsWith("data:video/")) isVideo = true;
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
                      src={decrypted as string}
                      alt="Sent media"
                      className="max-w-xs max-h-60 rounded-lg object-cover"
                    />
                  ) : isVideo ? (
                    <video
                      src={decrypted as string}
                      controls
                      className="max-w-xs max-h-60 rounded-lg"
                    />
                  ) : (
                    <span>{decrypted}</span>
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
