import React, { useState, useRef } from "react";
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
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
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

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
}

const defaultCenter = { lat: 33.6844, lng: 73.0479 };

const AddPostModal: React.FC<PostModalProps> = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const user = useSelector((state: RootState) => state.auth.currentUser);

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
    } catch (error) {
      console.error(error);
      message.error("Failed to upload file!");
    } finally {
      setLoading(false);
    }

    return false;
  };

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
      message.warning("Please select a location before posting!");
      return;
    }

    setLoading(true);

    try {
      const postPayload = {
        content: text,
        media: files.map((file) => ({
          url: file.url!,
          type: file.type?.startsWith("video") ? "video" : "image",
        })),
        visibility,
        location: {
          type: "Point",
          coordinates: [coords.lng, coords.lat],
        },
      };

      await AddPostAPI.createPost(postPayload);
      message.success("Post created successfully!");
      setText("");
      setFiles([]);
      setLocation("");
      setCoords(null);
      setStep(1);
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Failed to create post!");
    } finally {
      setLoading(false);
    }
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
      >
        <Spin spinning={loading}>
          {step === 1 ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-black text-base font-medium">
                  Create Post
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
                    className="rounded text-xs bg-[#8869F326] text-[#8869F3]"
                    onClick={() => setPrivacyModalVisible(true)}
                  >
                    {visibility === "public" ? "Public" : "Contacts Only"}
                    <img src="/icons/postPrivacy-icon.svg" alt="Icon" />
                  </Button>
                </div>
              </div>

              <Input.TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
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

                          <CloseCircleOutlined
                            onClick={() => removeFile(file.uid)}
                            className="absolute top-3 right-3 z-20 bg-gray-100 rounded-full border-gray-200 text-2xl cursor-pointer"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              )}

              <div className="w-10 h-10 rounded-full border border-Stroke-1 flex items-center justify-center">
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
                    height={20}
                    className="flex items-center justify-center cursor-pointer"
                  />
                </Upload>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <Button
                  block
                  onClick={onClose}
                  className="h-12 rounded-xl text-gray-500"
                >
                  Close
                </Button>
                <Button
                  type="primary"
                  block
                  className="!bg-[#8869F3] h-12 rounded-xl"
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
                      prefix={<SearchOutlined />}
                      onChange={(e) => setLocation(e.target.value)}
                      className="rounded-lg mb-2 h-12"
                    />
                  </Autocomplete>

                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={coords || defaultCenter}
                    zoom={14}
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
                  className="h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  block
                  className="!bg-[#8869F3] h-12 rounded-xl"
                  onClick={handlePost}
                >
                  Post
                </Button>
              </div>
            </>
          )}
        </Spin>
      </Modal>

      <Modal
        open={privacyModalVisible}
        onCancel={() => setPrivacyModalVisible(false)}
        footer={
          <div className="p-0 border-t-0">
            <Button
              type="primary"
              block
              className="!bg-[#8869F3] h-12 rounded-xl text-sm font-light"
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
              <span className="ftext-black text-sm font-medium">Public</span>
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
