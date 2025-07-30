import { useState } from "react";
import UserCreate from "./UserCreate";
import UserRowDisplay from "./UserRowDisplay";
import type { User } from "../../types/user";

export default function UsersView() {
  const [userToEdit, setUserToEdit] = useState<User | undefined>(undefined);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshUsers = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="">
      <div className="px-6">
        <UserCreate
          userToEdit={userToEdit}
          onClose={() => setUserToEdit(undefined)}
          refreshUsers={refreshUsers}
        />

        <UserRowDisplay
          refreshKey={refreshKey}
          refreshUsers={refreshUsers}
          setUserToEdit={setUserToEdit}
        />
      </div>
    </div>
  );
}
