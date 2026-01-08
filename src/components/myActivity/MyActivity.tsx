import React, { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, Button, Segmented, Spin } from "antd";
import SharePostModal from "../home/SharePostModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  GoogleMap,
  useJsApiLoader,
  MarkerClusterer,
  Marker,
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
  isLiked: boolean;
  onLike: () => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "12px",
};

const libraries: "places"[] = ["places"];

const MyActivity: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 });
  const [activeTab, setActiveTab] = useState<"posts" | "interactions">("posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [popupPostId, setPopupPostId] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [, setLoading] = useState(false);
  const [, setMap] = useState<google.maps.Map | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const interactionLoadingRef = useRef(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [interactionPage, setInteractionPage] = useState(1);
  const [interactionHasMore, setInteractionHasMore] = useState(true);
  const [interactionLoading, setInteractionLoading] = useState(false);

  const [profileUser, setProfileUser] = useState<any>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  useEffect(() => {
    if (!user?.location) return;

    const geocodeLocation = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            user.location
          )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setMapCenter({ lat, lng });
        }
      } catch (error) {
        console.error("Error geocoding location:", error);
      }
    };

    geocodeLocation();
  }, [user?.location]);

  const fetchProfile = useCallback(async () => {
    if (!user?._id) return;
    try {
      const profileResponse = await PostAPI.getPublicPrivateProfile(user._id);
      const profileData = profileResponse.data;

      if (profileData) {
        setProfileUser(profileData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchPosts = useCallback(
    async (pageValue = 1) => {
      if (!user?._id) return;

      try {
        const response = await PostAPI.getPublicPostsByUser(user._id, {
          limit,
          page: pageValue,
        });

        const rawPosts = response.data?.data || [];

        setPosts((prev) => {
          const ids = new Set(prev.map((p) => p._id));
          const filtered = rawPosts.filter((p: any) => !ids.has(p._id));
          return [...prev, ...filtered];
        });

        setHasMore(response.data?.hasNext);
        setPage(pageValue + 1);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingMore(false);
      }
    },
    [user]
  );

  const fetchInteractions = useCallback(async () => {
    if (!user?._id || interactionLoadingRef.current || !interactionHasMore)
      return;

    interactionLoadingRef.current = true;
    setInteractionLoading(true);

    try {
      const response = await PostAPI.getInteractions(user._id, {
        page: interactionPage,
        limit,
      });

      const raw = response.data?.data || [];

      const normalized = raw.map((p: any) => ({
        _id: p.postId,
        user: p.postOwner,
        content: p.content,
        media: p.media || [],
        location: p.location,
        address: p.address,
        isLikedByMe: p.isLikedByMe,
        interaction: {
          likesCount: p.summary?.likesCount || 0,
          commentCount: p.summary?.commentCount || 0,
        },
      }));

      setInteractions((prev) => [...prev, ...normalized]);
      setInteractionHasMore(response.data?.hasNext);
      setInteractionPage((p) => p + 1);
    } catch (e) {
      console.error("Interaction fetch error", e);
    } finally {
      interactionLoadingRef.current = false;
      setInteractionLoading(false);
    }
  }, [user?._id, interactionPage, interactionHasMore]);

  useEffect(() => {
    if (activeTab === "interactions" && interactions.length === 0) {
      fetchInteractions();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const refreshPosts = async () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    await fetchPosts(1);
  };

  const handleLikeUpdate = (
    postId: string,
    liked: boolean,
    likeCount: number
  ) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p._id === postId
          ? {
              ...p,
              interaction: {
                ...p.interaction,
                likesCount: likeCount,
              },
              isLikedByMe: liked,
            }
          : p
      )
    );

    setInteractions((prevPosts) =>
      prevPosts.map((p) =>
        p._id === postId
          ? {
              ...p,
              interaction: {
                ...p.interaction,
                likesCount: likeCount,
              },
              isLikedByMe: liked,
            }
          : p
      )
    );

    setSelectedPost((prev: any) =>
      prev && prev._id === postId
        ? {
            ...prev,
            interaction: {
              ...prev.interaction,
              likesCount: likeCount,
            },
            isLikedByMe: liked,
          }
        : prev
    );
  };

  const handleLike = async (post: any) => {
    const postId = post._id;

    const prevLikeState = {
      liked: post.isLikedByMe,
      likeCount: post.interaction?.likesCount,
    };

    const newLikedState = !prevLikeState.liked;
    const newLikeCount = prevLikeState.liked
      ? prevLikeState.likeCount - 1
      : prevLikeState.likeCount + 1;

    handleLikeUpdate(postId, newLikedState, newLikeCount);

    try {
      await PostAPI.likePost(postId);
    } catch (err) {
      console.error("Error updating like:", err);
      handleLikeUpdate(postId, prevLikeState.liked, prevLikeState.likeCount);
    }
  };

  useEffect(() => {
    const div = rightSidebarRef.current;
    if (!div) return;

    const handleScroll = () => {
      const bottomReached =
        div.scrollTop + div.clientHeight >= div.scrollHeight - 50;

      if (bottomReached) {
        if (activeTab === "posts" && hasMore && !loadingMore) {
          setLoadingMore(true);
          fetchPosts(page);
        }

        if (
          activeTab === "interactions" &&
          interactionHasMore &&
          !interactionLoading
        ) {
          fetchInteractions();
        }
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, loadingMore]);

  useEffect(() => {
    if (
      (activeTab === "posts" ? posts : interactions).length === 0 &&
      loadingMore
    ) {
      setLoadingMore(false);
    }
  }, [activeTab, posts, interactions, loadingMore]);

  const MapCard: React.FC<MapCardProps> = ({
    image,
    caption,
    likes,
    comments,
    shares,
    location,
    onClick,
    onShare,
    isLiked,
    onLike,
  }) => {
    const hasImage = Boolean(image);

    const trimmedCaption =
      caption && caption.length > 105
        ? caption.substring(0, 105) + "..."
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
            <span
              className="flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
            >
              <img
                src={
                  isLiked ? "/icons/redheart-icon.svg" : "/icons/heart-icon.svg"
                }
                alt="Likes"
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
    <div className="flex flex-col h-full min-h-0 bg-[#F9FAFB]">
      <div className="flex gap-4 px-2 flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-4 w-full min-w-0">
          <div className="flex flex-col gap-4 xl:px-20 px-0">
            <div className="flex items-center lg:gap-2 xl:gap-6 md:gap-4">
              <Avatar
                size={120}
                className="shrink-0"
                src={user?.image || "/icons/default-avatar.png"}
              />
              <div>
                <h2 className="text-black text-base font-medium">
                  {user?.fullName}
                </h2>
                <p className="text-stone-500 text-sm font-normal">
                  @{user?.username}
                </p>
                <div className="flex justify-between mt-4 text-left w-64 text-gray-600 text-sm">
                  <div className="flex flex-col">
                    <strong className="text-black text-base font-medium">
                      {profileUser?.circleJoined ?? 0}
                    </strong>
                    <span className="text-[#666666] text-xs font-medium">
                      Circles Joined
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-black text-base font-medium">
                      {profileUser?.circleSize ?? 0}
                    </strong>
                    <span className="text-[#666666] text-xs font-medium">
                      Circle Size
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mt-4">
                  {user?.bio
                    ? user.bio.slice(0, 81) +
                      (user.bio.length > 81 ? "..." : "")
                    : ""}
                </p>
              </div>
            </div>

            {/* <Button
              type="primary"
              className="w-full rounded-lg py-2 !bg-[#F9FAFB] !text-[#8869F3] border-[#8869F3] !h-10"
              onClick={() => navigate("/settings")}
            >
              Edit Profile
            </Button> */}
          </div>

          <div className="w-full flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-3 rounded-lg">
            {/* <Input
              prefix={
                <img src="/icons/search-icon.svg" alt="Icon" className="mr-2" />
              }
              placeholder="Search"
              allowClear
              className="!h-11 !text-sm w-full xl:!w-80 outline-[#8869F3]"
            /> */}

            <Button
              type="primary"
              className="xl:!w-80 rounded-lg py-2 !bg-[#F9FAFB] !text-[#8869F3] border-[#8869F3] !h-10 shadow-none"
              onClick={() => navigate("/settings")}
            >
              Edit Profile
            </Button>
            <Segmented
              value={activeTab}
              onChange={(val) => setActiveTab(val as "posts" | "interactions")}
              options={[
                { label: "My Posts", value: "posts" },
                { label: "My Interactions", value: "interactions" },
              ]}
              className="custom-segmented bg-white rounded-xl w-full xl:!w-80 h-12 flex items-center"
              block
            />
          </div>

          <div className="relative w-full flex-1 min-h-0 rounded-lg">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  minZoom: 14,
                  maxZoom: 18,
                  zoomControl: false,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                }}
              >
                {user?.location && mapCenter && (
                  <Marker
                    position={mapCenter}
                    icon={{
                      url: "/icons/location-marker.svg",
                      scaledSize: new window.google.maps.Size(44, 44),
                    }}
                  />
                )}

                <MarkerClusterer averageCenter enableRetinaIcons gridSize={60}>
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
                                onMouseEnter={() => setPopupPostId(post._id)}
                                onMouseLeave={() => setPopupPostId(null)}
                                onClick={() => handlePostClick(post)}
                                style={{ transform: "translate(-50%, -100%)" }}
                              >
                                <div className="h-24 w-24 rounded-full bg-white p-1.5 shadow-lg relative z-20">
                                  <div className="h-full w-full rounded-full border-4 border-[#8869F3] overflow-hidden">
                                    <img
                                      src={
                                        post.user.image ||
                                        "/images/default-chat-profile.svg"
                                      }
                                      alt="pin"
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                </div>

                                <div
                                  className="-mt-1.5 h-0 w-0
      border-l-[24px] border-l-transparent
      border-r-[20px] border-r-transparent
      border-t-[24px] border-t-white relative z-20"
                                ></div>
                                <div className="absolute bottom-[-15px] -left-4 w-8 h-8 rounded-full flex items-center justify-center">
                                  <div
                                    className="absolute w-full h-full rounded-full"
                                    style={{
                                      backgroundColor: "#8869F3",
                                      opacity: 0.25,
                                      boxShadow:
                                        "0 0 10px 10px rgba(136, 105, 243, 0.5)",
                                    }}
                                  ></div>

                                  <div className="absolute w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-[#8869F3]"></div>
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {isHovered && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 20 }}
                                      transition={{ duration: 0.25 }}
                                      className="absolute bottom-28 w-64 bg-white rounded-2xl shadow-lg p-2 border border-gray-100"
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
                                            {post.interaction?.likesCount}
                                          </span>
                                          <span className="flex items-center">
                                            <img
                                              src="/icons/comment-icon.svg"
                                              alt=""
                                              className="w-4 h-4 mr-1"
                                            />
                                            {post.interaction?.commentCount}
                                          </span>
                                          <span className="flex items-center">
                                            <img
                                              src="/icons/share-icon.svg"
                                              alt=""
                                              className="w-4 h-4 mr-1"
                                            />
                                            {post.interaction?.shareCount}
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
        </div>

        <div
          ref={rightSidebarRef}
          className="xl:w-80 w-72 h-full xl:mr-8 md:mr-0 overflow-y-auto bg-[#F9FAFB] p-2 space-y-4 no-scrollbar"
        >
          {(() => {
            const list = activeTab === "posts" ? posts : interactions;
            const isEmpty = list.length === 0;
            const label = activeTab === "posts" ? "posts" : "interactions";

            return (
              <>
                {isEmpty && !loadingMore && (
                  <p className="text-center !text-[#8869F3] text-base mt-8">
                    No {label} yet — check back soon!
                  </p>
                )}

                {list.map((item) => (
                  <MapCard
                    key={item._id}
                    image={item.media?.[0]?.url}
                    caption={item.content}
                    likes={item.interaction?.likesCount || 0}
                    comments={item.interaction?.commentCount || 0}
                    isLiked={item.isLikedByMe}
                    shares={0}
                    location={item.address}
                    username={item.user?.username}
                    onClick={() => handlePostClick(item)}
                    onShare={() => setIsShareOpen(true)}
                    onLike={() => handleLike(item)}
                  />
                ))}

                {loadingMore && (
                  <div className="w-full flex justify-center py-4 text-gray-500">
                    <Spin size="small" />
                  </div>
                )}

                {!hasMore && list.length >= 10 && (
                  <p className="text-center text-xs text-gray-400 py-4">
                    No more {label} to load.
                  </p>
                )}
              </>
            );
          })()}
        </div>
      </div>

      <PostModal
        visible={isModalOpen}
        onClose={handleModalClose}
        post={selectedPost}
        onPostDeleted={refreshPosts}
        onLikeUpdate={handleLikeUpdate}
      />
      <SharePostModal
        visible={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};

export default MyActivity;
