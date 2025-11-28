import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input, Spin } from "antd";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerClusterer,
  OverlayView,
} from "@react-google-maps/api";
import PostModal from "./PostModal";
import SharePostModal from "./SharePostModal";
import PostAPI from "../../api/postApi/PostAPI";
import { motion, AnimatePresence } from "framer-motion";
import SearchModal from "./SearchModal";

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

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "8px",
};

const defaultCenter = { lat: 30.3753, lng: 69.3451 };

const Home: React.FC = () => {
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

  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const fetchPosts = async (offsetValue = 0) => {
    try {
      const res = await PostAPI.getPublicPosts({
        limit,
        offset: offsetValue,
      });

      const newPosts = res.data?.posts || [];
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p._id));
        const filtered = newPosts.filter((p: any) => !ids.has(p._id));
        return [...prev, ...filtered];
      });

      setOffset(offsetValue + limit);
      if (res.data?.nextPage === null) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

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
    likes,
    comments,
    shares,
    location,
    onClick,
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
            <span className="flex items-center">
              <img
                src="/icons/heart-icon.svg"
                alt="Likes"
                className="w-4 h-4 mr-1"
              />
              {likes || 0}
            </span>

            <span className="flex items-center">
              <img
                src="/icons/comment-icon.svg"
                alt="Comments"
                className="w-4 h-4 mr-1"
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
                className="w-4 h-4 mr-1"
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
    setOffset(0);
    setHasMore(true);
    setLoading(true);
    await fetchPosts(0);
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
        <div className="flex justify-center py-4 w-full relative z-10">
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
              className="!h-12 !text-sm !w-full !rounded-xl"
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
            center={defaultCenter}
            zoom={6}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
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
                        >
                          <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-white">
                            <img
                              src={
                                post.media?.[0]?.url ||
                                post.user?.image ||
                                "/icons/default-avatar.png"
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
        className="xl:w-80 w-72 h-full xl:mr-8 md:mr-0 overflow-y-auto bg-[#F9FAFB] p-2 space-y-4 no-scrollbar"
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
            location={post.address}
            username={post.user?.username}
            onClick={() => handlePostClick(post)}
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
      />
      <SharePostModal
        visible={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};

export default Home;
