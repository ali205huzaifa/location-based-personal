import { Button, Modal, Drawer, Avatar, Input, Dropdown, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import ChatAPI from "../../api/chatApi/ChatAPI";

interface GroupMember {
  _id: string;
  fullName: string;
  username: string;
  image?: string;
  role: "admin" | "member";
}

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
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const members = Array.isArray(GroupMembers) ? GroupMembers : [];

  const isCurrentUserAdmin = members.some(
    (m) => m.username === user?.username && m.role === "admin"
  );

  const handleRemove = async () => {
    if (!chat?._id) return;

    try {
      setLoading(true);

      await ChatAPI.leaveGroupChat(chat._id);

      message.success("You have left the group");

      setLeaveModalVisible(false);
      onClose();
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to leave group");
    } finally {
      setLoading(false);
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
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-5">
          <div className="flex items-left gap-4">
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

          <div className="mt-4 rounded-xl border border-[#E8E6E6] p-3 text-sm text-gray-700">
            {chat.description ||
              "Connect, share updates, and plan meetups around the city. Keep it friendly and fun!"}
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-black text-base font-medium">
              {members.length} Members
            </h3>
            {isCurrentUserAdmin && (
              <UserAddOutlined className="w-6 h-6 text-lg text-[#8869F3] cursor-pointer" />
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

          <div className="space-y-4">
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
                          { key: "remove", label: "Remove from group" },
                          { key: "make-admin", label: "Make admin" },
                        ],
                      }}
                    >
                      <img
                        src="/icons/dots-icon.svg"
                        alt="edit"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </Dropdown>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-4 py-5 mt-6">
        <button
          className="flex items-center p-4 gap-4 cursor-pointer"
          onClick={() => setLeaveModalVisible(true)}
        >
          <img src="/icons/logout-icon.svg" alt="edit" className="w-5 h-6" />
          <p className="!text-[#FF5D5D] text-base font-normal">Leave Group</p>
        </button>

        {isCurrentUserAdmin && (
          <button className="flex items-center p-4 gap-4 cursor-pointer">
            <img src="/icons/delete-icon.svg" alt="edit" className="w-5 h-6" />
            <p className="!text-[#FF5D5D] text-base font-normal">
              Delete Group
            </p>
          </button>
        )}
      </div>
      <Modal
        centered
        open={leaveModalVisible}
        onCancel={() => setLeaveModalVisible(false)}
        closable={false}
        width={392}
        footer={
          <div className="flex gap-3">
            <Button
              key="delete"
              type="primary"
              danger
              loading={loading}
              onClick={handleRemove}
              className="flex-1 !h-10 !bg-[#FF5D5D] rounded-xl"
            >
              Yes, Leave
            </Button>
            <Button
              key="close"
              onClick={() => setLeaveModalVisible(false)}
              className="flex-1 !h-10 rounded-xl !text-[#666666] !border !border-[#E8E6E6]"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <img src="/icons/delete-icon.svg" alt="Icon" className="w-12 h-12" />
          <span className="text-center text-base font-medium px-8">
            Are you sure you want to leave this Group Chat?
          </span>
        </div>
      </Modal>
    </Drawer>
  );
};

export default GroupInfoDrawer;
