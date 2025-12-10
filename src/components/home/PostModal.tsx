import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Spin, Popover, Button, Modal } from "antd";
import SharePostModal from "./SharePostModal";
import ReportPostModal from "./ReportPostModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PostAPI from "../../api/postApi/PostAPI";
import { message } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import AddPostModal from "../addpost/AddPostModal";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  post: any | null;
  onPostDeleted: any;
  onLikeUpdate: (postId: string, liked: boolean, likeCount: number) => void;
}

const MediaRenderer: React.FC<any> = ({ mediaItem }) => {
  const mediaClasses = "max-h-full max-w-full object-contain";
  if (mediaItem.type === "video") {
    return (
      <video src={mediaItem.url} controls className={mediaClasses}>
        Your browser does not support the video tag.
      </video>
    );
  }

  return <img src={mediaItem.url} alt="post media" className={mediaClasses} />;
};

const PostModal: React.FC<PostModalProps> = ({
  visible,
  onClose,
  post,
  onPostDeleted,
  onLikeUpdate,
}) => {
  if (!post) return null;
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [parentCommentId, setParentCommentId] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(post?.interaction?.likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [postData, setPostData] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // const [successModalVisible, setSuccessModalVisible] = useState(false);
  // const [successMessage, setSuccessMessage] = useState("");

  const swiperRef = useRef<any>(null);

  const [contactStatus, setContactStatus] = useState<
    "none" | "added" | "friends"
  >("none");

  useEffect(() => {
    if (visible && post?._id) {
      fetchComments(post._id);
      fetchPostInteraction(post._id);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && post) {
      setLikeCount(post?.interaction?.likesCount ?? 0);
      setIsLiked(post?.interaction?.liked ?? false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible && post?.user?._id) {
      PostAPI.checkRelation(post.user._id)
        .then((res) => setContactStatus(res.data.status))
        .catch((err) => console.error("Error checking relation:", err));
    }
  }, [visible]);

  const user = post.user || {};
  const mediaItems = post.media || [];
  const hasMedia = mediaItems.length > 0;
  const comments = post.interaction?.commentCount || 0;
  const caption = post.content || "";
  const address = post?.address;

  const closeAllModals = () => {
    onClose();
    setEditModalVisible(false);
    setDeleteModalVisible(false);
    setIsShareOpen(false);
    setIsReportOpen(false);
  };

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

      const liked = res?.data?.data?.isLikedByMe;
      setIsLiked(Boolean(liked));
    } catch (err) {
      console.error("Error fetching post interactions:", err);
    }
  };

  const handleLike = async () => {
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    const newIsLiked = !previousIsLiked;
    console.log(newIsLiked);
    const newLikeCount = newIsLiked
      ? previousLikeCount + 1
      : previousLikeCount - 1;
    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);
    onLikeUpdate(post._id, newIsLiked, newLikeCount);
    try {
      const res = await PostAPI.likePost(post._id);
      const data = res?.data?.data;
      if (data) {
        setIsLiked(data.liked);
        setLikeCount(data.likesCount);
        onLikeUpdate(post._id, data.liked, data.likesCount);
      }
    } catch (err: any) {
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      onLikeUpdate(post._id, previousIsLiked, previousLikeCount);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || post.isCommentDisabled) return;

    const payload = {
      content: commentText,
      parentCommentId: parentCommentId || null,
    };

    try {
      await PostAPI.commentOnPost(post._id, payload);
      setCommentText("");
      setParentCommentId(null);
      setLikeCount((prev: any) => prev);
      post.interaction.commentCount = (post.interaction.commentCount || 0) + 1;

      fetchComments(post._id);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!commentText.trim() || post.isCommentDisabled) return;

    const payload = {
      content: commentText,
      parentCommentId: parentId,
    };

    try {
      await PostAPI.commentOnPost(post._id, payload);
      setCommentText("");

      post.interaction.commentCount = (post.interaction.commentCount || 0) + 1;

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

  const handleDelete = async () => {
    setLoading(true);

    try {
      await PostAPI.deletePostById(post._id);

      setLoading(false);
      setDeleteModalVisible(false);
      message.success("Post deleted");
      closeAllModals();
      onPostDeleted?.();
      // setSuccessMessage("Post deleted");
      // setSuccessModalVisible(true);
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete post!");
    }
  };

  const handleProfileClick = () => {
    navigate(`/othersProfile/${user._id || "unknown"}`);
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
    return comments.map((c: any) => {
      const indentClass = depth === 0 ? "" : "";

      return (
        <div key={c._id} className="flex items-start mb-1">
          <img
            src={c.user?.image}
            alt={c.user?.fullName}
            className="w-9 h-9 rounded-full object-cover mr-2 flex-shrink-0 mt-1"
          />
          <div className={`flex-1 min-w-0 ${indentClass}`}>
            <div className="bg-[#EFEFEF] px-4 py-3 rounded-2xl inline-block max-w-full">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold">{c.user?.fullName}</span>
                <span className="text-[#666]">{timeAgo(c.createdAt)}</span>
              </div>

              <p className="text-black text-base mt-1 break-words">
                {c.content}
              </p>
            </div>

            <div className="mt-2">
              <span
                className="text-[#666] text-xs cursor-pointer"
                onClick={() => {
                  setActiveReplyId(c._id);
                  setCommentText("");
                }}
              >
                Reply
              </span>
            </div>

            {activeReplyId === c._id && !post.isCommentDisabled && (
              <div className="mt-3">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={`Reply to @${c.user.username}`}
                  suffix={
                    <span
                      className="text-[#8869F3] cursor-pointer"
                      onClick={() => {
                        handleSubmitReply(c._id);
                        setActiveReplyId(null);
                        setCommentText("");
                      }}
                    >
                      Submit
                    </span>
                  }
                  className="rounded-xl h-10"
                />
              </div>
            )}

            {c.replies?.length > 0 && (
              <div className="mt-4">
                {renderComments(c.replies, depth >= 1 ? 1 : depth + 1)}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-[1242px] max-h-[90vh] h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <button
          className="absolute -top-2 -right-2 z-10 p-2"
          onClick={onClose}
          aria-label="Close modal"
        >
          <CloseOutlined className="w-6 h-6" />
        </button> */}
        <div className="flex flex-row bg-white rounded-2xl overflow-hidden h-full max-h-full">
          {mediaItems.length > 0 && (
            <div className="relative flex-1 min-w-0 bg-black flex items-center justify-center h-full">
              {" "}
              <Swiper
                modules={[Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                pagination={false}
                className="w-full h-full post-swiper"
                onSwiper={(swiper) => (swiperRef.current = swiper)}
              >
                {mediaItems.map((media: any, index: number) => (
                  <SwiperSlide
                    key={index}
                    className="flex justify-center items-center h-full"
                  >
                    <MediaRenderer mediaItem={media} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button
                className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#f9fafb] shadow flex items-center justify-center"
                onClick={() => swiperRef.current.slidePrev()}
              >
                <img src="/icons/left-swiper-icon.svg" className="w-3 h-3" />
              </button>
              <button
                className="custom-next absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#f9fafb] shadow flex items-center justify-center"
                onClick={() => swiperRef.current.slideNext()}
              >
                <img src="/icons/right-swiper-icon.svg" className="w-3 h-3" />
              </button>
            </div>
          )}

          <div
            className={`
                ${
                  hasMedia ? "xl:w-[600px] md:w-[360px] lg:w-[450px]" : "w-full"
                } 
               h-full flex flex-col overflow-hidden 
                ${hasMedia ? "border-l border-gray-100" : ""} 
            `}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-4 border-b border-gray-200 flex-shrink-0">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={handleProfileClick}
              >
                <img
                  src={user.image || "/images/default-chat-profile.svg"}
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

              {!post.systemGenerated && (
                <div className="flex items-center justify-between">
                  {currentUser && user && currentUser._id === user._id ? (
                    <Popover
                      open={popoverVisible}
                      onOpenChange={setPopoverVisible}
                      content={
                        <div className="flex flex-col items-start gap-1 text-base! font-normal!">
                          <Button
                            type="text"
                            className="ml-1 !text-black text-base! font-normal!"
                            icon={
                              <img
                                src="/icons/edit-icon.svg"
                                alt="edit"
                                className="w-4 h-4"
                              />
                            }
                            onClick={async () => {
                              setPopoverVisible(false);
                              try {
                                const res = await PostAPI.getPostById(post._id);
                                setPostData(res.data);
                                setEditModalVisible(true);
                              } catch (err) {
                                message.error("Failed to fetch post details!");
                              }
                            }}
                          >
                            Edit Post
                          </Button>
                          <Button
                            type="text"
                            className="!text-[#FF5D5D] text-base! font-normal!"
                            danger
                            icon={
                              <img
                                src="/icons/delete-icon.svg"
                                alt="edit"
                                className="w-5 h-5"
                              />
                            }
                            onClick={() => {
                              setPopoverVisible(false);
                              setDeleteModalVisible(true);
                            }}
                          >
                            Delete Post
                          </Button>{" "}
                        </div>
                      }
                      trigger="click"
                      placement="bottomRight"
                    >
                      <Button
                        shape="circle"
                        icon={
                          <img
                            src="/icons/dots-icon.svg"
                            alt="edit"
                            className="w-5 h-5"
                          />
                        }
                        className="mr-2"
                      />{" "}
                    </Popover>
                  ) : (
                    <div
                      className="flex items-center gap-6 cursor-pointer"
                      onClick={
                        contactStatus === "none"
                          ? handleAddToContact
                          : undefined
                      }
                    >
                      <img
                        src={
                          contactStatus === "none"
                            ? "/icons/AddUser-icon.svg"
                            : contactStatus === "added"
                            ? "/icons/contactAdded-icon.svg"
                            : "/icons/contactAdded-icon.svg"
                        }
                        alt={
                          contactStatus === "none"
                            ? "Add to contact"
                            : contactStatus === "added"
                            ? "Request sent"
                            : "Friends"
                        }
                        className="w-5 h-5"
                      />{" "}
                      <span className="text-[#8869F3] text-base font-light">
                        {contactStatus === "none"
                          ? "Add to contact"
                          : contactStatus === "added"
                          ? "Request Sent"
                          : "Friends"}{" "}
                      </span>{" "}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto px-4 py-4 border-b border-gray-200 flex-shrink-0">
              <p className="text-black text-base font-light">{caption}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="flex items-center text-stone-500 text-sm font-normal">
                  <span>{address}</span>
                  <img
                    src="/icons/location-icon.svg"
                    alt="Location icon"
                    className="w-4 h-4 ml-1"
                  />
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-stone-500 text-sm font-normal">
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

            <div className="flex-1 overflow-y-auto px-4 pt-4 custom-scrollbar">
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

            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between text-[#000000] text-lg">
                <div className="flex items-center space-x-4">
                  <span
                    className="flex items-center cursor-pointer"
                    onClick={handleLike}
                  >
                    <img
                      src={
                        isLiked
                          ? "/icons/redheart-icon.svg"
                          : "/icons/heart-icon.svg"
                      }
                      alt="Likes"
                      className="w-5 h-5 mr-1 cursor-pointer"
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
                placeholder={
                  post.isCommentDisabled
                    ? "Comments are disabled"
                    : "Add a comment..."
                }
                suffix={
                  !post.isCommentDisabled && (
                    <span
                      className="text-[#8869F3] font-medium cursor-pointer"
                      onClick={handleSubmitComment}
                    >
                      Submit
                    </span>
                  )
                }
                className="rounded-xl py-1 px-3 h-12"
                disabled={post.isCommentDisabled}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Post Deletion Conformation Modal */}
      <Modal
        centered
        open={deleteModalVisible}
        onCancel={onClose}
        closable={false}
        width={392}
        footer={
          <div className="flex gap-3">
            <Button
              key="delete"
              type="primary"
              danger
              loading={loading}
              onClick={handleDelete}
              className="flex-1 !h-10 !bg-[#FF5D5D] rounded-xl"
            >
              Yes, Delete
            </Button>
            <Button
              key="close"
              onClick={onClose}
              className="flex-1 !h-10 rounded-xl text-[#666666]"
            >
              Cancel
            </Button>
          </div>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <img src="/icons/delete-icon.svg" alt="Icon" className="w-12 h-12" />
          <span className="text-center text-base font-medium px-8">
            Are you sure you want to delete this post?
          </span>
        </div>
      </Modal>

      {/* Success Modal to display after deleting Post! */}
      {/* <Modal
        open={successModalVisible}
        centered
        onCancel={() => setSuccessModalVisible(false)}
        footer={null}
        width={358}
        style={{ height: 211 }}
        closable={false}
        className="!rounded-2xl !w-96 !h-52"
      >
        <div className="flex flex-col items-center gap-3 mt-4">
          <img src="/icons/success-icon.svg" alt="Icon" className="w-14 h-14" />
          <p className="text-black text-xl font-medium my-4">
            {successMessage}
          </p>
        </div>
      </Modal> */}

      <SharePostModal
        visible={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
      <ReportPostModal
        visible={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportPost}
      />

      <AddPostModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        editPostData={postData}
        onCloseAll={closeAllModals}
        postsRefetch={onPostDeleted}
      />
    </div>
  );
};

export default PostModal;
