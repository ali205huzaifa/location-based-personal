import React, { useState } from "react";
import { Input, Card, Avatar, Divider } from "antd";
import {
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
  AimOutlined,
} from "@ant-design/icons";
import PostModal from "./PostModal";

const { Search } = Input;

interface MapCardProps {
  image: string;
  caption: string;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  onClick: () => void;
  isAd?: boolean;
}

const MapCard: React.FC<MapCardProps> = ({
  image,
  caption,
  likes,
  comments,
  shares,
  onClick,
  location,
  isAd,
}) => (
  <Card
    onClick={onClick}
    hoverable
    className={`rounded-2xl shadow-md overflow-hidden ${
      isAd ? "border border-purple-400" : ""
    }`}
    cover={
      <img src={image} alt="map post" className="object-cover h-44 w-full" />
    }
  >
    <p className="text-gray-800 font-medium mb-2 text-sm">{caption}</p>
    {location && (
      <p className="text-xs text-gray-500 mb-2 flex items-center">
        <AimOutlined className="mr-1" /> {location}
      </p>
    )}
    <div className="flex items-center justify-between text-gray-600 text-sm">
      <span>
        <HeartOutlined className="mr-1" /> {likes}
      </span>
      <span>
        <CommentOutlined className="mr-1" /> {comments}
      </span>
      <span>
        <ShareAltOutlined className="mr-1" /> {shares}
      </span>
    </div>
  </Card>
);

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handlePostClick = (postData: any) => {
    setSelectedPost(postData);
    setIsModalOpen(true);
  };

  const posts = [
    {
      image:
        "https://images.unsplash.com/photo-1606813902871-4d5b8a8966f6?q=80&w=800",
      caption: "Street musician absolutely killing it! 🎸",
      likes: 129,
      comments: 80,
      shares: 29,
      location: "Pier 39, San Francisco, CA",
    },
    {
      image:
        "https://images.unsplash.com/photo-1585386959984-a41552231693?q=80&w=800",
      caption: "SNEAKERS – Save up to 50%! 👟",
      likes: 129,
      comments: 80,
      shares: 29,
      location: "Pier 39, San Francisco, CA",
      isAd: true,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 gap-4">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-[400px] z-20">
          <Search
            placeholder="Search"
            allowClear
            size="large"
            className="rounded-full shadow-sm"
          />
        </div>

        <div className="w-full h-full rounded-lg overflow-hidden relative">
          <iframe
            title="map"
            width="100%"
            height="100%"
            className="border-none"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-105.0%2C39.7%2C-104.9%2C39.8&amp;layer=mapnik"
          ></iframe>

          <div className="absolute top-[140px] left-[180px] space-y-6">
            {posts.map((post, index) => (
              <MapCard
                key={index}
                {...post}
                onClick={() => handlePostClick(post)}
              />
            ))}
          </div>

          <div className="absolute top-[300px] left-[420px]">
            <Avatar
              size={50}
              src="https://randomuser.me/api/portraits/women/65.jpg"
              className="border-2 border-white shadow-md"
            />
          </div>
          <div className="absolute top-[500px] left-[250px]">
            <Avatar
              size={50}
              src="https://randomuser.me/api/portraits/men/32.jpg"
              className="border-2 border-white shadow-md"
            />
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
            <button className="bg-white w-9 h-9 flex items-center justify-center rounded-md shadow">
              +
            </button>
            <button className="bg-white w-9 h-9 flex items-center justify-center rounded-md shadow">
              −
            </button>
          </div>
        </div>
      </div>

      <div className="w-80 h-full mr-8 overflow-y-auto bg-white border-l border-gray-200 p-4 space-y-4">
        {posts.map((post, i) => (
          <div key={i}>
            <img
              src={post.image}
              alt="post"
              className="rounded-xl mb-2 object-cover w-full h-48"
            />
            <p className="text-gray-800 font-medium mb-1">{post.caption}</p>
            {post.location && (
              <p className="text-xs text-gray-500 mb-2">
                <AimOutlined className="mr-1" />
                {post.location}
              </p>
            )}
            <div className="flex items-center justify-between text-gray-600 text-sm">
              <span>
                <HeartOutlined className="mr-1" /> {post.likes}
              </span>
              <span>
                <CommentOutlined className="mr-1" /> {post.comments}
              </span>
              <span>
                <ShareAltOutlined className="mr-1" /> {post.shares}
              </span>
            </div>
            <Divider className="my-3" />
          </div>
        ))}
      </div>

      <PostModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default Home;
