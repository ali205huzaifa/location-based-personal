import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import NewGroupModal from "./NewGroupModal";
import GroupDetailsModal from "./GroupDetailsModal";

const ChatLayout: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isExistingChat, setIsExistingChat] = useState<boolean>(false);

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
        onSelectChat={(id, isChat) => {
          setSelectedChatId(id);
          setIsExistingChat(isChat);
        }}
        onOpenNewGroup={() => setIsNewGroupOpen(true)}
        refreshChats={refreshChats}
      />

      <ChatWindow
        selectedChatId={selectedChatId}
        isExistingChat={isExistingChat}
      />

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
