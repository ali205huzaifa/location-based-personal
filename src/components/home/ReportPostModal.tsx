import React, { useState } from "react";
import { Modal, Radio, Input, Button, message } from "antd";
import { WarningOutlined } from "@ant-design/icons";

interface ReportPostModalProps {
  visible: boolean;
  onClose: () => void;
}

const ReportPostModal: React.FC<ReportPostModalProps> = ({
  visible,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const reportReasons = [
    "Spam or misleading",
    "Hate speech or symbols",
    "Harassment or bullying",
    "False information",
    "Violence or dangerous acts",
    "Intellectual property violation",
    "Other",
  ];

  const handleSubmit = () => {
    if (!selectedReason) {
      message.warning("Please select a reason before submitting.");
      return;
    }
    message.success("Report submitted successfully!");
    setSelectedReason("");
    setDetails("");
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={420}
      title={
        <div className="flex items-center space-x-2">
          <WarningOutlined className="text-red-500 text-lg" />
          <span className="font-semibold text-gray-800">Report Post</span>
        </div>
      }
      styles={{ body: { padding: "20px 24px" } }}
      className="rounded-2xl overflow-hidden"
    >
      <p className="text-sm text-gray-600 mb-4">
        Please select a reason for reporting this post:
      </p>

      <Radio.Group
        onChange={(e) => setSelectedReason(e.target.value)}
        value={selectedReason}
        className="flex flex-col space-y-2 mb-3"
      >
        {reportReasons.map((reason) => (
          <Radio key={reason} value={reason} className="text-sm text-gray-800">
            {reason}
          </Radio>
        ))}
      </Radio.Group>

      {selectedReason === "Other" && (
        <Input.TextArea
          rows={3}
          placeholder="Please describe the issue..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="rounded-lg mb-3"
        />
      )}

      <Button
        type="primary"
        block
        size="large"
        className="rounded-full"
        style={{ backgroundColor: "#ef4444", border: "none" }}
        onClick={handleSubmit}
      >
        Submit Report
      </Button>
    </Modal>
  );
};

export default ReportPostModal;
