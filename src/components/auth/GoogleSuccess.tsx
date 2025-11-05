import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import { useDispatch } from "react-redux";
import AuthAPI from "../../api/authApi/AuthAPI";
import { setAuthData } from "../../store/Auth";

const GoogleSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const handleGoogleSuccess = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        message.error("Invalid Google login response");
        navigate("/login", { replace: true });
        return;
      }

      try {
        const verifyRes = await AuthAPI.verifyToken(token);
        const user = verifyRes?.data;

        dispatch(setAuthData({ currentUser: user, token }));
        localStorage.setItem("token", token);

        message.success("Login successful!");
        navigate("/home", { replace: true });
      } catch (error) {
        console.error("Google token verification failed:", error);
        message.error("Invalid or expired Google token. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    handleGoogleSuccess();
  }, [location.search, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Logging you in...</p>
    </div>
  );
};

export default GoogleSuccess;
