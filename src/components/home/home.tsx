import React, { useState } from "react";
import { Input, Avatar } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PostModal from "./PostModal";
import SharePostModal from "./SharePostModal";

interface MapCardProps {
  image: string;
  caption: string;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  onClick: () => void;
  isAd?: boolean;
  username: string;
}

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [popupPostId, setPopupPostId] = useState<number | null>(null);

  const posts = [
    {
      id: 1,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      caption: "Street musician absolutely killing it! ",
      likes: 129,
      comments: 80,
      shares: 29,
      location: "Pier 39, San Francisco, CA",
      username: "@alexcos45",
      top: "300px",
      left: "420px",
    },
    {
      id: 2,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      caption: "SNEAKERS – Save up to 50%! ",
      likes: 129,
      comments: 80,
      shares: 29,
      location: "Times Square, New York, NY",
      username: "@alexcos45",
      isAd: true,
      top: "500px",
      left: "250px",
    },
  ];

  const MapCard: React.FC<MapCardProps> = ({
    image,
    caption,
    likes,
    comments,
    shares,
    location,
    onClick,
  }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition border border-gray-00 p-2"
    >
      <img
        src={image}
        alt="map post"
        className="object-cover h-44 w-full rounded-xl"
      />
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-start text-gray-600 text-sm mb-1 gap-3">
          <span className="flex items-center">
            <img
              src="/icons/heart-icon.svg"
              alt="Likes"
              className="w-4 h-4 mr-1"
            />
            {likes || 129}
          </span>

          <span className="flex items-center">
            <img
              src="/icons/comment-icon.svg"
              alt="Comments"
              className="w-4 h-4 mr-1"
            />
            {comments || 80}
          </span>
          <span className="flex items-center">
            <img
              src="/icons/share-icon.svg"
              alt="Share"
              className="w-4 h-4 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
              }}
            />{" "}
            {shares}
          </span>
        </div>
        <p className="text-[#000000] text-sm font-normal">{caption}</p>
        <p className="text-stone-500 text-xs font-normal mt-2 flex items-center">
          <img
            src="/icons/location-icon.svg"
            alt="Location icon"
            className="w-3.5 h-3.5 mr-1"
          />
          {location}
        </p>
      </div>
    </div>
  );

  const handleAvatarClick = (id: number) => {
    setPopupPostId(id);
  };

  const handleClosePopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopupPostId(null);
  };

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="flex gap-4 bg-[#F9FAFB] md:ml-4 xl:ml-0">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-center py-4">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search"
            allowClear
            className="!h-10 !text-sm outline-[#8869F3]"
          />
        </div>

        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <iframe
            title="map"
            width="100%"
            height="100%"
            className="border-none"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-105.0%2C39.7%2C-104.9%2C39.8&amp;layer=mapnik"
          ></iframe>

          {posts.map((post) => (
            <div
              key={post.id}
              className="absolute cursor-pointer"
              style={{ top: post.top, left: post.left }}
              onClick={() => handleAvatarClick(post.id)}
            >
              <Avatar
                size={50}
                src={post.image}
                className="border-2 border-white shadow-md"
              />

              {popupPostId === post.id && (
                <div
                  className="absolute z-50"
                  style={{
                    bottom: "70px",
                    left: "-90px",
                    width: "250px",
                  }}
                >
                  <div
                    className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 after:absolute after:left-1/2 after:translate-x-[-50%] after:bottom-[-8px] after:w-4 after:h-4 after:bg-white after:rotate-45 after:shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={handleClosePopup}
                      className="absolute top-1.5 right-1.5 bg-white rounded-full text-gray-600 hover:text-black shadow-sm w-5 h-5 flex items-center justify-center z-10"
                    >
                      ×
                    </button>

                    <MapCard {...post} onClick={() => {}} />
                  </div>
                </div>
              )}
            </div>
          ))}

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

      <div className="xl:w-80 w-72 h-[920px] xl:mr-8 md:mr-0 overflow-y-auto bg-[#F9FAFB] p-2 space-y-4">
        {posts.map((post) => (
          <MapCard
            key={post.id}
            {...post}
            onClick={() => handlePostClick(post)}
          />
        ))}
      </div>

      <PostModal
        visible={isModalOpen}
        onClose={handleModalClose}
        post={selectedPost}
      />

      <SharePostModal
        visible={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};

export default Home;
