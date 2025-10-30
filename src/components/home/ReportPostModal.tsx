import { useState } from "react";
import { Modal, Checkbox, Input, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const ReportPostModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const options = [
    "Spam or misleading",
    "Inappropriate Media",
    "Fake or incorrect location",
    "Harassment or bullying",
    "Violence or bullying",
    "Other",
  ];

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    console.log("Selected:", selectedOptions, "Info:", additionalInfo);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      className="rounded-3xl overflow-hidden"
      styles={{ body: { padding: "0px 0px 20px 0px" } }}
      title={
        <span className="font-semibold text-gray-900 text-lg">
          Help us understand what’s wrong with the post
        </span>
      }
    >
      {/* Warning Section */}
      <div className="bg-[#FFF7E6] border border-[#FFD591] rounded-lg p-4 mb-5 flex items-start space-x-3">
        <ExclamationCircleOutlined className="text-[#FAAD14] text-lg mt-0.5" />
        <div>
          <p className="font-semibold text-[#FAAD14] mb-1">
            Report Responsibly.
          </p>
          <p className="text-gray-600 text-sm">
            False reports may result in action against your account. Only report
            content that violates our community guidelines.
          </p>
        </div>
      </div>

      {/* Checkbox List */}
      <div className="flex flex-col space-y-3 mb-4">
        {options.map((option) => (
          <Checkbox
            key={option}
            checked={selectedOptions.includes(option)}
            onChange={() => toggleOption(option)}
            className="text-gray-800"
          >
            {option}
          </Checkbox>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mb-4">
        <p className="font-medium text-gray-700 mb-1">
          Additional Information (optional)
        </p>
        <Input.TextArea
          placeholder="Provide any additional context that might help our review team..."
          rows={3}
          className="rounded-xl text-sm"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="primary"
        block
        size="large"
        className="rounded-xl bg-[#8869F3] hover:bg-[#7c5dee] font-medium"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Modal>
  );
};

export default ReportPostModal;
