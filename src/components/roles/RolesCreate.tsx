import { useEffect, useState } from "react";
import PermissionsModal from "../permissions/permissionsModal";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface RolesCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingRole: Role | null;
}

const RolesCreate: React.FC<RolesCreateProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingRole,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleSuccess = () => {
    onSuccess();
  };

  return (
    <>
      <PermissionsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        role={editingRole}
      />
    </>
  );
};

export default RolesCreate;
