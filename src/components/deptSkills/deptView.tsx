import { NavLink, Outlet } from "react-router-dom";

export default function DeptView() {
  const tab =
    "flex-1 text-center inline-flex items-center justify-center gap-2 border-b-2 px-8 py-4 text-lg font-medium";
  return (
    <div className="p-4">
      <div className="mb-6 flex border border-[#E6E6E6] rounded-t-lg">
        <NavLink
          to="departments"
          className={({ isActive }) =>
            `${tab} ${
              isActive ? "border-black" : "border-transparent text-gray-500"
            }`
          }
        >
          Departments
        </NavLink>
        <NavLink
          to="skills"
          className={({ isActive }) =>
            `${tab} ${
              isActive ? "border-black" : "border-transparent text-gray-500"
            }`
          }
        >
          Skills
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
