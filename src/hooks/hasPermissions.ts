import { useSelector } from "react-redux";

export const useHasPermission = (permission: string) => {
  const permissions = useSelector((state: any) => state.auth.permissions);
  return permissions.includes(permission);
};
