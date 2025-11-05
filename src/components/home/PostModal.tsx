import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input } from "antd";
import SharePostModal from "./SharePostModal";
import ReportPostModal from "./ReportPostModal";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  post: any | null;
}

const PostModal: React.FC<PostModalProps> = ({ visible, onClose, post }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const navigate = useNavigate();

  if (!post) return null;

  const user = post.user || {};
  const media = post.media?.[0]?.url || "https://via.placeholder.com/800x600";
  const likes = post.interaction?.likeCount || 0;
  const comments = post.interaction?.commentCount || 0;
  const caption = post.content || "";
  const location =
    post.metadata?.publisherName || post.user?.fullName || "Unknown Location";

  const handleProfileClick = () => {
    navigate(`/othersProfile/${user.username || "unknown"}`);
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="100%"
      className="
        [&_.ant-modal-content]:!p-0
        [&_.ant-modal-content]:!max-w-[1242px]
        [&_.ant-modal-content]:!max-h-[1067px]
        [&_.ant-modal-content]:!overflow-hidden
        [&_.ant-modal-content]:rounded-3xl 
        [&_.ant-modal-content]:!mx-auto
      "
      closeIcon={null}
    >
      <div className="flex flex-row bg-white rounded-2xl overflow-hidden">
        <div className="flex-1">
          <img
            src={media}
            alt="post"
            className="bg-top bg-no-repeat bg-contain w-full h-full"
          />
        </div>

        <div className="xl:w-[533px] md:w-[360px] lg:w-[450px] h-[850px] flex flex-col justify-between border-l border-gray-100 py-4">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 px-4">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={handleProfileClick}
              >
                <img
                  src={user.profileImage || "https://i.pravatar.cc/40"}
                  alt="profile"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {user.fullName || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 cursor-pointer">
                <img
                  src="/icons/AddUser-icon.svg"
                  alt="Add to contact"
                  className="w-5 h-5"
                />
                <span className="text-sm text-blue-600 font-medium">
                  Add to contact
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 p-4">
              <div className="flex">
                <img
                  src={user.profileImage || "https://i.pravatar.cc/40"}
                  alt="profile"
                  className="rounded-full w-10 h-10 mt-1"
                />
                <div className="pl-2">
                  <p className="font-semibold text-gray-800">
                    {user.fullName || user.username}
                  </p>
                  <p className="text-gray-800 text-sm">{caption}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">{location}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <img
                        src="/icons/globe-icon.svg"
                        alt="Public"
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {Array.isArray(post.comments) && post.comments.length > 0 ? (
                post.comments.map((c: any, idx: number) => (
                  <div key={idx}>
                    <p className="text-sm">
                      <span className="font-semibold">{c.user?.username}</span>{" "}
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No comments yet...
                </p>
              )}
            </div>
          </div>

          <div className="px-4 pb-0 space-y-3">
            <div className="flex items-center justify-between text-gray-600 text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <img
                    src="/icons/heart-icon.svg"
                    alt="Likes"
                    className="w-4 h-4 mr-1"
                  />
                  {likes}
                </span>

                <span className="flex items-center">
                  <img
                    src="/icons/comment-icon.svg"
                    alt="Comments"
                    className="w-4 h-4 mr-1"
                  />
                  {comments}
                </span>

                <span
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center cursor-pointer"
                >
                  <img
                    src="/icons/share-icon.svg"
                    alt="Share"
                    className="w-4 h-4 mr-1"
                  />
                  {post.shares || 0}
                </span>
              </div>

              <span
                onClick={() => setIsReportOpen(true)}
                className="flex items-center cursor-pointer"
              >
                <img
                  src="/icons/report-icon.svg"
                  alt="Report"
                  className="w-4 h-4 mr-1 text-red-500"
                />
              </span>
            </div>

            <Input
              placeholder="Add a comment..."
              suffix={
                <span className="text-purple-600 font-medium cursor-pointer">
                  Submit
                </span>
              }
              className="rounded-xl py-1 px-3 h-12"
            />
          </div>
        </div>

        <SharePostModal
          visible={isShareOpen}
          onClose={() => setIsShareOpen(false)}
        />
        <ReportPostModal
          visible={isReportOpen}
          onClose={() => setIsReportOpen(false)}
        />
      </div>
    </Modal>
  );
};

export default PostModal;
