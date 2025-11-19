import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Spin } from "antd";
import SharePostModal from "./SharePostModal";
import ReportPostModal from "./ReportPostModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PostAPI from "../../api/postApi/PostAPI";
import { message } from "antd";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  post: any | null;
}

const MediaRenderer: React.FC<any> = ({ mediaItem }) => {
  const mediaClasses = "w-full h-full object-cover";
  if (mediaItem.type === "video") {
    return (
      <video src={mediaItem.url} controls className={mediaClasses}>
        Your browser does not support the video tag.
      </video>
    );
  }

  return <img src={mediaItem.url} alt="post media" className={mediaClasses} />;
};

const PostModal: React.FC<PostModalProps> = ({ visible, onClose, post }) => {
  if (!post) return null;
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [parentCommentId, setParentCommentId] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(post?.interaction?.likeCount || 0);
  const [isLiked, setIsLiked] = useState(post?.interaction?.isLiked || false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const [contactStatus, setContactStatus] = useState<
    "none" | "added" | "friends"
  >("none");

  React.useEffect(() => {
    if (visible && post?._id) {
      fetchComments(post._id);
      fetchPostInteraction(post._id);
    }
  }, [visible, post]);

  React.useEffect(() => {
    if (post) {
      setLikeCount(post?.interaction?.likeCount ?? 0);
      setIsLiked(post?.interaction?.isLiked ?? false);
    }
  }, [post]);

  React.useEffect(() => {
    if (post?.user?._id) {
      PostAPI.checkRelation(post.user._id)
        .then((res) => {
          setContactStatus(res.data.status);
        })
        .catch((err) => {
          console.error("Error checking relation:", err);
        });
    }
  }, [post]);

  const user = post.user || {};
  const mediaItems = post.media || [];
  const hasMedia = mediaItems.length > 0;
  const comments = post.interaction?.commentCount || 0;
  const caption = post.content || "";
  const address = post?.address;

  const fetchComments = async (postId: string) => {
    try {
      setLoadingComments(true);
      const res = await PostAPI.getCommentforPost(postId);
      setCommentsList(res.data.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const fetchPostInteraction = async (postId: string) => {
    try {
      const res = await PostAPI.getPostInteractionsById(postId);
      const likeCountFromApi = res?.data;
      setLikeCount(Number(likeCountFromApi ?? 0));
    } catch (err) {
      console.error("Error fetching post interactions:", err);
    }
  };

  const handleLike = async () => {
    try {
      const res = await PostAPI.likePost(post._id);
      const data = res?.data?.data;
      if (data) {
        setIsLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (err: any) {
      console.error(err);
      message.error(
        err.response?.data?.message || "Failed to process like/unlike"
      );
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    const payload = {
      content: commentText,
      parentCommentId: parentCommentId || null,
    };

    try {
      await PostAPI.commentOnPost(post._id, payload);
      setCommentText("");
      setParentCommentId(null);
      fetchComments(post._id);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!commentText.trim()) return;

    const payload = {
      content: commentText,
      parentCommentId: parentId,
    };

    try {
      await PostAPI.commentOnPost(post._id, payload);
      setCommentText("");
      fetchComments(post._id);
    } catch (err) {
      console.error("Error posting reply:", err);
    }
  };

  const handleReportPost = async (reason: string, description: string) => {
    const payload = {
      entityType: "Post",
      entityId: post._id,
      reason,
      description,
    };

    try {
      const res = await PostAPI.reportPost(payload);
      message.success(res.data.message || "Report submitted successfully!");
      setIsReportOpen(false);
    } catch (err: any) {
      message.error(err.response?.data?.message || "Failed to submit report");
    }
  };

  const handleAddToContact = async () => {
    try {
      const res = await PostAPI.addToContact({ grantedTo: post.user._id });
      message.success(res.data.message || "Request sent!");
      setContactStatus("added");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Could not add contact");
    }
  };

  const handleProfileClick = () => {
    navigate(`/othersProfile/${user.username || "unknown"}`);
  };

  function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((+now - +date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ] as const;

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }

  const renderComments = (comments: any[], depth = 0) => {
    return comments.map((c: any, idx: number) => (
      <div
        key={idx}
        className={`flex items-start mb-4 ${depth > 0 ? "ml-12" : "ml-4"}`}
      >
        <img
          src={c.user?.image}
          alt={`${c.user?.username}'s profile`}
          className="rounded-full w-8 h-8 object-cover mr-2"
        />

        <div className="flex-1">
          <div className="bg-[#EFEFEF] p-2 rounded-xl inline-block">
            <div className="flex items-center space-x-1">
              <span className="text-black text-xs font-semibold">
                {c.user?.fullName}
              </span>

              <span className="text-[#666666] text-xs font-normal">
                {timeAgo(c.createdAt)}
              </span>
            </div>

            <p className="text-black text-base font-light mt-1">{c.content}</p>
          </div>

          <span
            className="text-[#666666] text-xs font-normal ml-2 cursor-pointer"
            onClick={() => setActiveReplyId(c._id)}
          >
            Reply
          </span>

          {activeReplyId === c._id && (
            <div className="mt-2 ml-2 w-full">
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Reply to @${c.user.username}`}
                suffix={
                  <span
                    className="text-purple-600 cursor-pointer"
                    onClick={() => {
                      handleSubmitReply(c._id);
                      setActiveReplyId(null);
                    }}
                  >
                    Submit
                  </span>
                }
                className="rounded-xl py-1 px-3 h-10"
              />
            </div>
          )}
          {c.replies?.length > 0 && (
            <div className="mt-3">{renderComments(c.replies, depth + 1)}</div>
          )}
        </div>
      </div>
    ));
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
        {hasMedia && (
          <div className="flex-1 min-w-0">
            {" "}
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              className="w-full h-full max-h-[850px]"
            >
              {mediaItems.map((media: any, index: number) => (
                <SwiperSlide
                  key={index}
                  className="flex justify-center items-center"
                >
                  <MediaRenderer mediaItem={media} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div
          className={`
                ${
                  hasMedia ? "xl:w-[600px] md:w-[360px] lg:w-[450px]" : "w-full"
                } 
                h-[850px] flex flex-col justify-between 
                ${hasMedia ? "border-l border-gray-100" : ""} 
                py-4
            `}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 px-4">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={handleProfileClick}
              >
                <img
                  src={user.image}
                  alt="profile"
                  className="rounded-full w-12 h-12"
                />
                <div>
                  <p className="text-black text-base font-normal">
                    {user.fullName}
                  </p>
                  <p className="text-[#666666] text-sm font-normal">
                    @{user.username}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 space-x-2 cursor-pointer mr-4"
                onClick={
                  contactStatus === "none" ? handleAddToContact : undefined
                }
              >
                <img
                  src="/icons/AddUser-icon.svg"
                  alt="Add to contact"
                  className="w-5 h-5"
                />
                <span className="text-[#8869F3] text-base font-light">
                  {contactStatus === "none"
                    ? "Add to contact"
                    : contactStatus === "added"
                    ? "Request Sent"
                    : "friends"}
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 p-4 pt-8">
              <div className="flex">
                <img
                  src={user.image}
                  alt="profile"
                  className="rounded-full w-12 h-12 mt-1"
                />
                <div className="pl-2">
                  <div className="flex items-center gap-4">
                    <p className="text-black text-base font-medium">
                      {user.fullName}
                    </p>
                    <p className="text-black text-base font-light">{caption}</p>
                  </div>
                  <span className="flex items-center text-stone-500 text-sm font-normal">
                    <span>{address}</span>
                    <img
                      src="/icons/location-icon.svg"
                      alt="Location icon"
                      className="w-3 h-3 ml-1"
                    />
                  </span>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <span className="text-stone-500 text-sm font-normal mt-1">
                        {timeAgo(post.updatedAt)}
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
            </div>
          </div>

          <div className="h-full overflow-y-auto pt-4">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <Spin tip="Loading comments..." />
              </div>
            ) : commentsList.length > 0 ? (
              <div className="pr-4">{renderComments(commentsList)}</div>
            ) : (
              <p className="text-gray-400 text-sm text-center mt-6">
                No comments
              </p>
            )}
          </div>

          <div className="px-4 pb-0 space-y-3">
            <div className="flex items-center justify-between text-[#000000] text-lg">
              <div className="flex items-center space-x-4">
                <span
                  className="flex items-center cursor-pointer"
                  onClick={handleLike}
                >
                  <img
                    src="/icons/heart-icon.svg"
                    alt="Likes"
                    className={`w-5 h-5 mr-1 ${isLiked ? "filter-purple" : ""}`}
                  />
                  {likeCount}
                </span>

                <span className="flex items-center">
                  <img
                    src="/icons/comment-icon.svg"
                    alt="Comments"
                    className="w-5 h-5 mr-1"
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
                    className="w-5 h-5 mr-1"
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
                  className="w-5 h-5 mr-1"
                />
              </span>
            </div>

            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              suffix={
                <span
                  className="text-purple-600 font-medium cursor-pointer"
                  onClick={handleSubmitComment}
                >
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
          onSubmit={handleReportPost}
        />
      </div>
    </Modal>
  );
};

export default PostModal;
