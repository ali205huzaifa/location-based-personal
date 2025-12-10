import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import NewGroupModal from "./NewGroupModal";
import GroupDetailsModal from "./GroupDetailsModal";
import GroupChatWindow from "./GroupChatWindow";

const ChatLayout: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isExistingChat, setIsExistingChat] = useState<boolean>(false);
  const [chatType, setChatType] = useState<"direct" | "Group">("direct");

  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [refreshChats, setRefreshChats] = useState(false);

  const handleNext = (members: string[]) => {
    setSelectedMembers(members);
    setIsNewGroupOpen(false);
    setIsGroupDetailsOpen(true);
  };

  const handleGroupCreated = () => {
    setIsGroupDetailsOpen(false);
    setRefreshChats((prev) => !prev);
  };

  return (
    <div className="flex w-full h-full">
      <ChatList
        selectedChatId={selectedChatId}
        onSelectChat={(id, isChat, type) => {
          setSelectedChatId(id);
          setIsExistingChat(isChat);
          setChatType(type);
        }}
        onOpenNewGroup={() => setIsNewGroupOpen(true)}
        refreshChats={refreshChats}
      />

      {chatType === "direct" ? (
        <ChatWindow
          selectedChatId={selectedChatId}
          isExistingChat={isExistingChat}
        />
      ) : (
        <GroupChatWindow
          chatId={selectedChatId}
          isExistingChat={isExistingChat}
        />
      )}

      <NewGroupModal
        open={isNewGroupOpen}
        onClose={() => setIsNewGroupOpen(false)}
        onNext={handleNext}
      />

      <GroupDetailsModal
        open={isGroupDetailsOpen}
        onClose={() => setIsGroupDetailsOpen(false)}
        members={selectedMembers}
        onGroupCreated={handleGroupCreated}
      />
    </div>
  );
};

export default ChatLayout;
