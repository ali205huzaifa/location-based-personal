import { useState, useEffect } from "react";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import PostAPI from "../../api/postApi/PostAPI";

interface SearchModalProps {
  onClose: () => void;
  searchValue: string;
  onLocationSelect: (place: google.maps.places.PlaceResult) => void;
}

const SearchModal = ({
  onClose,
  searchValue,
  onLocationSelect,
}: SearchModalProps) => {
  const [activeTab, setActiveTab] = useState<"users" | "location">("users");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "users") handleUserSearch(searchValue);
  }, [searchValue, activeTab]);

  const handleUserSearch = async (value: string) => {
    if (!value.trim()) {
      setUsers([]);
      return;
    }

    setLoadingUsers(true);
    try {
      const res = await PostAPI.searchUsers({ q: value });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleLocationSearch = (value: string) => {
    if (!value.trim()) {
      setLocationResults([]);
      return;
    }

    setLocationLoading(true);

    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: value }, (predictions) => {
      setLocationResults(predictions || []);
      setLocationLoading(false);
    });
  };

  useEffect(() => {
    if (activeTab === "location") handleLocationSearch(searchValue);
  }, [searchValue, activeTab]);

  return (
    <div className="2xl:w-full xl:w-[710px] lg:w-[390px] md:w-[440px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-100">
        <button
          className={`flex-1 py-3 text-center text-sm ${
            activeTab === "users"
              ? "border-b-[3px] border-[#8869F3] text-[#000000] text-base font-normal"
              : "text-[#666666]"
          }`}
          onClick={() => setActiveTab("users")}
        >
          User
        </button>

        <button
          className={`flex-1 py-3 text-center text-sm ${
            activeTab === "location"
              ? "border-b-[3px] border-[#8869F3] text-[#000000] text-base font-normal"
              : "text-[#666666]"
          }`}
          onClick={() => setActiveTab("location")}
        >
          Location
        </button>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === "users" && (
          <>
            {loadingUsers && (
              <div className="flex justify-center py-6">
                <Spin />
              </div>
            )}

            {!loadingUsers && users.length === 0 && searchValue && (
              <p className="py-6 text-center text-gray-500 text-base font-light">
                No users found
              </p>
            )}

            {!searchValue && (
              <p className="py-6 text-center text-gray-500 text-base font-light">
                Search Users
              </p>
            )}

            {users.map((u: any) => (
              <div
                key={u._id}
                className="flex items-center gap-4 p-1 cursor-pointer hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  onClose();
                  navigate(`/othersProfile/${u._id}`);
                }}
              >
                <img
                  src={u.image || "/images/default-chat-profile.svg"}
                  className="w-11 h-11 rounded-full object-cover"
                />

                <div>
                  <p className="text-black text-base font-normal">
                    {u.fullName}
                  </p>

                  <p className="text-stone-500 text-sm font-normal">
                    @{u.username}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === "location" && (
          <>
            {locationLoading && (
              <div className="flex justify-center py-6">
                <Spin />
              </div>
            )}

            {!locationLoading && locationResults.length === 0 && (
              <p className=" py-6 text-gray-500 text-base font-light text-center">
                Search Locations
              </p>
            )}

            <div className="space-y-3 mt-2">
              {locationResults.map((place) => (
                <div
                  key={place.place_id}
                  className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded-lg"
                  onClick={() => {
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ placeId: place.place_id }, (results) => {
                      if (results && results.length > 0) {
                        onLocationSelect(results[0]);
                      }
                    });
                  }}
                >
                  <img
                    src="/icons/location-icon.svg"
                    className="w-5 h-5 opacity-70"
                    alt="location"
                  />

                  <p className="text-black text-sm font-normal">
                    {place.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
