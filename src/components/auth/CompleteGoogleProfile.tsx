import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, DatePicker } from "antd";
import dayjs from "dayjs";
import AuthAPI from "../../api/authApi/AuthAPI";
import { useDispatch } from "react-redux";
import { setAuthData } from "../../store/Auth";
import { decryptPrivateKeyHybrid } from "../../util/Decryption";

const CompleteGoogleProfile: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [token, setToken] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [userLocation, setUserLocation] = useState<any>(null);

  useEffect(() => {
    const fetchLocationOnLoad = async () => {
      try {
        const coords: any = await getUserLocation();
        const locationString = await getLocationString(coords.lat, coords.lng);

        setUserLocation({
          coords,
          locationString,
        });
      } catch (error) {
        message.warning("Please allow location access for better experience.");
      }
    };

    fetchLocationOnLoad();
  }, []);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error.message || "Unable to fetch location.");
        }
      );
    });
  };

  const getLocationString = async (
    lat: number,
    lng: number
  ): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error("Google Maps API Key is missing!");
        return "Unknown";
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );

      const data = await response.json();

      if (!data.results || data.results.length === 0) return "Unknown";

      const addressComponents = data.results[0].address_components;

      let city = "Unknown";
      let country = "Unknown";

      addressComponents.forEach((component: any) => {
        if (component.types.includes("locality")) {
          city = component.long_name;
        }

        if (
          component.types.includes("administrative_area_level_2") &&
          city === "Unknown"
        ) {
          city = component.long_name;
        }

        if (component.types.includes("country")) {
          country = component.long_name;
        }
      });

      return `${city}, ${country}`;
    } catch (error) {
      console.error("Google Maps reverse geocoding error:", error);
      return "Unknown";
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("userId");
    const emailParam = params.get("email");
    const name = params.get("fullName");
    const msg = params.get("message");
    const tokenParam = params.get("token");

    if (id) setUserId(id);
    if (emailParam) setEmail(emailParam);
    if (name) setFullName(name);
    if (msg) setInfoMessage(msg || "");
    if (tokenParam) setToken(tokenParam);
  }, [location.search]);

  const handleSubmit = async (values: {
    username: string;
    dob: number;
    location: string;
  }) => {
    try {
      if (!userLocation) {
        message.error("Location is required. Please allow location access.");
        return;
      }

      setLoading(true);

      const formattedDob = dayjs(values.dob).toISOString();

      const res = await AuthAPI.CompleteGoogleProfile(userId, {
        username: values.username,
        dob: formattedDob,
        location: userLocation.locationString,
      });

      const newToken = res?.data?.data?.token || token;
      const clientSecret = res?.data?.data?.clientSecret;

      if (!newToken) {
        throw new Error("Token missing after profile completion");
      }

      const verifyRes = await AuthAPI.verifyToken(newToken);
      const user = verifyRes?.data;

      dispatch(
        setAuthData({
          currentUser: user,
          token: newToken,
        })
      );

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
        localStorage.setItem("publicKey", user.userPublicKey);
      }

      localStorage.setItem("token", newToken);

      message.success("Profile completed and logged in successfully!");
      navigate("/home");
    } catch (err: any) {
      console.error("Profile completion failed:", err);
      message.error(
        err?.response?.data?.message || "Failed to complete profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-center text-[#000000] mb-2">
          Complete Your Profile
        </h1>
        {infoMessage && (
          <p className="text-center text-sm text-gray-500 font-normal mb-6">
            {infoMessage}
          </p>
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Full Name">
            <Input value={fullName} disabled className="!h-10 rounded-xl" />
          </Form.Item>

          <Form.Item label="Email">
            <Input value={email} disabled className="!h-10 rounded-xl" />
          </Form.Item>

          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input
              placeholder="Choose a username"
              className="!h-10 rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              size="large"
              format="YYYY/MM/DD"
              className="w-full !h-10 rounded-xl"
              placeholder="YYYY/MM/DD"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full mt-4 !bg-[#8869F3] !h-10 rounded-xl"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CompleteGoogleProfile;
