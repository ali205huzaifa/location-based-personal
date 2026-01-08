import { useState } from "react";
import { Modal, Checkbox, Input, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const ReportPostModal = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], description: string) => void;
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
    if (selectedOptions.length === 0) return;
    onSubmit(selectedOptions, additionalInfo);
  };

  return (
    <Modal
      title={<div className="text-black text-lg font-medium">Report Post</div>}
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={724}
      className="rounded-3xl overflow-hidden"
      styles={{ body: { padding: "0px 0px 20px 0px" } }}
    >
      <div className="text-black text-2xl font-medium mb-4">
        {" "}
        Help us understand what’s wrong with the post
      </div>
      <div className="bg-[#F59E0B1A] border border-[#F8E7CC] rounded-lg p-4 mb-5 flex items-start space-x-3">
        <ExclamationCircleOutlined className="text-[#F59E0B] text-lg mt-1" />
        <div>
          <p className="font-semibold text-xl text-[#F59E0B] mb-1">
            Report Responsibly.
          </p>
          <p className="text-[#F59E0B] text-sm font-light">
            False reports may result in action against your account. Only report
            content that violates our community guidelines.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-3 mb-4">
        {options.map((option) => (
          <Checkbox
            key={option}
            checked={selectedOptions.includes(option)}
            onChange={() => toggleOption(option)}
            className="text-black text-sm font-light"
          >
            {option}
          </Checkbox>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-sm font-light text-black mb-1">
          Additional Information (optional)
        </p>
        <Input.TextArea
          placeholder="Provide any additional context that might help our review team..."
          rows={3}
          className="rounded-xl text-sm focus:!border-[#8869F3] hover:!border-[#8869F3]"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>

      <Button
        type="primary"
        block
        size="large"
        className="rounded-xl !bg-[#8869F3] font-medium h-[52px] mt-2 -mb-4 shadow-none"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Modal>
  );
};

export default ReportPostModal;
