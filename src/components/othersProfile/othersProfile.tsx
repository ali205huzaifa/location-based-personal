import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input, Avatar, Button, Segmented, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import SharePostModal from "../home/SharePostModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { motion, AnimatePresence } from "framer-motion";
import { message } from "antd";
import { useParams } from "react-router-dom";

import {
  GoogleMap,
  useJsApiLoader,
  MarkerClusterer,
} from "@react-google-maps/api";
import PostAPI from "../../api/postApi/PostAPI";
import { OverlayView } from "@react-google-maps/api";
import PostModal from "../home/PostModal";

interface MapCardProps {
  image: string;
  caption: string;
  location?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  onClick: () => void;
  onShare: () => void;
  username: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

const defaultCenter = { lat: 30.3753, lng: 69.3451 };
const libraries: "places"[] = ["places"];

const UserProfile: React.FC = () => {
  const { userId } = useParams();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [activeTab, setActiveTab] = useState<"posts" | "interactions">("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [popupPostId, setPopupPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [, setLoading] = useState(false);
  const [, setMap] = useState<google.maps.Map | null>(null);

  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [contactStatus, setContactStatus] = useState<
    "none" | "added" | "friends"
  >("none");

  const isOwnProfile = profileUser?._id === user?._id;

  const shouldHideContent =
    profileUser?.privacy === "PRIVATE" &&
    !isOwnProfile &&
    contactStatus !== "friends";
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const profileResponse = await PostAPI.getPublicPrivateProfile(userId);
      const profileData = profileResponse.data;

      if (profileData) {
        setProfileUser(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchPosts = useCallback(
    async (offsetValue = 0) => {
      if (!userId || !profileUser) return;

      const hideContent =
        profileUser.privacy === "PRIVATE" &&
        !isOwnProfile &&
        contactStatus !== "friends";

      if (hideContent) {
        setPosts([]);
        return;
      }

      try {
        const postsResponse = await PostAPI.getPublicPostsByUser(userId, {
          limit,
          offset: offsetValue,
        });
        setPosts(postsResponse.data?.data || []);

        setOffset(offsetValue + limit);
        if (postsResponse.data?.nextPage === null) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    },
    [userId, profileUser, isOwnProfile, contactStatus]
  );

  const fetchInteractions = useCallback(async () => {
    if (activeTab !== "interactions" || !userId || !profileUser) return;

    const hideContent =
      profileUser.privacy === "PRIVATE" &&
      !isOwnProfile &&
      contactStatus !== "friends";

    if (hideContent) {
      setInteractions([]);
      return;
    }

    try {
      const response = await PostAPI.getInteractions(userId);
      const rawPosts = response.data?.data?.posts || [];

      const normalizedPosts = rawPosts.map((p: any) => ({
        _id: p.postId,
        user: p.postOwner,
        content: p.content,
        media: p.media || [],
        location: p.location || null,
        address: p.address || "",
        interactions: {
          likesCount: p.summary?.likesCount || 0,
          commentCount: p.summary?.commentCount || 0,
        },
      }));

      setInteractions(normalizedPosts);
    } catch (error) {
      console.error("Error fetching interactions:", error);
    }
  }, [activeTab, userId, profileUser, isOwnProfile, contactStatus]);

  const handleAddToContact = async () => {
    try {
      const res = await PostAPI.addToContact({ grantedTo: userId });
      message.success(res.data.message || "Request sent!");
      setContactStatus("added");
    } catch (err: any) {
      message.error(err.response?.data?.message || "Could not add contact");
    }
  };

  useEffect(() => {
    if (userId) {
      PostAPI.checkRelation(userId)
        .then((res) => setContactStatus(res.data.status))
        .catch((err) => console.error("Error checking relation:", err));
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profileUser) fetchPosts();
  }, [profileUser, fetchPosts]);

  useEffect(() => {
    fetchInteractions();
  }, [activeTab, fetchInteractions]);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  useEffect(() => {
    const div = rightSidebarRef.current;
    if (!div) return;

    const handleScroll = () => {
      const bottomReached =
        div.scrollTop + div.clientHeight >= div.scrollHeight - 50;

      if (bottomReached && hasMore && !loadingMore) {
        setLoadingMore(true);
        fetchPosts(offset);
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [hasMore, offset, loadingMore]);

  const MapCard: React.FC<MapCardProps> = ({
    image,
    caption,
    likes = 0,
    comments = 0,
    shares = 0,
    location,
    onClick,
    onShare,
  }) => {
    const hasImage = Boolean(image);

    const trimmedCaption =
      caption && caption.length > 80
        ? caption.substring(0, 80) + "..."
        : caption;

    return (
      <div
        onClick={onClick}
        className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition border border-gray-100 p-2"
      >
        {hasImage && (
          <img
            src={image}
            alt="map post"
            className="object-cover h-44 w-full rounded-xl"
          />
        )}

        <div className="pt-3 pb-2">
          <p className="text-[#000000] text-sm font-normal mb-2">
            {trimmedCaption}
          </p>

          <div className="flex items-start justify-start text-gray-600 text-sm gap-3 mb-2">
            <span className="flex items-center">
              <img
                src="/icons/heart-icon.svg"
                alt=""
                className="w-4 h-4 mr-1"
              />
              {likes}
            </span>

            <span className="flex items-center">
              <img
                src="/icons/comment-icon.svg"
                alt=""
                className="w-4 h-4 mr-1"
              />
              {comments}
            </span>

            <span
              className="flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
            >
              <img
                src="/icons/share-icon.svg"
                alt=""
                className="w-4 h-4 mr-1"
              />
              {shares}
            </span>
          </div>

          <p className="text-stone-500 text-xs font-normal flex items-center">
            <img
              src="/icons/location-icon.svg"
              alt=""
              className="w-3.5 h-3.5 mr-1"
            />
            {location}
          </p>
        </div>
      </div>
    );
  };

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="flex flex-col bg-[#F9FAFB] h-full">
      <div className="flex gap-4 px-2 flex-1">
        <div className="flex-1 flex flex-col gap-4 w-full min-w-0">
          <div className="flex flex-col gap-4 xl:px-20 lg:px-4 md:px-2">
            <div className="flex items-center lg:gap-2 xl:gap-6 md:gap-1">
              <Avatar
                size={120}
                src={profileUser?.image || "/icons/default-avatar.png"}
              />
              <div>
                <h2 className="text-black text-base font-medium">
                  {profileUser?.fullName}
                </h2>
                <p className="text-stone-500 text-sm font-normal">
                  @{profileUser?.username}
                </p>
                <div className="flex justify-between mt-4 text-left w-64 text-gray-600 text-sm">
                  <div className="flex flex-col">
                    <strong className="text-black text-base font-medium">
                      08
                    </strong>
                    <span className="text-[#666666] text-xs font-medium">
                      Circles Joined
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-black text-base font-medium">
                      18
                    </strong>
                    <span className="text-[#666666] text-xs font-medium">
                      Circle Size
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-4">{profileUser?.bio}</p>
              </div>
            </div>

            <Button
              type="primary"
              className="w-[498px] rounded-lg py-2 !h-10 flex items-center justify-center gap-2
  !bg-white !text-[#8869F3] border-[#8869F3]"
              onClick={
                contactStatus === "none" ? handleAddToContact : undefined
              }
              disabled={contactStatus !== "none"}
            >
              <img
                src={
                  contactStatus === "none"
                    ? "/icons/AddUser-icon.svg"
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
              />

              {contactStatus === "none"
                ? "Add to Contact"
                : contactStatus === "added"
                ? "Request Sent"
                : "Friends"}
            </Button>
          </div>

          {!shouldHideContent && (
            <div className="w-full flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 rounded-lg">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search"
                allowClear
                className="!h-11 !text-sm w-full xl:!w-80 outline-[#8869F3]"
              />
              <Segmented
                value={activeTab}
                onChange={(val) =>
                  setActiveTab(val as "posts" | "interactions")
                }
                options={[
                  { label: "Posts", value: "posts" },
                  { label: "Interactions", value: "interactions" },
                ]}
                className="custom-segmented bg-white rounded-xl w-full xl:!w-80 h-12 flex items-center"
                block
              />
            </div>
          )}

          {shouldHideContent ? (
            <div className="flex flex-col justify-center items-center w-[250px] h-[221px] xl:ml-48 lg:ml-36 md:ml-36 space-y-2">
              <img
                src="/icons/privacy-lock-icon.svg"
                alt="Private Account"
                className="w-14 h-14"
              />

              <p className="text-black text-base font-medium">
                This Account is private
              </p>
              <p className="text-[#666666] text-sm font-normal text-center">
                Add this user as Contact to see their posts
              </p>
            </div>
          ) : (
            <>
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={6}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    <MarkerClusterer
                      averageCenter
                      enableRetinaIcons
                      gridSize={60}
                    >
                      {() => (
                        <>
                          {(activeTab === "posts" ? posts : interactions).map(
                            (post) => {
                              const lat = post.location?.coordinates[1];
                              const lng = post.location?.coordinates[0];
                              if (!lat || !lng) return null;

                              const isHovered = popupPostId === post._id;

                              return (
                                <OverlayView
                                  key={post._id}
                                  position={{ lat, lng }}
                                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                >
                                  <div
                                    className="relative flex flex-col items-center"
                                    onMouseEnter={() =>
                                      setPopupPostId(post._id)
                                    }
                                    onMouseLeave={() => setPopupPostId(null)}
                                  >
                                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-white">
                                      <img
                                        src={
                                          post.media?.[0]?.url ||
                                          "/images/default-chat-profile.svg"
                                        }
                                        alt="pin"
                                        className="object-cover w-full h-full"
                                      />
                                    </div>
                                    <AnimatePresence>
                                      {isHovered && (
                                        <motion.div
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 20 }}
                                          transition={{ duration: 0.25 }}
                                          className="absolute bottom-14 w-64 bg-white rounded-2xl shadow-lg p-2 border border-gray-100"
                                        >
                                          {post.media?.length > 0 && (
                                            <img
                                              src={post.media[0].url}
                                              alt="Post"
                                              className="w-full h-32 object-cover rounded-xl"
                                            />
                                          )}
                                          <div className="pt-2 text-sm">
                                            <div className="flex gap-3 text-xs mt-2 text-gray-500">
                                              <span className="flex items-center">
                                                <img
                                                  src="/icons/heart-icon.svg"
                                                  alt=""
                                                  className="w-4 h-4 mr-1"
                                                />
                                                {post.likes || 0}
                                              </span>
                                              <span className="flex items-center">
                                                <img
                                                  src="/icons/comment-icon.svg"
                                                  alt=""
                                                  className="w-4 h-4 mr-1"
                                                />
                                                {post.comments || 0}
                                              </span>
                                              <span className="flex items-center">
                                                <img
                                                  src="/icons/share-icon.svg"
                                                  alt=""
                                                  className="w-4 h-4 mr-1"
                                                />
                                                {post.shares || 0}
                                              </span>
                                            </div>
                                            <p className="text-gray-600 line-clamp-2 mt-1 mb-1">
                                              {post.content}
                                            </p>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </OverlayView>
                              );
                            }
                          )}
                        </>
                      )}
                    </MarkerClusterer>
                  </GoogleMap>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <Spin />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!shouldHideContent && (
          <div
            ref={rightSidebarRef}
            className="xl:w-80 w-72 h-full xl:mr-8 md:mr-0 overflow-y-auto bg-[#F9FAFB] p-2 space-y-4 no-scrollbar"
          >
            {(activeTab === "posts" ? posts : interactions).map((post) => (
              <MapCard
                key={post._id}
                image={post.media?.[0]?.url}
                caption={post.content}
                likes={post.interaction?.likeCount || 0}
                comments={post.interaction?.commentCount || 0}
                shares={0}
                location={post.address}
                username={post.user?.username}
                onClick={() => handlePostClick(post)}
                onShare={() => setIsShareOpen(true)}
              />
            ))}
          </div>
        )}
      </div>

      <PostModal
        visible={isModalOpen}
        onClose={handleModalClose}
        post={selectedPost}
        onPostDeleted={""}
      />
      <SharePostModal
        visible={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};

export default UserProfile;
