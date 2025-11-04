import React, { useState } from "react";
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
import {
  PaperClipOutlined,
  EnvironmentOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import AddPostAPI from "../../api/addPostApi/AddPostAPI";

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddPostModal: React.FC<PostModalProps> = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const handleUpload = async (file: RcFile) => {
    try {
      setLoading(true);
      const res = await AddPostAPI.uploadMedia(file);
      if (res?.data?.url) {
        const newFile: UploadFile = {
          uid: file.uid,
          name: file.name,
          status: "done",
          url: res.data.url,
          originFileObj: file,
        };
        setFiles((prev) => [...prev, newFile]);
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
    if (!location) {
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
          coordinates: [33.669026, 72.999154],
        },
      };

      await AddPostAPI.createPost(postPayload);
      message.success("Post created successfully!");
      setText("");
      setFiles([]);
      setLocation("");
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
        className="!max-w-[724px] !h-[652px]"
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
                <Avatar
                  src="https://randomuser.me/api/portraits/men/45.jpg"
                  size={45}
                />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-800">Alex Costa</h3>
                  <Button
                    size="small"
                    className="rounded-full text-xs bg-gray-100 text-gray-700"
                    onClick={() => setPrivacyModalVisible(true)}
                  >
                    {visibility === "public" ? "Public" : "Contacts Only"}
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
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {files.map((file) => (
                    <div
                      key={file.uid}
                      className="relative rounded-xl overflow-hidden group"
                    >
                      {file.type?.startsWith("video") ? (
                        <video
                          src={file.url}
                          controls
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <CloseCircleOutlined
                        onClick={() => removeFile(file.uid)}
                        className="absolute top-2 right-2 text-white text-lg cursor-pointer bg-black/60 rounded-full p-1 opacity-90 hover:opacity-100 transition"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="w-10 h-10 rounded-full border border-Stroke-1 flex items-center justify-center">
                <Upload
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept="image/*,video/*"
                  className="flex items-center justify-center"
                >
                  <Button
                    type="text"
                    icon={<PaperClipOutlined style={{ fontSize: "20px" }} />}
                    className="flex items-center justify-center"
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

              <Input
                prefix={<EnvironmentOutlined style={{ fontSize: "15px" }} />}
                placeholder="Enter a location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mb-4 h-12 rounded-xl text-[#8869F3]"
              />

              <div className="w-full h-[400px] rounded-xl overflow-hidden mb-5">
                <iframe
                  title="map"
                  width="100%"
                  height="100%"
                  className="border-none"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-105.0%2C39.7%2C-104.9%2C39.8&amp;layer=mapnik"
                ></iframe>
              </div>

              <div className="flex gap-3">
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
              className="!bg-[#8869F3] h-12 rounded-xl text-lg font-medium"
              onClick={() => setPrivacyModalVisible(false)}
            >
              Done
            </Button>
          </div>
        }
        centered
        title={<span className="font-semibold text-base">Post settings</span>}
        className="rounded-xl overflow-hidden shadow-lg p-0"
        width={300}
        styles={{
          body: { padding: "8px 20px" },
        }}
      >
        <Radio.Group
          onChange={(e) => setVisibility(e.target.value)}
          value={visibility}
          className="w-full"
        >
          <div className="flex justify-between items-center py-2 cursor-pointer">
            <div className="flex items-center gap-4">
              <GlobalOutlined className="text-xl text-gray-700" />
              <span className="font-normal text-base text-gray-800">
                Public
              </span>
            </div>
            <Radio value="public" className="custom-purple-radio" />
          </div>

          <div className="flex justify-between items-center py-2 cursor-pointer">
            <div className="flex items-center gap-4">
              <TeamOutlined className="text-xl text-gray-700" />
              <span className="font-normal text-base text-gray-800">
                Contacts Only
              </span>
            </div>
            <Radio value="contacts" className="custom-purple-radio" />
          </div>
        </Radio.Group>
      </Modal>
    </>
  );
};

export default AddPostModal;
