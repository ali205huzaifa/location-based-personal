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

        <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
          <span className="font-Regular text-[20.38px]">
            Showing all Users{" "}
            <span className="text-[11.91px]">- 4 Results</span>
          </span>
        </div>

        <UserRowDisplay
          refreshKey={refreshKey}
          refreshUsers={refreshUsers}
          setUserToEdit={setUserToEdit}
        />
      </div>
    </div>
  );
}
