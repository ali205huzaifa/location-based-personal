import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import sodium from "libsodium-wrappers-sumo";
import { decryptMessage } from "../../util/Decryption";
import { encryptForChat } from "../../util/Encryption";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Spin, message } from "antd";
import { MediaType } from "./chat-enum";
import AddPostAPI from "../../api/addPostApi/AddPostAPI";
import GroupInfoDrawer from "./GroupInfoDrawer";

interface ChatMember {
  _id: string;
  fullName: string;
  username: string;
  userPublicKey: string;
}

interface GroupKey {
  _id: string;
  keyId: string;
  active: boolean;
  createdAt: string;
  createdBy: string;
}

interface Chat {
  _id: string;
  type: string;
  members: ChatMember[];
  messages?: Message[];
  keyId?: GroupKey[];
  name?: string;
  description?: string;
  GroupName?: string;
  image?: string;
}

interface MediaItem {
  url: string;
  type: string;
  _id?: string;
  publicId?: string;
}

interface Message {
  _id: string;
  sender: string;
  senderName?: string;
  senderUsername?: string;
  content: string;
  createdAt: string;
  media?: MediaItem[];
  image?: string;
}

interface GroupChatWindowProps {
  chatId: string | null;
  isExistingChat: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL;
export default function GroupChatWindow({ chatId }: GroupChatWindowProps) {
  const token = localStorage.getItem("token");
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processedMessageIdsRef = useRef<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!token) return;
    const s = io(API_BASE, { transports: ["websocket"], auth: { token } });
    socketRef.current = s;
    // s.onAny((ev, ...args) => console.debug("socket event", ev, args));
    return () => {
      s.removeAllListeners();
      s.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  useEffect(() => {
    (async () => {
      await sodium.ready;
      // console.debug("sodium ready (sumo)");
    })();
  }, []);

  useEffect(() => {
    if (!chatId || !token) return;

    setLoading(true);
    setMessages([]);
    setOffset(0);
    setHasMore(true);

    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat/${chatId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: any = await res.json();

        setActiveChat(data.chat ?? null);
        setMembers(Array.isArray(data.members) ? data.members : []);

        const decrypted = await Promise.all(
          (data.data ?? []).map((m: any) => processMessage(m, data))
        );

        const cleaned = decrypted.filter(Boolean) as Message[];
        setMessages(cleaned);
        setOffset((data.offset ?? 0) + (data.limit ?? cleaned.length));
        setHasMore(Boolean(data.nextPage));
      } catch (err) {
        console.error("GROUP-ERROR fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();

    if (socketRef.current) {
      socketRef.current.emit("joinChat", chatId);
    }
  }, [chatId, token]);

  const getMyGroupSymKey = async (
    chatId: string,
    keyId: string
  ): Promise<Uint8Array | null> => {
    const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
    if (!myPrivateKeyBase64) return null;

    try {
      const res = await fetch(
        `${API_BASE}/chat/group/${chatId}/myGroupKey?keyId=${keyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(`myGroupKey fetch failed: ${res.status}`);

      const data = await res.json();
      const keyData = data?.data;
      if (!keyData) throw new Error("myGroupKey response empty");

      const symKey = sodium.crypto_box_open_easy(
        sodium.from_base64(keyData.ciphertext, sodium.base64_variants.ORIGINAL),
        sodium.from_base64(keyData.nonce, sodium.base64_variants.ORIGINAL),
        sodium.from_base64(
          keyData.ephemeralPub,
          sodium.base64_variants.ORIGINAL
        ),
        sodium.from_base64(myPrivateKeyBase64, sodium.base64_variants.ORIGINAL)
      );

      return symKey;
    } catch (err) {
      return null;
    }
  };

  const decryptGroupMessage = async (
    msg: any,
    chatId: string,
    keyId: string | undefined
  ): Promise<string> => {
    if (!keyId) return "[Missing keyId]";

    const groupSymKey = await getMyGroupSymKey(chatId, keyId);
    if (!groupSymKey) return "[Key decrypt failed]";

    try {
      const userIdStr = String(user?._id);
      const cipherBase64 = msg.groupCiphertext?.ciphertexts?.[userIdStr];
      const nonceBase64 = msg.groupNonce?.nonces?.[userIdStr];

      if (!cipherBase64 || !nonceBase64) {
        return "[Missing cipher/nonce]";
      }

      const cipher = sodium.from_base64(
        cipherBase64,
        sodium.base64_variants.ORIGINAL
      );
      const nonce = sodium.from_base64(
        nonceBase64,
        sodium.base64_variants.ORIGINAL
      );
      const plain = sodium.crypto_secretbox_open_easy(
        cipher,
        nonce,
        groupSymKey
      );

      return new TextDecoder().decode(plain);
    } catch (err) {
      return "Message UnAvailable";
    } finally {
      if (sodium.memzero) sodium.memzero(groupSymKey);
    }
  };

  const processMessage = async (
    msg: any,
    chatData: any
  ): Promise<Message | null> => {
    try {
      const sender = msg.senderId || msg.sender;
      if (!sender?._id) {
        console.warn("[GROUP] Missing sender:", msg);
        return null;
      }

      if (Array.isArray(msg.media) && msg.media.length > 0) {
        return {
          _id: msg._id,
          sender: sender._id,
          senderName: sender.fullName,
          senderUsername: sender.username,
          content: "",
          media: msg.media.map((m: any) => ({
            url: m.url,
            type: m.type,
            _id: m._id,
            publicId: m.publicId,
          })),
          createdAt: msg.createdAt,
        };
      }

      let content = "Message Unavailable";

      const isGroupMessage =
        !!msg.groupCiphertext &&
        !!msg.groupCiphertext.keyId &&
        !!msg.groupCiphertext.ciphertexts;

      if (isGroupMessage) {
        const keyId = msg.groupCiphertext.keyId;

        if (!keyId) {
          console.warn("[GROUP] Missing keyId on message:", msg._id);
          return null;
        }

        content = await decryptGroupMessage(msg, chatData?.chat?._id, keyId);
      } else {
        const isSender = String(sender._id) === String(user?._id);

        content = await decryptMessage(
          isSender ? msg.ciphertext?.forSender : msg.ciphertext?.forRecipient,
          isSender ? msg.nonce?.forSender : msg.nonce?.forRecipient,
          sender.userPublicKey,
          myPrivateKeyBase64 ?? "",
          msg._id
        );
      }

      return {
        _id: msg._id,
        sender: sender._id,
        senderName: sender.fullName,
        senderUsername: sender.username,
        image: sender.image,
        content,
        createdAt: msg.createdAt,
      };
    } catch (err) {
      console.error("[GROUP][MAP-ERROR]", err);
      return null;
    }
  };

  const loadMoreMessages = async (chatId: string) => {
    try {
      const res = await fetch(`${API_BASE}/chat/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const decrypted = await Promise.all(
        (data.data ?? []).map((m: any) => processMessage(m, data))
      );
      const cleaned = decrypted.filter(Boolean) as Message[];
      setMessages((prev) => [...cleaned, ...prev]);

      setOffset((data.offset ?? 0) + (data.limit ?? cleaned.length));
      setHasMore(Boolean(data.nextPage));
    } catch (err) {
      console.error("GROUP-ERROR loadMoreMessages", err);
    }
  };

  const sendMessage = async () => {
    if (!activeChat || !newMessage.trim() || !user) return;

    const isGroupChat = activeChat.type?.toLowerCase() === "group";
    const receivers = members.filter((m: any) => m._id !== user._id);
    if (receivers.length === 0) return;

    try {
      if (isGroupChat) {
        const activeGroupKey = activeChat.keyId?.find((k) => k.active === true);

        if (!activeGroupKey) {
          alert("No active group key found");
          return;
        }

        const keyId = activeGroupKey.keyId;

        const groupSymKey = await getMyGroupSymKey(activeChat._id, keyId);
        if (!groupSymKey) {
          alert("Failed to get group key");
          return;
        }

        const msgBytes = new TextEncoder().encode(newMessage);

        const ciphertexts: Record<string, string> = {};
        const nonces: Record<string, string> = {};

        const allMembers = [user, ...receivers];

        for (const member of allMembers) {
          if (!member._id) continue;

          const nonce = sodium.randombytes_buf(
            sodium.crypto_secretbox_NONCEBYTES
          );

          const ct = sodium.crypto_secretbox_easy(msgBytes, nonce, groupSymKey);

          ciphertexts[member._id] = sodium.to_base64(
            ct,
            sodium.base64_variants.ORIGINAL
          );

          nonces[member._id] = sodium.to_base64(
            nonce,
            sodium.base64_variants.ORIGINAL
          );
        }

        socketRef.current?.emit("sendMessage", {
          chatId: activeChat._id,
          senderId: user._id,
          groupCiphertext: {
            keyId,
            ciphertexts,
          },
          groupNonce: {
            nonces,
          },
        });

        if (sodium.memzero) sodium.memzero(groupSymKey);
        setNewMessage("");
      } else {
        const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
        const myPublicKeyBase64 = localStorage.getItem("publicKey")?.trim();
        if (!myPrivateKeyBase64 || !myPublicKeyBase64) return;

        for (const r of receivers) {
          const encrypted = await encryptForChat({
            message: newMessage,
            myPrivateKeyBase64,
            myPublicKeyBase64,
            receiverPublicKeyBase64: r.userPublicKey,
          });
          socketRef.current?.emit("sendMessage", {
            chatId: activeChat._id,
            ciphertext: encrypted.ciphertext,
            nonce: encrypted.nonce,
          });
        }
        setNewMessage("");
      }
    } catch (err) {
      console.error("GROUP-ERROR: sendMessage failed", err);
    }
  };

  useEffect(() => {
    if (!socketRef.current) return;
    const s = socketRef.current;

    const pendingMessagesRef = { current: [] as any[] };

    const getMyGroupSymKey = async (
      chatId: string,
      keyId: string
    ): Promise<Uint8Array | null> => {
      const myPrivateKeyBase64 = localStorage.getItem("privateKey")?.trim();
      if (!myPrivateKeyBase64) return null;

      try {
        const res = await fetch(
          `${API_BASE}/chat/group/${chatId}/myGroupKey?keyId=${keyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`myGroupKey fetch failed: ${res.status}`);

        const data = await res.json();
        const keyData = data?.data;
        if (!keyData) throw new Error("myGroupKey response empty");

        const ephemeralPub = sodium.from_base64(
          keyData.ephemeralPub,
          sodium.base64_variants.ORIGINAL
        );
        const ciphertext = sodium.from_base64(
          keyData.ciphertext,
          sodium.base64_variants.ORIGINAL
        );
        const nonce = sodium.from_base64(
          keyData.nonce,
          sodium.base64_variants.ORIGINAL
        );
        const myPrivKey = sodium.from_base64(
          myPrivateKeyBase64,
          sodium.base64_variants.ORIGINAL
        );

        const sharedKey = sodium.crypto_box_beforenm(ephemeralPub, myPrivKey);
        const symKey = sodium.crypto_box_open_easy_afternm(
          ciphertext,
          nonce,
          sharedKey
        );

        return symKey;
      } catch (err) {
        console.error("getMyGroupSymKey error", err);
        return null;
      }
    };

    const commitMessage = (newMsg: Message) => {
      processedMessageIdsRef.current.add(newMsg._id);

      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });

      setActiveChat((prev) =>
        prev
          ? {
              ...prev,
              messages: prev.messages?.some((m) => m._id === newMsg._id)
                ? prev.messages
                : [...(prev.messages || []), newMsg],
            }
          : prev
      );

      requestAnimationFrame(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
        });
      });
    };

    const decryptAndAddMessage = async (messageData: any) => {
      const chatId = messageData.chatId;
      let content = "Message UnAvailable";
      const isGroup = messageData.chat?.type?.toLowerCase() === "group";
      const uid = String(user?._id);

      try {
        if (Array.isArray(messageData.media) && messageData.media.length > 0) {
          const newMsg: Message = {
            _id: messageData._id,
            sender: messageData.senderId,
            senderName: messageData.sender?.fullName,
            senderUsername: messageData.sender?.username,
            content: "",
            media: messageData.media.map((m: any) => ({
              url: m.url,
              type: m.type,
              _id: m._id,
              publicId: m.publicId,
            })),
            createdAt: messageData.createdAt,
          };

          commitMessage(newMsg);
          return;
        }

        if (isGroup) {
          const keyId = messageData.groupCiphertext?.keyId;
          if (!keyId) return;

          let retries = 3;
          let groupSymKey: Uint8Array | null = null;

          while (retries > 0) {
            groupSymKey = await getMyGroupSymKey(chatId, keyId);
            if (groupSymKey) break;
            await new Promise((r) => setTimeout(r, 500));
            retries--;
          }

          if (!groupSymKey) {
            pendingMessagesRef.current.push(messageData);
            return;
          }

          const cipherBase64 = messageData.groupCiphertext?.ciphertexts?.[uid];
          const nonceBase64 = messageData.groupNonce?.nonces?.[uid];

          if (!cipherBase64 || !nonceBase64) content = "Message UnAvailable";
          else {
            try {
              const cipher = sodium.from_base64(
                cipherBase64,
                sodium.base64_variants.ORIGINAL
              );
              const nonce = sodium.from_base64(
                nonceBase64,
                sodium.base64_variants.ORIGINAL
              );
              const plain = sodium.crypto_secretbox_open_easy(
                cipher,
                nonce,
                groupSymKey
              );
              content = new TextDecoder().decode(plain);
            } catch {
              content = "Message UnAvailable";
            }
          }

          if (sodium.memzero) sodium.memzero(groupSymKey);
        } else {
          content = await decryptMessage(
            uid
              ? messageData.ciphertext?.forSender
              : messageData.ciphertext?.forRecipient,
            uid
              ? messageData.nonce?.forSender
              : messageData.nonce?.forRecipient,
            messageData.sender?.userPublicKey,
            myPrivateKeyBase64 ?? "",
            messageData._id
          );
        }

        const newMsg: Message = {
          _id: messageData._id,
          sender: messageData.senderId,
          senderName: messageData.sender?.fullName,
          senderUsername: messageData.sender?.username,
          image: messageData.sender?.image,
          content,
          createdAt: messageData.createdAt,
        };

        commitMessage(newMsg);
      } catch (err) {
        console.error("decryptAndAddMessage error", err);
      }
    };

    const handleNewMessage = async (msg: any) => {
      if (!msg) return;

      const messageData = msg.data;
      if (!activeChat || String(messageData.chatId) !== String(activeChat._id))
        return;

      // Skip media messages sent by the current user - they're already added via sendMediaMessage
      const isFromCurrentUser =
        messageData.senderId === user?._id ||
        messageData.sender?._id === user?._id;
      const isMediaMessage =
        Array.isArray(messageData.media) && messageData.media.length > 0;

      if (isFromCurrentUser && isMediaMessage) return;

      await decryptAndAddMessage(messageData);
    };

    s.on("newMessage", handleNewMessage);

    const interval = setInterval(async () => {
      if (pendingMessagesRef.current.length === 0) return;
      const pending = [...pendingMessagesRef.current];
      pendingMessagesRef.current = [];
      for (const msg of pending) {
        await decryptAndAddMessage(msg);
      }
    }, 2000);

    return () => {
      s.off("newMessage", handleNewMessage);
      clearInterval(interval);
    };
  }, [user?._id, myPrivateKeyBase64, members, activeChat]);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const sendMediaMessage = async (
    mediaUrl: string,
    mediaType: MediaType,
    publicId?: string
  ) => {
    if (!activeChat || !user?._id) return;

    const media = [
      {
        url: mediaUrl,
        type: mediaType,
        publicId,
      },
    ];

    socketRef.current?.emit("sendMessage", {
      chatId: activeChat._id,
      media,
    });

    const localMsg: Message = {
      _id: `local-${Date.now()}`,
      sender: user._id,
      senderName: user.fullName,
      senderUsername: user.username,
      content: "",
      media,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, localMsg]);
    setActiveChat((prev: any) =>
      prev ? { ...prev, messages: [...(prev.messages || []), localMsg] } : prev
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeChat || !user?._id) return;

    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      message.error("Only PNG, JPEG/JPG, or MP4 files are allowed.");
      e.target.value = "";
      return;
    }

    try {
      const uploadRes = await AddPostAPI.multiUploadMedia([file]);
      const media = Array.isArray(uploadRes?.data) ? uploadRes.data[0] : null;

      if (!media?.url) {
        message.error("Upload failed — no URL returned!");
        return;
      }

      let mediaType: MediaType;

      if (file.type.startsWith("image")) mediaType = MediaType.IMAGE;
      else if (file.type.startsWith("video")) mediaType = MediaType.VIDEO;
      else if (file.type.startsWith("audio")) mediaType = MediaType.AUDIO;
      else mediaType = MediaType.OTHER;

      await sendMediaMessage(media.url, mediaType, media.publicId);
    } catch (error) {
      console.error("MEDIA UPLOAD ERROR:", error);
      message.error("Failed to upload media.");
    } finally {
      e.target.value = "";
    }
  };

  if (!chatId)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
        Select a group to start messaging
      </div>
    );

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );

  const isGroup = activeChat?.type?.toLowerCase() === "group";

  const groupName = isGroup ? activeChat?.GroupName ?? "Group" : "Chat";
  const groupImage = isGroup
    ? activeChat?.image || "/images/default-chat-profile.svg"
    : "";

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-xl ml-4 mr-4 mb-4">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <img
            src={groupImage}
            alt="image"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="text-black text-base font-normal">{groupName}</h3>
            <p className="text-[#666666] text-sm font-normal">
              {members.length ? `${members.length} members` : "Group"}
            </p>
          </div>
        </div>

        <div
          onClick={() => setOpen(true)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 cursor-pointer border border-gray-200"
        >
          <img src="/icons/dots-icon.svg" alt="edit" className="w-5 h-5" />
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 no-scrollbar"
        ref={containerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollTop <= 0 && hasMore) {
            loadMoreMessages(chatId);
          }
        }}
      >
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isMine = msg.senderName === user?.fullName;
            const avatarSrc = isMine ? user?.image : msg.image;

            return (
              <div
                key={msg._id}
                className={`flex gap-2 mt-2 ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                {!isMine && (
                  <img
                    src={avatarSrc || "/avatar-placeholder.png"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}

                <div
                  className={`flex flex-col ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`p-3 max-w-md ${
                      isMine
                        ? "bg-[#8869F3] text-white rounded-2xl rounded-br-none"
                        : "bg-zinc-100 text-black rounded-2xl rounded-bl-none"
                    }`}
                  >
                    <div className="text-sm font-normal mb-1">
                      {isMine ? "You" : msg.senderName ?? "Unknown"}
                    </div>

                    {msg.media && msg.media.length > 0 && (
                      <div className="flex flex-col gap-2 mb-2">
                        {msg.media.map((media) => {
                          if (media.type === "image") {
                            return (
                              <img
                                key={media._id}
                                src={media.url}
                                alt="message-media"
                                className="max-w-xs rounded-lg object-cover cursor-pointer"
                                onClick={() => window.open(media.url, "_blank")}
                              />
                            );
                          }

                          if (media.type === "video") {
                            return (
                              <video
                                key={media._id}
                                src={media.url}
                                controls
                                className="max-w-xs rounded-lg"
                              />
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}

                    {msg.content && (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>

                  <div className="text-stone-500 text-xs font-light mt-1">
                    {msg.createdAt &&
                      new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                  </div>
                </div>

                {isMine && (
                  <img
                    src={avatarSrc || "/avatar-placeholder.png"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        )}
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
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="w-full h-12 border rounded-xl pl-12 pr-16 py-2 placeholder:text-[#C3C3C3] text-xs font-normal text-gray-800 !outline-[#8869F3]"
          />
          <button
            onClick={sendMessage}
            className="absolute inset-y-0 right-4 text-[#8869F3] text-base font-medium cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>

      {activeChat && (
        <GroupInfoDrawer
          open={open}
          onClose={() => setOpen(false)}
          chat={activeChat}
          chatId={chatId}
          GroupMembers={members}
        />
      )}
    </div>
  );
}
