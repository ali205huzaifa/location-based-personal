import { useState } from "react";
import CreateLocation from "./createLocation";
import LocationRowDisplay from "./locationsRowDisplay";

const LocationView = () => {
  const [activeTab, setActiveTab] = useState<"countries" | "cities">(
    "countries"
  );
  const [locations, setLocations] = useState({
    countries: [
      { id: 1, name: "Pakistan", code: "0092" },
      { id: 2, name: "Turkey", code: "0090" },
    ],
    cities: [
      { id: 1, name: "Karachi", country: "Pakistan" },
      { id: 2, name: "Istanbul", country: "Turkey" },
    ],
  });

  const [editingItem, setEditingItem] = useState<any>(null);

  const handleSave = (type: "countries" | "cities", item: any) => {
    if (editingItem) {
      setLocations((prev) => ({
        ...prev,
        [type]: prev[type].map((loc) => (loc.id === item.id ? item : loc)),
      }));
    } else {
      setLocations((prev) => ({
        ...prev,
        [type]: [...prev[type], { ...item, id: Date.now() }],
      }));
    }
    setEditingItem(null);
  };

  const handleDelete = (type: "countries" | "cities", id: number) => {
    setLocations((prev) => ({
      ...prev,
      [type]: prev[type].filter((loc) => loc.id !== id),
    }));
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "countries"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("countries")}
        >
          Countries
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "cities" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("cities")}
        >
          Cities
        </button>
      </div>

      <CreateLocation
        type={activeTab}
        onSave={(item) => handleSave(activeTab, item)}
        editingItem={editingItem}
        onCancel={() => setEditingItem(null)}
      />

      <div className="mt-6">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              {activeTab === "countries" ? (
                <>
                  <th className="p-2">Country</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Actions</th>
                </>
              ) : (
                <>
                  <th className="p-2">City</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {locations[activeTab].map((loc) => (
              <LocationRowDisplay
                key={loc.id}
                type={activeTab}
                item={loc}
                onEdit={() => setEditingItem(loc)}
                onDelete={() => handleDelete(activeTab, loc.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationView;
