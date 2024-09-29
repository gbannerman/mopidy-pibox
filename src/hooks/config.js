import React from "react";

const defaultConfigContext = {
  defaultPlaylists: [],
  defaultSkipThreshold: null,
  offline: false,
};

export const ConfigContext = React.createContext(defaultConfigContext);

export const useConfig = () => React.useContext(ConfigContext);
