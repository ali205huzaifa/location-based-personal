import { Button, Modal, Drawer, Avatar, Input, Dropdown, message } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import ChatAPI from "../../api/chatApi/ChatAPI";
import AddGroupMembersModal from "./AddGroupMembersModal";
import GroupDetailsModal from "./GroupDetailsModal";

interface GroupMember {
  _id: string;
  fullName: string;
  username: string;
  image?: string;
  role: "admin" | "member";
}

type ConfirmAction = "leave" | "delete" | "remove" | "make" | null;

interface GroupInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  chatId: string | null;
  chat: {
    _id: string;
    name?: string;
    GroupName?: string;
    description?: string;
    image?: string;
  } | null;
  GroupMembers: GroupMember[];
}

const GroupInfoDrawer: React.FC<GroupInfoDrawerProps> = ({
  open,
  onClose,
  chat,
  GroupMembers,
}) => {
  if (!chat) return null;
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    null
  );
  const [addMembersOpen, setAddMembersOpen] = useState(false);

  const members = Array.isArray(GroupMembers) ? GroupMembers : [];

  const isCurrentUserAdmin = members.some(
    (m) => m.username === user?.username && m.role === "admin"
  );

  const confirmTextMap: Record<Exclude<ConfirmAction, null>, string> = {
    leave: "Are you sure you want to leave this Group Chat?",
    delete: "Are you sure you want to delete this Group Chat?",
    remove: "Are you sure you want to remove this member?",
    make: "Are you sure you want to make this member Admin?",
  };

  const confirmButtonTextMap: Record<Exclude<ConfirmAction, null>, string> = {
    leave: "Yes, Leave",
    delete: "Yes, Delete",
    remove: "Yes, Remove",
    make: "Yes, Make Admin",
  };

  const handleConfirm = async () => {
    if (!chat?._id) return;

    try {
      setLoading(true);

      if (confirmAction === "leave") {
        const res = await ChatAPI.leaveGroupChat(chat._id);
        message.success(res?.data?.message || "Task successful");
        onClose();
      }

      if (confirmAction === "delete") {
        const res = await ChatAPI.deleteGroupChat(chat._id);
        message.success(res?.data?.message || "Task successful");
        window.location.reload();
      }

      if (confirmAction === "remove" && selectedMember) {
        const res = await ChatAPI.removeGroupMember(
          chat._id,
          selectedMember._id
        );
        message.success(res?.data?.message || "Task successful");
      }

      if (confirmAction === "make" && selectedMember) {
        const res = await ChatAPI.makeGroupAdmin(chat._id, selectedMember._id);
        message.success(
          res?.data?.message || `${selectedMember.fullName} is now an Admin`
        );
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
      setConfirmAction(null);
      setSelectedMember(null);
    }
  };

  return (
    <Drawer
      title={<span className="text-base font-medium">Details</span>}
      placement="right"
      width={360}
      open={open}
      onClose={onClose}
      closable={false}
      bodyStyle={{
        padding: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 pt-5 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar
                size={72}
                src={chat.image || "/images/default-chat-profile.svg"}
              />

              <div className="text-left">
                <h2 className="text-black text-base font-medium">
                  {chat.GroupName || chat.name || "Group"}
                </h2>
                <p className="text-[#666666] text-sm font-normal">
                  Members ({members.length})
                </p>
              </div>
            </div>

            {isCurrentUserAdmin && (
              <img
                src="/icons/edit-icon.svg"
                alt="edit"
                className="w-4 h-4 cursor-pointer mt-6 mr-2"
                onClick={() => setEditOpen(true)}
              />
            )}
          </div>

          <div className="mt-4 rounded-xl border border-[#E8E6E6] p-3 text-sm text-gray-700">
            {chat.description ||
              "Connect, share updates, and plan meetups around the city. Keep it friendly and fun!"}
          </div>
        </div>

        <div className="px-4 mt-6 flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-black text-base font-medium">
              {members.length} Members
            </h3>
            {isCurrentUserAdmin && (
              <div className="flex justify-center p-1 w-16 hover:bg-[#EFEFEF] hover:rounded-xl cursor-pointer">
                <img
                  src="/icons/userAdd-icon.svg"
                  alt="Icon"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => setAddMembersOpen(true)}
                />
              </div>
            )}
          </div>

          <Input
            placeholder="Search"
            prefix={
              <img
                src="/icons/search-icon.svg"
                alt="Search"
                className="w-6 h-6 mr-2"
              />
            }
            className="h-12 rounded-xl mb-4 placeholder:text-neutral-400 text-sm font-light"
          />

          <div className="flex-1 overflow-y-auto space-y-4 pb-4 px-2 custom-scrollbar">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Avatar
                    className="mr-3"
                    src={member.image ? member.image : undefined}
                  >
                    {!member.image &&
                      (member.fullName?.[0]?.toUpperCase() || "U")}
                  </Avatar>

                  <div>
                    <p className="text-black text-base font-normal">
                      {member.fullName === user?.fullName
                        ? "You"
                        : member.fullName}
                    </p>

                    <p className="text-stone-500 text-sm font-normal">
                      @{member.username}
                    </p>
                  </div>
                </div>

                {member.role === "admin" ? (
                  <span className="text-xs text-gray-400 font-medium">
                    Admin
                  </span>
                ) : (
                  isCurrentUserAdmin && (
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: [
                          {
                            key: "make-admin",
                            label: (
                              <div className="flex items-center gap-2 py-1">
                                <img
                                  src="/icons/admin-icon.svg"
                                  className="w-4 h-4 mr-2"
                                  alt="admin"
                                />
                                Make Admin
                              </div>
                            ),
                            onClick: () => {
                              setSelectedMember(member);
                              setConfirmAction("make");
                            },
                          },
                          {
                            key: "remove",
                            label: (
                              <div className="flex items-center gap-2 py-1">
                                <img
                                  src="/icons/remove-icon.svg"
                                  className="w-4 h-4 mr-2"
                                  alt="remove"
                                />
                                Remove Member
                              </div>
                            ),
                            onClick: () => {
                              setSelectedMember(member);
                              setConfirmAction("remove");
                            },
                          },
                        ],
                      }}
                    >
                      <img
                        src="/icons/dots-icon.svg"
                        className="w-5 h-5 cursor-pointer"
                        alt="menu"
                      />
                    </Dropdown>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-5">
        <button
          className="flex items-center p-4 gap-4 hover:bg-[#EFEFEF] w-full hover:rounded-xl"
          onClick={() => setConfirmAction("leave")}
        >
          <img src="/icons/logout-icon.svg" className="w-5 h-6" />
          <p className="text-[#FF5D5D]">Leave Group</p>
        </button>

        {isCurrentUserAdmin && (
          <button
            className="flex items-center p-4 gap-4 hover:bg-[#EFEFEF] w-full hover:rounded-xl"
            onClick={() => setConfirmAction("delete")}
          >
            <img src="/icons/delete-icon.svg" className="w-5 h-6" />
            <p className="text-[#FF5D5D]">Delete Group</p>
          </button>
        )}
      </div>

      <Modal
        centered
        open={!!confirmAction}
        closable={false}
        onCancel={() => setConfirmAction(null)}
        width={392}
        footer={
          <div className="flex gap-3">
            <Button
              type="primary"
              loading={loading}
              onClick={handleConfirm}
              className={`flex-1 !h-[42px] rounded-xl ${
                confirmAction === "make" ? "!bg-[#166C3B]" : "!bg-[#FF5D5D]"
              }`}
            >
              {confirmAction && confirmButtonTextMap[confirmAction]}
            </Button>

            <Button
              onClick={() => setConfirmAction(null)}
              className="flex-1 !h-[42px] rounded-xl !text-[#666666] !border-[#666666]"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <span className="text-center text-base font-medium px-8">
            {confirmAction && confirmTextMap[confirmAction]}
          </span>
        </div>
      </Modal>

      <AddGroupMembersModal
        visible={addMembersOpen}
        onClose={() => setAddMembersOpen(false)}
        chatId={chat?._id}
      />

      <GroupDetailsModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        chatId={chat._id}
        initialData={{
          name: chat.GroupName || chat.name,
          description: chat.description,
          image: chat.image,
        }}
      />
    </Drawer>
  );
};

export default GroupInfoDrawer;
