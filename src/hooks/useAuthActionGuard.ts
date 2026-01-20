import { Modal } from "antd";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export const useAuthActionGuard = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const requireAuth = (action: () => void) => {
    if (!currentUser) {
      Modal.info({
        centered: true,
        icon: null,
        maskClosable: true,
        title: "Login Required",
        content: "Please login to perform this action.",
        okText: "Login",
        okButtonProps: {
          style: {
            backgroundColor: "#8869F3",
            borderColor: "#8869F3",
            color: "#fff",
            boxShadow: "none",
          },
        },
        onOk: () => {
          window.location.href = "/login";
        },
      });
      return;
    }

    action();
  };

  return { requireAuth, isAuthenticated: !!currentUser };
};
