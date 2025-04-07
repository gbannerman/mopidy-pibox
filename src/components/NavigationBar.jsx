import React from "react";
import { Link } from "wouter";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import { useAdmin } from "hooks/admin";

const NavigationBar = () => {
  const { isAdmin, triggerSecretAdminAction } = useAdmin();

  return (
    <ul className="flex justify-between items-center list-none m-0 px-2">
      <li>
        {!isAdmin ? (
          <h2
            className="text-start inline-block font-bold text-xl pl-2"
            onClick={triggerSecretAdminAction}
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
      <li className="shrink">
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
