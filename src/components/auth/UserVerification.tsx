import React, { useEffect, useState } from "react";
import { Button, notification, message } from "antd";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";
import { useLocation, useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";
import ClipLoader from "react-spinners/ClipLoader";
import { decryptPrivateKeyHybrid } from "../../util/Decryption";

const UserVerification: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const email = location.state?.email;
  const signupPassword = location.state?.password;

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (newOtp.join("").length === 4) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleVerifyOTP = async (enteredOtp: string) => {
    try {
      setLoading(true);

      const res = await AuthAPI.VerifyUserOTP({
        email,
        otp: Number(enteredOtp),
      });

      const token = res?.data?.data?.token;

      if (!token) {
        message.error("Token not returned from OTP verification");
      }

      notification.success({
        message: "OTP Verified Successfully",
        description: "Logging you in...",
        placement: "topRight",
      });

      await handleLoginSuccess(token);
    } catch (err: any) {
      notification.error({
        message: "Invalid OTP",
        description: "Please enter the correct OTP sent to your email.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (token: string) => {
    const verifyRes = await AuthAPI.verifyToken(token);
    const user = verifyRes.data;

    dispatch(setAuthData({ currentUser: user, token }));
    localStorage.setItem("token", token);
    localStorage.setItem("publicKey", user.userPublicKey);

    if (signupPassword) {
      const privateKey = await decryptPrivateKeyHybrid({
        password: signupPassword,
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
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      await AuthAPI.SendOTP({ email });
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
        <p className="text-stone-500 text-lg font-normal mb-6">
          Enter the code sent to your email:
          <span className="text-[#8869F3] ml-1">{email}</span>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              value={digit}
              maxLength={1}
              onChange={(e) => handleOtpChange(e.target.value, i)}
              className="w-12 h-12 text-center border border-gray-300 rounded-xl text-lg outline-none"
            />
          ))}
        </div>

        <Button
          type="primary"
          block
          onClick={() => handleVerifyOTP(otp.join(""))}
          className="!bg-[#8869F3] text-white text-base font-normal py-2 px-4 h-10 rounded-lg"
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
        </Button>

        <div className="text-gray-500 text-sm mt-4 flex justify-center items-center gap-1">
          {timer > 0 ? (
            <>
              <span>Resend available in</span>
              <span className="text-[#8869F3] ml-1">
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
