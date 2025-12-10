import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import sodium from "libsodium-wrappers-sumo";
import { decryptMessage } from "../../util/Decryption";
import { encryptForChat } from "../../util/Encryption";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Spin } from "antd";

interface ChatMember {
  _id: string;
  fullName: string;
  username: string;
  userPublicKey: string;
}

interface Chat {
  _id: string;
  type: string;
  members: ChatMember[];
  keyId?: { keyId: string }[];
  name?: string;
  description?: string;
}

interface Message {
  _id: string;
  sender: string;
  senderName?: string;
  senderUsername?: string;
  content: string;
  createdAt: string;
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
  const myUserId = localStorage.getItem("userId") ?? "";
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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
      console.error("GROUP-ERROR: Failed to decrypt group symmetric key", {
        chatId,
        keyId,
        err,
      });
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
      console.error("[GROUP][ERROR] Secretbox decrypt failed:", err);
      return "[Decrypt failed]";
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

      //   const isSender = sender._id.toString() === user?._id;
      //   const isGroupChat =
      //     (chatData.chat?.type ?? msg.chat?.type)?.toLowerCase() === "group";

      //   console.log(
      //     `\n[GROUP] Processing msg ${msg._id}`,
      //     "Sender:",
      //     sender?.username,
      //     "IsSender:",
      //     isSender
      //   );

      let content: string;

      const keyId =
        msg.groupCiphertext?.keyId || chatData.chat?.keyVersions?.[0]?.keyId;
      content = await decryptGroupMessage(msg, chatData.chat._id, keyId);

      return {
        _id: msg._id,
        sender: sender._id,
        senderName: sender.fullName,
        senderUsername: sender.username,
        content,
        createdAt: msg.createdAt,
      };
    } catch (mapErr) {
      console.error("[GROUP][MAP-ERROR]", mapErr);
      return null;
    }
  };

  const loadMoreMessages = async (chatId: string) => {
    const res = await fetch(`${API_BASE}/chat/${chatId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  };

  const sendMessage = async () => {
    if (!activeChat || !newMessage.trim() || !user) return;

    const isGroupChat = activeChat.type?.toLowerCase() === "group";
    const receivers = members.filter((m: any) => m._id !== user._id);
    if (receivers.length === 0) return;

    try {
      if (isGroupChat) {
        const keyId = activeChat.keyId?.[0]?.keyId;
        console.log(keyId);
        if (!keyId) {
          alert("Group key not available");
          return;
        }

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
          if (!member._id) {
            console.error("Member missing _id:", member);
            continue;
          }

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

    const handleNewMessage = async (msg: any) => {
      if (!msg) return;
      try {
        const isGroup = msg.chat?.type?.toLowerCase() === "group";
        const isSender = String(msg.sender?._id) === String(myUserId);
        let content = "[Failed to decrypt]";

        if (isGroup) {
          const keyId =
            msg.groupCiphertext?.keyId || msg.chat?.keyVersions?.[0]?.keyId;
          if (!keyId) {
            content = "[Missing keyId]";
          } else {
            const groupSymKey = await getMyGroupSymKey(msg.chat._id, keyId);
            if (!groupSymKey) {
              content = "[Key decrypt failed]";
            } else {
              const uid = String(myUserId);
              const cipherBase64 = msg.groupCiphertext?.ciphertexts?.[uid];
              const nonceBase64 = msg.groupNonce?.nonces?.[uid];

              if (!cipherBase64 || !nonceBase64) {
                content = "[Missing cipher/nonce]";
              } else {
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
                } catch (e) {
                  content = "[Decrypt failed]";
                } finally {
                  if (sodium.memzero) sodium.memzero(groupSymKey);
                }
              }
            }
          }
        } else {
          content = await decryptMessage(
            isSender ? msg.ciphertext?.forSender : msg.ciphertext?.forRecipient,
            isSender ? msg.nonce?.forSender : msg.nonce?.forRecipient,
            msg.sender?.userPublicKey,
            myPrivateKeyBase64 ?? "",
            msg._id
          );
        }

        setMessages((prev) => [
          ...prev,
          {
            _id: msg._id,
            sender: msg.sender?._id,
            senderName: msg.sender?.fullName,
            senderUsername: msg.sender?.username,
            content,
            createdAt: msg.createdAt,
          },
        ]);
      } catch (err) {
        console.error("handleNewMessage error", err);
      }
    };

    s.on("newMessage", handleNewMessage);

    return () => {
      s.off("newMessage", handleNewMessage);
    };
  }, [myUserId, myPrivateKeyBase64, members]);

  //   useEffect(() => {
  //     if (!socketRef.current) return;
  //     const s = socketRef.current;

  //      const onTyping = (payload: any) => {
  //        handle typing indicators (payload: { chatId, userId, isTyping })
  //        implement UI as needed
  //        console.debug("typing", payload);
  //      };

  //      const onMessageSeen = (payload: any) => {
  //        handle seen messages update
  //         console.debug("seen", payload);
  //      };

  //      s.on("typing", onTyping);
  //      s.on("messageSeen", onMessageSeen);

  //      return () => {
  //        s.off("typing", onTyping);
  //        s.off("messageSeen", onMessageSeen);
  //     };
  //   }, []);

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

  const otherTitle =
    activeChat?.type === "group" ? (activeChat as any).name ?? "Group" : "Chat";

  return (
    <div className="flex-1 flex flex-col h-full bg-white rounded-xl ml-4 mr-4 mb-4">
      <div className="flex items-center p-4 border-b">
        <div>
          <h3 className="text-black text-base font-normal">{otherTitle}</h3>
          <p className="text-[#666666] text-sm font-normal">
            {members.length ? `${members.length} members` : "Group"}
          </p>
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
            const isMine = String(msg.sender) === String(myUserId);
            return (
              <div
                key={msg._id}
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
                  <div>
                    <div className="text-sm font-normal">
                      {msg.senderName ?? "Unknown"}{" "}
                    </div>
                    {msg.content}
                  </div>
                </div>
                <div className="text-stone-500 text-xs font-light mt-1">
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
      </div>

      <div className="p-4">
        <div className="relative w-full">
          <span
            className="absolute inset-y-0 left-3 flex items-center"
            // onClick={handleAttachmentClick}
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
    </div>
  );
}
