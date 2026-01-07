import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input, Spin } from "antd";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerClusterer,
  OverlayView,
  Marker,
} from "@react-google-maps/api";
import PostModal from "./PostModal";
import SharePostModal from "./SharePostModal";
import PostAPI from "../../api/postApi/PostAPI";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

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
  isLiked: boolean;
  onLike: () => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

const Home: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const [mapCenter, setMapCenter] = useState({ lat: 24.7136, lng: 46.6753 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [popupPostId, setPopupPostId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mainSearchValue, setMainSearchValue] = useState("");

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  useEffect(() => {
    if (!currentUser?.location) return;

    const geocodeLocation = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            currentUser.location
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
  }, [currentUser?.location]);

  const fetchPosts = async (pageValue = 1) => {
    try {
      const res = await PostAPI.getPublicPosts({
        page: pageValue,
        limit,
      });

      const newPosts = res.data?.data || [];

      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const filtered = newPosts.filter((p: any) => !ids.has(p._id));
        return [...prev, ...filtered];
      });

      setHasMore(res.data?.hasNext);
      setPage(pageValue + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

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

      if (bottomReached && hasMore && !loadingMore) {
        setLoadingMore(true);
        fetchPosts(page);
      }
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [hasMore, page, loadingMore]);

  const MapCard: React.FC<MapCardProps> = ({
    image,
    caption,
    likes,
    comments,
    shares,
    location,
    onClick,
    isLiked,
    onLike,
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
          <div
            className={`flex items-start justify-start text-gray-600 text-sm gap-3 ${
              hasImage ? "mb-2" : "mt-1"
            }`}
          >
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
                className="w-5 h-5 mr-1"
              />
              {likes}
            </span>

            <span className="flex items-center">
              <img
                src="/icons/comment-icon.svg"
                alt="Comments"
                className="w-5 h-5 mr-1"
              />
              {comments || 0}
            </span>

            <span
              className="flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
              }}
            >
              <img
                src="/icons/share-icon.svg"
                alt="Share"
                className="w-5 h-5 mr-1"
              />
              {shares}
            </span>
          </div>

          <p className="text-stone-500 text-xs font-normal mt-1 flex items-center">
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
  };

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

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  const handleSearchClose = () => {
    setSearchOpen(false);
    // setMainSearchValue("");
  };

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    if (place.geometry?.location && map) {
      map.panTo(place.geometry.location);
      map.setZoom(14);
    }
    setSearchOpen(false);
    setMainSearchValue(place.name || place.formatted_address || "");
  };

  if (!isLoaded || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" tip="Loading map and posts..." />
      </div>
    );
  }

  return (
    <div className="flex gap-4 bg-[#F9FAFB] md:ml-4 xl:ml-0 h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex justify-center pb-4 w-full relative z-10">
          <div className="w-full" ref={searchContainerRef}>
            <Input
              prefix={
                searchOpen ? (
                  <img
                    src="/icons/back-icon.svg"
                    alt="Icon"
                    className="cursor-pointer mr-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearchClose();
                    }}
                  />
                ) : (
                  <img
                    src="/icons/search-icon.svg"
                    alt="Icon"
                    className="mr-2"
                  />
                )
              }
              suffix={
                mainSearchValue ? (
                  <img
                    src="/icons/cross-icon.svg"
                    alt="Clear"
                    className="w-4 h-4 cursor-pointer !rounded-full border bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMainSearchValue("");
                    }}
                  />
                ) : null
              }
              placeholder="Search"
              onClick={() => setSearchOpen(true)}
              onFocus={() => setSearchOpen(true)}
              value={mainSearchValue}
              onChange={(e) => {
                setMainSearchValue(e.target.value);
                setSearchOpen(true);
              }}
              className="!h-12 !text-sm !w-full !rounded-xl custom-input focus:!border-[#8869F3] hover:!border-[#8869F3] focus-visible:!border-[#8869F3]"
            />

            {searchOpen && (
              <div
                className="absolute top-full mt-1 left-0"
                style={{
                  width: searchContainerRef.current?.offsetWidth,
                  zIndex: 20,
                }}
              >
                <SearchModal
                  searchValue={mainSearchValue}
                  onClose={handleSearchClose}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            )}
          </div>
        </div>

        <div className="relative w-full h-full rounded-lg overflow-hidden">
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
            {currentUser?.location && mapCenter && (
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
                  {posts.map((post) => {
                    const lat = post.location!.coordinates[1];
                    const lng = post.location!.coordinates[0];

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
                                      {post.interaction?.likesCount || 0}
                                    </span>
                                    <span className="flex items-center">
                                      <img
                                        src="/icons/comment-icon.svg"
                                        alt=""
                                        className="w-4 h-4 mr-1"
                                      />
                                      {post.interaction?.commentCount || 0}
                                    </span>
                                    <span className="flex items-center">
                                      <img
                                        src="/icons/share-icon.svg"
                                        alt=""
                                        className="w-4 h-4 mr-1"
                                      />
                                      {post.interaction?.shareCount || 0}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 line-clamp-2">
                                    {post.content}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </OverlayView>
                    );
                  })}
                </>
              )}
            </MarkerClusterer>
          </GoogleMap>
        </div>
      </div>

      <div
        ref={rightSidebarRef}
        className="xl:w-80 w-72 h-full xl:mr-8 md:mr-0 overflow-y-auto bg-[#F9FAFB] px-2 pb-2 space-y-4 no-scrollbar"
      >
        {posts.length === 0 && !loadingMore && (
          <p className="text-center !text-[#8869F3] text-base mt-8">
            No posts yet — check back soon!
          </p>
        )}

        {posts.map((post) => (
          <MapCard
            key={post._id}
            image={post.media?.length ? post.media[0].url : null}
            caption={post.content || "No content"}
            likes={post.interaction?.likesCount || 0}
            comments={post.interaction?.commentCount || 0}
            shares={post.interaction?.shareCount || 0}
            isLiked={post.isLikedByMe}
            location={post.address}
            username={post.user?.username}
            onClick={() => handlePostClick(post)}
            onLike={() => handleLike(post)}
          />
        ))}

        {loadingMore && (
          <div className="w-full flex justify-center py-4 text-gray-500">
            <Spin size="small" />
          </div>
        )}

        {!hasMore && posts.length >= 10 && (
          <p className="text-center text-xs text-gray-400 py-4">
            No more posts to load.
          </p>
        )}
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

export default Home;
