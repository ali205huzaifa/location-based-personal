import { useState, useEffect } from "react";
import { Form, Input, Button, Divider, DatePicker, message } from "antd";
import { useNavigate } from "react-router-dom";
import AuthAPI from "../../api/authApi/AuthAPI";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

        // Fallback if locality missing (common in some countries)
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

  const handleSignup = async (values: any) => {
    setLoading(true);

    try {
      if (!userLocation) {
        message.error("Location is required. Please allow location access.");
        return;
      }

      const payload = {
        fullName: values.fullName,
        username: values.username,
        email: values.email,
        password: values.password,
        dob: values.dob,
        location: userLocation.locationString,
      };

      const { data } = await AuthAPI.SignUp(payload);
      message.success(data.message || "Account created successfully!");
      navigate("/verify", {
        state: {
          email: values.email,
        },
      });
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center text-left bg-violet-500/10 px-8">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center py-8">
            <img
              src="/icons/logo.svg"
              alt="Logo"
              className="h-24 w-auto object-contain cursor-pointer"
            />
          </div>
          <h2 className="text-[#000000] text-4xl font-semibold mb-3 leading-snug">
            Join the Community, Start Connecting
          </h2>
          <p className="text-[#666666] text-2xl font-normal leading-relaxed mb-4">
            Create your account and explore people, posts, and stories around
            you — your local world is waiting!
          </p>

          <img
            src="/images/login.svg"
            alt="Login"
            className="xl:max-w-[596px] lg:max-w-[466px] md:max-w-[350px] mx-auto"
          />
        </div>
      </div>

      <div className="md:w-1/2 w-full flex items-center justify-center px-6 sm:px-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-black text-4xl font-medium mb-8">Signup</h2>

          <Form layout="vertical" onFinish={handleSignup}>
            <Form.Item
              name="fullName"
              label="Full Name"
              className="text-xs font-normal text-[#000000]"
              rules={[
                { required: true, message: "Please enter your full name" },
                { max: 30, message: "Full Name cannot exceed 30 characters" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter Full Name"
                className="rounded-xl h-12 focus:!border-[#8869F3] hover:!border-[#8869F3]"
              />
            </Form.Item>

            <div className="flex gap-3">
              <Form.Item
                name="username"
                label="Username"
                className="flex-1 text-xs font-normal text-[#000000] "
                rules={[
                  { required: true, message: "Please create a username" },
                  { max: 30, message: "Username cannot exceed 30 characters" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Create username"
                  className="rounded-xl h-12 focus:!border-[#8869F3] hover:!border-[#8869F3]"
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                className="flex-1 text-xs font-normal text-[#000000]"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email address" },
                  { max: 30, message: "Email cannot exceed 30 characters" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  className="rounded-xl h-12 focus:!border-[#8869F3] hover:!border-[#8869F3]"
                />
              </Form.Item>
            </div>

            <div className="flex gap-3">
              <Form.Item
                name="password"
                label="Password"
                className="flex-1 text-xs font-normal text-[#000000]"
                rules={[
                  { required: true, message: "Please enter your password" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  className="rounded-xl h-12 focus:!border-[#8869F3] hover:!border-[#8869F3]"
                  iconRender={(visible) =>
                    visible ? (
                      <img
                        src="/icons/eyeOpen-icon.svg"
                        alt="Show password"
                        style={{ width: 16, height: 16 }}
                      />
                    ) : (
                      <img
                        src="/icons/eyeClose-icon.svg"
                        alt="Hide password"
                        style={{ width: 16, height: 16 }}
                      />
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                className="flex-1 text-xs font-normal text-[#000000]"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Re-enter your password"
                  className="rounded-xl h-12 focus:!border-[#8869F3] hover:!border-[#8869F3]"
                  iconRender={(visible) =>
                    visible ? (
                      <img
                        src="/icons/eyeOpen-icon.svg"
                        alt="Show password"
                        style={{ width: 16, height: 16 }}
                      />
                    ) : (
                      <img
                        src="/icons/eyeClose-icon.svg"
                        alt="Hide password"
                        style={{ width: 16, height: 16 }}
                      />
                    )
                  }
                />
              </Form.Item>
            </div>

            <Form.Item
              name="dob"
              label="Age"
              className="text-xs font-normal text-[#000000]"
              rules={[
                { required: true, message: "Please select your date of birth" },
              ]}
            >
              <DatePicker
                size="large"
                suffixIcon={
                  <img
                    src="/icons/calendar-icon.svg"
                    alt="calendar"
                    style={{ width: 20, height: 20 }}
                  />
                }
                format="YYYY/MM/DD"
                className="w-full rounded-xl h-12 focus:!border-[#8869F3] hover:!border-[#8869F3]"
                placeholder="YYYY/MM/DD"
              />
            </Form.Item>

            <Button
              htmlType="submit"
              loading={loading}
              className="w-full !h-12 !bg-[#8869F3] border-none !text-white text-lg rounded-xl shadow-none !mt-6"
            >
              Signup
            </Button>

            <Divider className="!text-stone-500 !text-sm !font-normal !my-8">
              or continue with
            </Divider>

            <div className="flex justify-center gap-8">
              <Button
                shape="circle"
                size="large"
                icon={
                  <img
                    src="/icons/google-icon.svg"
                    alt="Google"
                    className="w-6 h-6"
                  />
                }
                className="!w-12 !h-12 border border-gray-300 hover:border-[#8869F3] hover:text-[#8869F3]"
              />

              <Button
                shape="circle"
                size="large"
                icon={
                  <img
                    src="/icons/apple-icon.svg"
                    alt="Apple"
                    className="w-6 h-6"
                  />
                }
                className="!w-12 !h-12 border border-gray-300 hover:border-[#8869F3] hover:text-[#8869F3]"
              />
            </div>

            <div className="!mt-12">
              <p className="text-center !mt-8 text-gray-600 text-sm font-normal">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-[#7C4DFF] cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
