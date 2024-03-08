import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import SettingsIcon from "@material-ui/icons/Settings";
import { IconButton } from "@material-ui/core";
import { useAdmin } from "hooks/admin";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    listStyleType: "none",
    margin: 0,
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  title: {
    textAlign: "start",
    display: "inline-block",
    fontWeight: 700,
    fontSize: "20px",
  },
  search: {
    flex: "0 1 auto",
  },
  link: {
    textDecoration: "none",
    color: "black",
    display: "block",
    "&:hover": {
      backgroundColor: "#FAFAFF",
    },
  },
}));

const NavigationBar = () => {
  const classes = useStyles();

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
    <ul className={classes.root}>
      <li className="nav-item-title">
        {!isAdmin ? (
          <h2
            className={classes.title}
            onClick={() => setAdminCounter(adminCounter + 1)}
          >
            pibox
          </h2>
        ) : (
          <Link className="Link" to="/pibox/session">
            <IconButton color="secondary">
              <SettingsIcon fontSize="large" />
            </IconButton>
          </Link>
        )}
      </li>
      <li className={classes.search}>
        <Link className="Link" to="/pibox/search">
          <IconButton color="secondary">
            <SearchIcon fontSize="large" />
          </IconButton>
        </Link>
      </li>
    </ul>
  );
};

export default NavigationBar;
