import React, { useState } from "react";
import { Modal, Input } from "antd";
import SharePostModal from "../home/SharePostModal";
import ReportPostModal from "../home/ReportPostModal";


interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  post: {
    image?: string;
    caption?: string;
    location?: string;
    likes?: number;
    comments?: number;
    shares?: number;
    username?: string;
  } | null;
}

const OwnPostModal: React.FC<PostModalProps> = ({ visible, onClose, post }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!post) return null;

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
        <div className="flex-1 bg-black">
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        <div className="w-[533px] h-[850px] flex flex-col justify-between border-l border-gray-100 py-4">
          <div className="">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 px-4">
              <div className="flex items-center space-x-3">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p className="font-semibold text-gray-800">Emma Wilson</p>
                  <p className="text-xs text-gray-500">{post.username}</p>
                </div>
              </div>

          <div className="relative">
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 border-gray-200 p-1 border rounded-full mr-4 cursor-pointer flex items-center justify-center"
            >
              <img
                src="/icons/dots.svg"
                alt="Actions"
                className="w-6 h-6 pb-0.5"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    console.log("Edit Post clicked");
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Edit Post
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>

            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 p-4">
              <div className="flex">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="rounded-full w-10 h-10 mt-1"
                />
                <div className="pl-2">
                  <p className="font-semibold text-gray-800">Emma Wilson</p>
                  <p className="text-gray-800 text-sm">{post.caption}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      {post.location || "Pier 39, San Francisco, CA"}
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>12m ago</span>
                      <img
                        src="/icons/globe-icon.svg"
                        alt="profile"
                        className="rounded-full w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Natalie Parker</span> Damn,
                  this sunset looks unreal 🔥 you really caught the perfect
                  moment!
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Amber</span> Agreed
                </p>
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Natalie Parker</span> Damn,
                  this sunset looks unreal 🔥 you really caught the perfect
                  moment!
                </p>
              </div>
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
                  {post.likes || 129}
                </span>

                <span className="flex items-center">
                  <img
                    src="/icons/comment-icon.svg"
                    alt="Comments"
                    className="w-4 h-4 mr-1"
                  />
                  {post.comments || 80}
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
                  {post.shares || 29}
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

      <Modal
      open={isDeleteModalOpen}
      onCancel={() => setIsDeleteModalOpen(false)}
      footer={null}
      centered
      className="!p-0 flex items-center justify-center"
    >
      <div className="flex flex-col items-center p-6">
        <img src="/icons/delete-warning.svg" alt="Delete" className="w-20 h-20 mb-4" />
        <p className="text-gray-800 text-center mb-6">
          Are you sure you want to delete this post?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              console.log("Post deleted");
              setIsDeleteModalOpen(false);
              onClose();
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>

    </Modal>
  );
};

export default OwnPostModal;
