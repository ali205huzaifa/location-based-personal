import React, { useState } from "react";
import { Input, Avatar, Button, Segmented } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import PostModal from "../home/PostModal";
import SharePostModal from "../home/SharePostModal";

interface MapCardProps {
  image: string;
  caption: string;
  location?: string;
  likes: number;
  comments: number;
  shares: number;
  onClick: () => void;
  onShare: () => void;
  username: string;
}

const OthersProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "interactions">("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [popupPostId, setPopupPostId] = useState<number | null>(null);

  const posts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?w=800",
      caption: "Street musician absolutely killing it 🎸",
      likes: 129,
      comments: 80,
      shares: 29,
      location: "Pier 39, San Francisco, CA",
      username: "@alexcos45",
      top: "320px",
      left: "410px",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      caption: "Beachside vibes 🌊",
      likes: 212,
      comments: 64,
      shares: 41,
      location: "Miami Beach, FL",
      username: "@alexcos45",
      top: "500px",
      left: "260px",
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="flex flex-col bg-[#F9FAFB] h-full">
      <div className="flex gap-4 px-2 flex-1">
        <div className="flex-1 flex flex-col gap-4 w-full min-w-0">
          <div className="flex flex-col gap-4 px-20">
            <div className="flex items-center gap-6">
              <Avatar
                size={120}
                src="https://randomuser.me/api/portraits/men/45.jpg"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Alex Costa
                </h2>
                <p className="text-gray-500 text-sm">@alexcos45</p>
                <div className="flex justify-between mt-2 text-left w-64 text-gray-600 text-sm">
                  <div className="flex flex-col">
                    <strong className="text-lg text-gray-800">08</strong>
                    <span>Circles Joined</span>
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-lg text-gray-800">18</strong>
                    <span>Circle Size</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Digital creator ✦ NYC | Sharing moments, not just posts ✦
                </p>
              </div>
            </div>

            <Button
              type="primary"
              className="w-full rounded-xl py-2 text-[#8869F3] border-[#8869F3] !h-10 bg-gray-50"
            >
              Add to Contact
            </Button>
          </div>

          <div className="w-full flex justify-between items-center rounded-lg">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search"
              allowClear
              className="!h-11 !text-sm !w-80 rounded-xl"
            />
            <Segmented
              value={activeTab}
              onChange={(val) => setActiveTab(val as "posts" | "interactions")}
              options={[
                { label: "Posts", value: "posts" },
                { label: "Interactions", value: "interactions" },
              ]}
              className="custom-segmented bg-white rounded-xl !w-80 h-12 flex items-center"
              block
            />
          </div>

          <div className="relative w-full h-full rounded-lg overflow-hidden bg-white border shadow-sm">
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
                      <MapCard
                        {...post}
                        onClick={() => handlePostClick(post)}
                        onShare={() => setIsShareOpen(true)}
                        username={post.username}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-80 h-full overflow-y-auto bg-[#F9FAFB] pr-2 space-y-4 mr-6">
          {(activeTab === "posts" ? posts : posts.slice(0, 2)).map((post) => (
            <MapCard
              key={post.id}
              {...post}
              onClick={() => handlePostClick(post)}
              onShare={() => setIsShareOpen(true)}
              username={post.username}
            />
          ))}
        </div>
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

export default OthersProfile;
