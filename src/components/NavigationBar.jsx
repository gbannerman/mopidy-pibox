import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import { useAdmin } from "hooks/admin";
import { useSnackbar } from "notistack";

const NavigationBar = () => {
  const { isAdmin, setIsAdmin } = useAdmin();

  const [adminCounter, setAdminCounter] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isAdmin || adminCounter < 7) {
      return;
    }

    setIsAdmin(true);
    enqueueSnackbar(`You are now an admin!`, { variant: "success" });
  }, [adminCounter, isAdmin, setIsAdmin, enqueueSnackbar]);

  return (
    <ul className="flex justify-between items-center list-none m-0 px-2">
      <li>
        {!isAdmin ? (
          <h2
            className="text-start inline-block font-bold text-xl pl-2"
            onClick={() => setAdminCounter(adminCounter + 1)}
          >
            pibox
          </h2>
        ) : (
          <Link className="Link" to="/session">
            <IconButton color="secondary">
              <SettingsIcon fontSize="large" />
            </IconButton>
          </Link>
        )}
      </li>
      <li className="flex-shrink">
        <Link className="Link" to="/search">
          <IconButton color="secondary">
            <SearchIcon fontSize="large" />
          </IconButton>
        </Link>
      </li>
    </ul>
  );
};

export default NavigationBar;
