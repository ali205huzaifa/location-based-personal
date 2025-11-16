import React from "react";
import { Modal, Button } from "antd";

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      maskClosable={false}
      className="custom-modal cursor-pointer"
    >
      <div className="text-center py-4">
        <p className="text-lg font-semibold mb-6">Do you want to Logout?</p>
        <div className="flex justify-center gap-4">
          <Button type="primary" onClick={onConfirm} className="!bg-[#8869F3]">
            Yes
          </Button>
          <Button onClick={onClose}>No</Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
