import { useState } from "react";
import UserCreate from "./UserCreate";
import UserRowDisplay from "./UserRowDisplay";
import type { User } from "../../types/user";

export default function UsersView() {
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshUsers = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="">
      <div className="px-6">
        <UserCreate
          userToEdit={userToEdit}
          setUserToEdit={setUserToEdit}
          refreshUsers={refreshUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <UserRowDisplay
          refreshKey={refreshKey}
          refreshUsers={refreshUsers}
          setUserToEdit={setUserToEdit}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
