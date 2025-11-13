import React, { useState, useCallback, useRef, useEffect } from "react";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  MarkerClusterer,
  StandaloneSearchBox,
  InfoWindow,
} from "@react-google-maps/api";
import PostModal from "./PostModal";
import SharePostModal from "./SharePostModal";
import PostAPI from "../../api/postApi/PostAPI";

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

const defaultCenter = { lat: 33.6844, lng: 73.0479 };

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [popupPostId, setPopupPostId] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await PostAPI.getPublicPosts();
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition border border-gray-100 p-2"
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
          <span className="flex items-center">
            <img
              src="/icons/share-icon.svg"
              alt="Share"
              className="w-4 h-4 mr-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
              }}
            />
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

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  const handleSearchLoad = (ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  };

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      if (place.geometry?.location && map) {
        map.panTo(place.geometry.location);
        map.setZoom(14);
      }
    }
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
        <div className="flex justify-center py-4 w-full">
          <div className="w-full">
            <StandaloneSearchBox
              onLoad={handleSearchLoad}
              onPlacesChanged={handlePlacesChanged}
            >
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search"
                allowClear
                className="!h-10 !text-sm !w-full outline-[#8869F3]"
              />
            </StandaloneSearchBox>
          </div>
        </div>

        <div className="relative w-full h-full rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={defaultCenter}
            zoom={4}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <MarkerClusterer
              averageCenter
              enableRetinaIcons
              gridSize={60}
              minimumClusterSize={2}
            >
              {(clusterer) => (
                <>
                  {posts.map((post) => (
                    <Marker
                      key={post._id}
                      position={{
                        lat: post.location?.coordinates[1],
                        lng: post.location?.coordinates[0],
                      }}
                      clusterer={clusterer}
                      icon={{
                        url:
                          post.media?.length > 0
                            ? post.media[0].url
                            : "/icons/default-pin.png",
                        scaledSize: new google.maps.Size(50, 50),
                      }}
                      onClick={() => setPopupPostId(post._id)}
                    />
                  ))}
                </>
              )}
            </MarkerClusterer>

            {popupPostId && (
              <InfoWindow
                position={{
                  lat: posts.find((p) => p._id === popupPostId)?.location
                    ?.coordinates[1],
                  lng: posts.find((p) => p._id === popupPostId)?.location
                    ?.coordinates[0],
                }}
                onCloseClick={() => setPopupPostId(null)}
              >
                <div className="p-2 w-56">
                  <p className="font-semibold text-sm mb-1">
                    {posts.find((p) => p._id === popupPostId)?.user?.username}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {posts.find((p) => p._id === popupPostId)?.content}
                  </p>
                  {posts.find((p) => p._id === popupPostId)?.media?.length >
                    0 && (
                    <img
                      src={
                        posts.find((p) => p._id === popupPostId)?.media[0].url
                      }
                      alt="Post"
                      className="w-full h-24 object-cover mt-2 rounded"
                    />
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
            <button
              className="bg-white w-9 h-9 flex items-center justify-center rounded-md shadow"
              onClick={() => map && map.setZoom(map.getZoom()! + 1)}
            >
              +
            </button>
            <button
              className="bg-white w-9 h-9 flex items-center justify-center rounded-md shadow"
              onClick={() => map && map.setZoom(map.getZoom()! - 1)}
            >
              −
            </button>
          </div>
        </div>
      </div>

      <div className="xl:w-80 w-72 h-full xl:mr-8 md:mr-0 overflow-y-auto bg-[#F9FAFB] p-2 space-y-4">
        {posts.map((post) => (
          <MapCard
            key={post._id}
            image={
              post.media?.length
                ? post.media[0].url
                : "https://via.placeholder.com/150"
            }
            caption={post.content || "No content"}
            likes={post.interaction?.likeCount || 0}
            comments={post.interaction?.commentCount || 0}
            shares={0}
            location={post.metadata?.publisherName || post.user?.fullName}
            username={post.user?.username}
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
