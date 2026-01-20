import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, message } from "antd";
import { useAuthActionGuard } from "../../hooks/useAuthActionGuard";
import PostAPI from "../../api/postApi/PostAPI";
import PostModal from "./PostModal";

const SinglePostView = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useAuthActionGuard();
  console.log("postId", postId);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await PostAPI.getPostById(postId);
        setPost(res.data.data || res.data);
      } catch (err) {
        message.error("Post not found or unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Post not available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/80 flex justify-center items-center">
      <PostModal
        visible={true}
        post={post}
        onClose={() => {}}
        onPostDeleted={() => {}}
        onLikeUpdate={() => {}}
        isPublicView={!isAuthenticated}
      />
    </div>
  );
};

export default SinglePostView;
