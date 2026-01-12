import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Input,
  Button,
  Avatar,
  Upload,
  message,
  Spin,
  Radio,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import {
  GoogleMap,
  Autocomplete,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import AddPostAPI from "../../api/addPostApi/AddPostAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";
import PostAPI from "../../api/postApi/PostAPI";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  editPostData?: any | null;
  onCloseAll: any;
  postsRefetch: any;
}

const defaultCenter = { lat: 33.6844, lng: 73.0479 };

const AddPostModal: React.FC<PostModalProps> = ({
  visible,
  onClose,
  editPostData,
  onCloseAll,
  postsRefetch,
}) => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const isEditMode = Boolean(editPostData);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const onLoadAutocomplete = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place || !place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setCoords({ lat, lng });
    setLocation(place.formatted_address || "");
  };

  const reverseGeocode = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setLocation(results[0].formatted_address);
      } else {
        setLocation("");
      }
    });
  };

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_COUNT = 5;

  const handleUpload = async (file: RcFile) => {
    if (files.length >= MAX_FILE_COUNT) {
      message.error(`You can only upload up to ${MAX_FILE_COUNT} files.`);
      return Upload.LIST_IGNORE;
    }

    const isLtSize = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;
    if (!isLtSize) {
      message.error(`File must be smaller than ${MAX_FILE_SIZE_MB}MB!`);
      return Upload.LIST_IGNORE;
    }

    try {
      setLoading(true);
      const res = await AddPostAPI.multiUploadMedia([file]);
      const uploaded = res?.data;

      if (Array.isArray(uploaded) && uploaded.length > 0) {
        const newFiles: UploadFile[] = uploaded.map((item) => ({
          uid: file.uid,
          name: file.name,
          status: "done" as const,
          url: item.url,
          type: item.type,
          originFileObj: file,
        }));
        setFiles((prev: UploadFile[]) => [...prev, ...newFiles]);
        message.success(`${file.name} uploaded successfully`);
      } else {
        message.error("Upload failed!");
      }
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload file!";

      message.error(backendMessage);
    } finally {
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    if (editPostData) {
      const post = editPostData;
      setText(post.data.content);
      setVisibility(post.data.visibility);

      const formattedFiles = Array.isArray(post.media)
        ? post.data.media.map((m: any) => ({
            uid: m._id,
            name: m.type === "video" ? "video.mp4" : "image.jpg",
            status: "done",
            url: m.url,
            type: m.type === "video" ? "video/mp4" : "image/jpeg",
          }))
        : [];

      setFiles(formattedFiles);
      if (post.data.location?.coordinates) {
        setCoords({
          lat: post.data.location.coordinates[1],
          lng: post.data.location.coordinates[0],
        });
      }
      setLocation(post.data.address || "");
      setStep(1);
    } else {
      setText("");
      setVisibility("public");
      setFiles([]);
      setLocation("");
      setCoords(null);
      setStep(1);
    }
  }, [editPostData, visible]);

  const removeFile = (uid: string) => {
    setFiles((prev) => prev.filter((f) => f.uid !== uid));
  };

  const handleNext = () => {
    if (!text && files.length === 0) {
      message.warning("Please add text or media before proceeding!");
      return;
    }
    setStep(2);
  };

  const handlePost = async () => {
    if (!coords) {
      message.warning("Please select a location.");
      return;
    }

    setLoading(true);

    const payload: any = {
      content: text,
      visibility,
      location: {
        type: "Point",
        coordinates: [coords.lng, coords.lat],
      },
    };

    if (!isEditMode) {
      payload.media = files.map((f) => ({
        url: f.url!,
        type: f.type?.startsWith("video") ? "video" : "image",
      }));
    }

    try {
      if (isEditMode) {
        await PostAPI.updatePostById(editPostData.data._id, payload);
        message.success("Post updated!");
      } else {
        await AddPostAPI.createPost(payload);
        message.success("Post created!");
        window.location.reload();
        return;
      }
    } catch (err) {
      message.error("Failed to submit.");
      setLoading(false);
      return;
    }

    try {
      onCloseAll?.();
      postsRefetch?.();
      onClose?.();
    } catch (uiError) {
      console.warn("UI cleanup error:", uiError);
    }

    setLoading(false);
  };

  const detectLocationFromText = async (text: string) => {
    if (!window.google || !text) return;

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request: google.maps.places.FindPlaceFromQueryRequest = {
      query: text,
      fields: ["name", "geometry", "formatted_address"],
    };

    return new Promise<void>((resolve) => {
      service.findPlaceFromQuery(request, (results, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !results ||
          !results[0]
        ) {
          resolve();
          return;
        }

        const place = results[0];

        if (!place.geometry || !place.geometry.location) {
          resolve();
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setCoords({ lat, lng });
        setLocation(place.formatted_address || place.name || "");

        resolve();
      });
    });
  };

  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        centered
        width={724}
        className="!max-w-[724px] !h-[652px] custom-modal"
        maskClosable={false}
      >
        <Spin spinning={loading}>
          {step === 1 ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-black text-base font-medium">
                  {isEditMode ? "Edit Post" : "Create Post"}
                </h2>
              </div>

              <div className="flex items-center mb-3">
                <Avatar src={user?.image} size={45} />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">
                    {user?.fullName}
                  </h3>
                  <Button
                    size="small"
                    className="rounded text-xs !bg-[#8869F326] !text-[#8869F3] border-none"
                    onClick={() => setPrivacyModalVisible(true)}
                  >
                    {visibility === "public" ? "Public" : "Contacts Only"}
                    <img src="/icons/postPrivacy-icon.svg" alt="Icon" />
                  </Button>
                </div>
              </div>

              <Input.TextArea
                value={text}
                onChange={async (e) => {
                  const val = e.target.value;
                  setText(val);
                  await detectLocationFromText(val);
                }}
                placeholder="What's on your mind?"
                autoSize={{ minRows: 3, maxRows: 5 }}
                className="border-none text-base mb-4"
              />

              {files.length > 0 && (
                <div className="relative">
                  <div className="relative">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation
                      pagination={{ clickable: true }}
                      spaceBetween={10}
                      className="w-full rounded-xl overflow-hidden custom-swiper"
                      style={{ zIndex: 1 }}
                    >
                      {files.map((file) => (
                        <SwiperSlide
                          key={file.uid}
                          className="flex justify-center items-center relative"
                          style={{
                            height: "400px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {file.type?.startsWith("video") ? (
                            <video
                              key={file.uid}
                              src={file.url}
                              controls
                              preload="metadata"
                              className="max-h-[400px] w-auto object-contain rounded-lg"
                            />
                          ) : (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="max-h-[400px] w-auto object-contain rounded-lg"
                            />
                          )}

                          {!isEditMode && (
                            <CloseCircleOutlined
                              onClick={() => removeFile(file.uid)}
                              className="absolute top-3 right-3 z-20 bg-gray-100 rounded-full text-2xl cursor-pointer"
                            />
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}

              {!isEditMode && (
                <div className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer">
                  <Upload
                    beforeUpload={handleUpload}
                    showUploadList={false}
                    accept="image/*,video/*"
                    className="flex items-center justify-center"
                  >
                    <img
                      src="/icons/attachment-icon.svg"
                      alt="Show"
                      width={20}
                    />
                  </Upload>
                </div>
              )}

              <div className="flex gap-2 w-full mt-2">
                <Button
                  block
                  onClick={onClose}
                  className="h-12 rounded-xl !text-[#666666] !border-[#666666]"
                >
                  Close
                </Button>
                <Button
                  type="primary"
                  block
                  className="!bg-[#8869F3] !border-[#8869F3] h-12 rounded-xl shadow-none"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-black text-base font-medium">
                  Choose Location
                </h2>
              </div>
              {isLoaded ? (
                <div className="w-full flex flex-col gap-3">
                  <Autocomplete
                    onLoad={onLoadAutocomplete}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <Input
                      placeholder="Search for a place"
                      value={location}
                      prefix={
                        <img
                          src="/icons/search-icon.svg"
                          alt="Icon"
                          className="w-6 h-6"
                        />
                      }
                      onChange={(e) => setLocation(e.target.value)}
                      className="rounded-xl mb-2 h-12 focus:!border-[#8869F3] hover:!border-[#8869F3] focus-within:!border-[#8869F3]"
                    />
                  </Autocomplete>

                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={coords || defaultCenter}
                    zoom={14}
                    onClick={(e) => {
                      const lat = e.latLng?.lat();
                      const lng = e.latLng?.lng();
                      if (!lat || !lng) return;

                      setCoords({ lat, lng });
                      reverseGeocode(lat, lng);
                    }}
                  >
                    {coords && <Marker position={coords} />}
                  </GoogleMap>
                </div>
              ) : (
                <p>Loading map...</p>
              )}
              <div className="flex gap-3 mt-5">
                <Button
                  block
                  onClick={() => setStep(1)}
                  className="h-12 rounded-xl !text-[#666666] !border-[#666666]"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  block
                  className="!bg-[#8869F3] !border-[#8869F3] h-12 rounded-xl shadow-none"
                  onClick={handlePost}
                >
                  {isEditMode ? "Update Post" : "Post"}
                </Button>
              </div>
            </>
          )}
        </Spin>
      </Modal>

      <Modal
        open={privacyModalVisible}
        maskClosable={false}
        onCancel={() => setPrivacyModalVisible(false)}
        footer={
          <div className="p-0 border-t-0">
            <Button
              type="primary"
              block
              className="!bg-[#8869F3] h-12 rounded-xl text-sm font-light shadow-none"
              onClick={() => setPrivacyModalVisible(false)}
            >
              Done
            </Button>
          </div>
        }
        centered
        title={
          <span className="text-black text-base font-medium">
            Post settings
          </span>
        }
        className="rounded-xl overflow-hidden shadow-lg custom-modal"
        width={350}
        styles={{
          body: { padding: "8px 0px 32px 0px" },
        }}
      >
        <Radio.Group
          onChange={(e) => setVisibility(e.target.value)}
          value={visibility}
          className="w-full"
        >
          <div className="flex justify-between items-center py-2 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-white p-2 rounded-full border border-gray-300">
                <img
                  src="/icons/public-icon.svg"
                  alt="Icon"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-black text-sm font-medium">Public</span>
            </div>
            <Radio value="public" className="custom-purple-radio" />
          </div>

          <div className="flex justify-between items-center py-2 cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-white p-2 rounded-full border border-gray-300">
                <img
                  src="/icons/contact-icon.svg"
                  alt="Icon"
                  className="w-5 h-5"
                />
              </div>
              <span className="text-black text-sm font-medium">
                Contacts Only
              </span>
            </div>
            <Radio value="private" className="custom-purple-radio" />
          </div>
        </Radio.Group>
      </Modal>
    </>
  );
};

export default AddPostModal;
