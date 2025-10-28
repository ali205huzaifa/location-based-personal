import React, { useState } from "react";
import { Input, Card } from "antd";
import {
  HeartOutlined,
  CommentOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import PostModal from "./PostModal";

interface MapCardProps {
  image: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  onClick: () => void;
}

const MapCard: React.FC<MapCardProps> = ({
  image,
  caption,
  likes,
  comments,
  shares,
  onClick,
}) => (
  <Card
    onClick={onClick}
    hoverable
    className="w-60 rounded-2xl shadow-md overflow-hidden"
    cover={<img src={image} alt="map post" className="object-cover h-36 w-full" />}
  >
    <p className="text-sm text-gray-800 font-medium mb-2">{caption}</p>
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

const { Search } = Input;

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handlePostClick = (postData: any) => {
    setSelectedPost(postData);
    setIsModalOpen(true);
  };

  return (
    <div className="flex bg-gray-50 h-full">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-96 z-20">
          <Search
            placeholder="Search"
            allowClear
            className="rounded-full shadow-sm"
            size="large"
          />
        </div>

        <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden relative">
          <iframe
            title="map"
            width="100%"
            height="100%"
            className="border-none"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-105.0%2C39.7%2C-104.9%2C39.8&amp;layer=mapnik"
          ></iframe>

          <div className="absolute top-24 left-16 space-y-4">
            <MapCard
              image="https://images.unsplash.com/photo-1606813902871-4d5b8a8966f6"
              caption="Street musician absolutely killing it! 🎸"
              likes={129}
              comments={80}
              shares={29}
              onClick={() =>
                handlePostClick({
                  image:
                    "https://images.unsplash.com/photo-1606813902871-4d5b8a8966f6",
                  caption: "Street musician absolutely killing it! 🎸",
                  location: "Pier 39, San Francisco, CA",
                  likes: 129,
                  comments: 80,
                  shares: 29,
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <PostModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default Home;
