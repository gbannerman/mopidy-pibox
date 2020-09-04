import { Spotify, Soundcloud } from "mdi-material-ui";
import CloudDownload from "@material-ui/icons/CloudDownload";

export const getIconFromURI = (uri) => {
  if (uri.startsWith("spotify")) {
    return Spotify;
  } else if (uri.startsWith("soundcloud")) {
    return Soundcloud;
  } else if (uri.startsWith("local")) {
    return CloudDownload;
  }
};
