import React, { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";

const LanguageSettings: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    { name: "English", flag: "US" },
    { name: "French", flag: "FR" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-black text-2xl font-medium mb-2">Language</h2>
        <p className="text-[#666666] text-sm font-normal">
        Choose your preferred language to make your app experience more comfortable and familiar.
        </p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {languages.map((lang) => (
          <div
            key={lang.name}
            onClick={() => setSelectedLanguage(lang.name)}
            className={`
              flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
              ${
                selectedLanguage === lang.name
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm">
                <img
                  src={`https://flagcdn.com/32x24/${lang.flag.toLowerCase()}.png`}
                  alt={lang.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-medium text-gray-900">{lang.name}</span>
            </div>

            {selectedLanguage === lang.name && (
              <CheckOutlined className="text-purple-600 text-lg" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettings;
