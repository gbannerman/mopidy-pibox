import React, { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";

const defaultAdminContext = {
  isAdmin: false,
  triggerSecretAdminAction: () => {},
};

export const AdminContext = React.createContext(defaultAdminContext);

export const useAdmin = () => React.useContext(AdminContext);

export const useAdminContext = () => {
  const [admin, setAdmin] = useState(false);
  const [adminSecretActionCounter, setAdminSecretActionCounter] = useState(0);

  useEffect(() => {
    if (!admin && adminSecretActionCounter >= 7) {
      setAdmin(true);
      toast.success("You are now an admin");
    }
  }, [admin, adminSecretActionCounter]);

  const triggerSecretAdminAction = useCallback(() => {
    setAdminSecretActionCounter((prev) => prev + 1);
  }, [admin]);

  return {
    isAdmin: admin,
    triggerSecretAdminAction,
  };
};
