import { useSnackbar } from "notistack";
import React, { useState, useCallback, useEffect } from "react";

const defaultAdminContext = {
  isAdmin: false,
  triggerSecretAdminAction: () => {},
};

export const AdminContext = React.createContext(defaultAdminContext);

export const useAdmin = () => React.useContext(AdminContext);

export const useAdminContext = () => {
  const [admin, setAdmin] = useState(false);
  const [adminSecretActionCounter, setAdminSecretActionCounter] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!admin && adminSecretActionCounter >= 7) {
      setAdmin(true);
      enqueueSnackbar("You are now an admin", { variant: "success" });
    }
  }, [admin, adminSecretActionCounter, enqueueSnackbar]);

  const triggerSecretAdminAction = useCallback(() => {
    setAdminSecretActionCounter((prev) => prev + 1);
  }, [admin]);

  return {
    isAdmin: admin,
    triggerSecretAdminAction,
  };
};
