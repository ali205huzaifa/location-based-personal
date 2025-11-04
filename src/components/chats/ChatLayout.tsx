import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import NewGroupModal from "./NewGroupModal";
import GroupDetailsModal from "./GroupDetailsModal";

const ChatLayout: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const handleNext = (members: number[]) => {
    setSelectedMembers(members);
    setIsNewGroupOpen(false);
    setIsGroupDetailsOpen(true);
  };

  const handleCreateGroup = (group: { name: string; desc: string; image?: string }) => {
    console.log("New Group Created:", group, "Members:", selectedMembers);
    setIsGroupDetailsOpen(false);
  };

  return (
  <div className="flex w-full h-full">
    <ChatList
      selectedChatId={selectedChatId}
      onSelectChat={setSelectedChatId}
      onOpenNewGroup={() => setIsNewGroupOpen(true)}
    />
    <ChatWindow selectedChatId={selectedChatId} />

    <NewGroupModal
      open={isNewGroupOpen}
      onClose={() => setIsNewGroupOpen(false)}
      onNext={handleNext}
    />

    <GroupDetailsModal
      open={isGroupDetailsOpen}
      onClose={() => setIsGroupDetailsOpen(false)}
      onCreate={handleCreateGroup}
    />
  </div>
  );
};

export default ChatLayout;
