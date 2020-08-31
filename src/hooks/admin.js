import React, { useState, useCallback } from "react";

const defaultAdminContext = {
  isAdmin: false,
  setIsAdmin: () => {},
};

export const AdminContext = React.createContext(defaultAdminContext);

export const useAdmin = () => React.useContext(AdminContext);

export const useAdminContext = () => {
  const [admin, setAdmin] = useState(false);

  const setIsAdmin = useCallback(setAdmin, []);

  return {
    isAdmin: admin,
    setIsAdmin,
  };
};
