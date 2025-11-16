import React, { useState, useEffect } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setAuthData } from "../../store/Auth";
import { message } from "antd";
import ProfileAPI from "../../api/profileApi/ProfileAPI";

const LanguageSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { currentUser, token } = useSelector((state: RootState) => state.auth);

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    currentUser?.language || "English"
  );
  const [loading, setLoading] = useState(false);

  const languages = [
    { name: "English", flag: "/icons/us-flag-icon.svg" },
    { name: "French", flag: "/icons/french-flag-icon.svg" },
  ];

  useEffect(() => {
    if (currentUser?.language) {
      setSelectedLanguage(currentUser.language);
    }
  }, [currentUser]);

  const handleLanguageChange = async (language: string) => {
    if (!token) {
      message.error("You must be logged in to change language.");
      return;
    }

    setSelectedLanguage(language);
    setLoading(true);

    try {
      await ProfileAPI.UpdateLanguage({ language }, token);

      dispatch(
        setAuthData({
          token,
          currentUser: { ...currentUser, language },
        })
      );

      message.success(`Language changed to ${language}`);
    } catch (error: any) {
      console.error("Language update error:", error);
      message.error(
        error?.response?.data?.message ||
          "Failed to update language. Please try again."
      );
      setSelectedLanguage(currentUser?.language || "English");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-black text-2xl font-medium mb-2">Language</h2>
        <p className="text-[#666666] text-sm font-normal">
          Choose your preferred language to make your app experience more
          comfortable and <br />
          familiar.
        </p>
      </div>

      <div className="space-y-3 w-full pr-8">
        {languages.map((lang) => (
          <div
            key={lang.name}
            onClick={() => handleLanguageChange(lang.name)}
            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all border-gray-200 bg-white ${
              loading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm">
                <img
                  src={lang.flag}
                  alt={lang.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-gray-900">{lang.name}</span>
            </div>

            {selectedLanguage === lang.name && (
              <CheckOutlined className="text-[#22C55E] text-lg" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettings;
