import React, { useState } from "react";
import { Modal, Input } from "antd";
import {
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
  EnvironmentOutlined,
  SendOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import SharePostModal from "./SharePostModal";
import ReportPostModal from "./ReportPostModal";

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
  } | null;
}

const PostModal: React.FC<PostModalProps> = ({ visible, onClose, post }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (!post) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={900}
      className="rounded-2xl overflow-hidden"
      bodyStyle={{ padding: 0, borderRadius: "16px", overflow: "hidden" }}
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

        <div className="w-[380px] flex flex-col justify-between border-l border-gray-100">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="profile"
                  className="rounded-full w-10 h-10"
                />
                <div>
                  <p className="font-semibold text-gray-800">Emma Wilson</p>
                  <p className="text-xs text-gray-500">
                    <EnvironmentOutlined className="mr-1" />
                    {post.location || "Pier 39, San Francisco, CA"}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-800 text-sm mb-4">{post.caption}</p>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Natalie Parker</span>{" "}
                  Damn, this sunset looks unreal 🔥 you really caught the perfect
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
                  <span className="font-semibold">Natalie Parker</span>{" "}
                  Damn, this sunset looks unreal 🔥 you really caught the perfect
                  moment!
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-3 space-y-3">
            <div className="flex items-center justify-between text-gray-600 text-sm">
              <span>
                <HeartOutlined className="mr-1" /> {post.likes || 129}
              </span>
              <span>
                <CommentOutlined className="mr-1" /> {post.comments || 80}
              </span>
              <span onClick={() => setIsShareOpen(true)} className="cursor-pointer">
                <ShareAltOutlined className="mr-1" /> {post.shares || 29}
              </span>
              <span onClick={() => setIsReportOpen(true)} className="cursor-pointer">
                <ExclamationCircleOutlined className="mr-1 text-red-500" /> Report
              </span>
            </div>

            <Input
              placeholder="Add a comment..."
              suffix={<SendOutlined />}
              className="rounded-full py-1 px-3"
            />
          </div>
        </div>
        <SharePostModal visible={isShareOpen} onClose={() => setIsShareOpen(false)} />
        <ReportPostModal visible={isReportOpen} onClose={() => setIsReportOpen(false)} />
      </div>
    </Modal>
  );
};

export default PostModal;
