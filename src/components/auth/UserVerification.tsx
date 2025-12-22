import React, { useEffect, useState } from "react";
import { Button, notification, message } from "antd";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";
import { useLocation, useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";
import ClipLoader from "react-spinners/ClipLoader";
import { decryptPrivateKeyHybrid } from "../../util/Decryption";
// import { requestFCMToken } from "../common/firebaseConfig";

const UserVerification: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  // const [fcmToken, setFcmToken] = useState<string | null>(null);

  const email = location.state?.email;

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // useEffect(() => {
  //   let isMounted = true;

  //   const setupFCM = async () => {
  //     const token = await requestFCMToken();
  //     if (isMounted && token) {
  //       setFcmToken(token);
  //     }
  //   };
  //   setupFCM();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      message.warning("Please enter the 4-digit OTP");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      // const fcmPushToken = fcmToken as string;
      // const platform = "web";

      const res = await AuthAPI.VerifyUserOTP({
        email,
        otp: Number(enteredOtp),
        // fcmPushToken,
        // platform,
      });

      // localStorage.setItem("fcmPushToken", fcmPushToken);

      const { token, clientSecret } = res?.data?.data;

      if (!token || !clientSecret) {
        throw new Error("Token or clientSecret missing from response");
      }

      notification.success({
        message: "OTP Verified Successfully",
        description: "Logging you in...",
        placement: "topRight",
      });

      await handleLoginSuccess(token, clientSecret);
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message;

      notification.error({
        message: "OTP Verification Failed",
        description: apiMessage || "Invalid or expired OTP. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (token: string, clientSecret?: string) => {
    try {
      const verifyRes = await AuthAPI.verifyToken(token);
      const user = verifyRes.data;

      dispatch(setAuthData({ currentUser: user, token }));
      localStorage.setItem("token", token);
      localStorage.setItem("publicKey", user.userPublicKey);

      if (clientSecret) {
        const privateKey = await decryptPrivateKeyHybrid({
          clientSecret,
          encryptedPrivateKey: user.encryptedPrivateKey,
          wrappedMasterKey: user.wrappedMasterKey,
          nonce: user.nonce,
          masterKeyNonce: user.masterKeyNonce,
          salt: user.salt,
        });

        localStorage.setItem("privateKey", privateKey);
        window.history.replaceState({}, document.title);
      }

      navigate("/home");
    } catch {
      notification.error({
        message: "Login Failed",
        description: "Unable to complete login. Please try again.",
        placement: "topRight",
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      await AuthAPI.VerifyUserEmailOTP({ email });

      notification.success({
        message: "OTP Resent",
        description: "A new OTP has been sent to your email.",
        placement: "topRight",
      });

      setOtp(["", "", "", ""]);
      setTimer(60);
    } catch (err: any) {
      notification.error({
        message: "Failed to Resend OTP",
        description: err?.response?.data?.message || "Something went wrong.",
        placement: "topRight",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="bg-white rounded-2xl p-8 w-[90%] sm:w-[400px] text-center border border-gray-300">
        <h2 className="text-black text-4xl font-medium mb-2">Verify OTP</h2>

        <p className="text-stone-500 text-lg mb-6">
          Enter the code sent to
          <span className="text-[#8869F3] ml-1">{email}</span>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, i)}
              className="w-12 h-12 text-center border border-gray-300 rounded-xl text-lg outline-none"
            />
          ))}
        </div>

        <Button
          type="primary"
          block
          disabled={loading}
          onClick={handleVerifyOTP}
          className="!bg-[#8869F3] h-10 rounded-lg"
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
        </Button>

        <div className="text-gray-500 text-sm mt-4">
          {timer > 0 ? (
            <>
              Resend available in{" "}
              <span className="text-[#8869F3]">
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
            </>
          ) : (
            <Button
              type="link"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-purple-500 p-0 font-semibold"
            >
              {resendLoading ? "Resending..." : "Resend code"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserVerification;
