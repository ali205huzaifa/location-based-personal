import UserCreate from "./UserCreate";
import UserRowDisplay from "./UserRowDisplay";

export default function UsersView() {
  return (
    <div className="">
      <div className="px-6">
        <UserCreate />

        <div className="bg-black text-white px-4 py-5 flex items-center justify-between rounded-t-lg">
          <span className="font-Regular text-[20.38px]">
            Showing all Users{" "}
            <span className="text-[11.91px]">- 4 Results</span>
          </span>
        </div>

        <UserRowDisplay />
      </div>
    </div>
  );
}
