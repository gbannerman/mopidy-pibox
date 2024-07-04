import { Spotify, Soundcloud } from "mdi-material-ui";
import CloudDownload from "@mui/icons-material/CloudDownload";

export const getIconFromURI = (uri) => {
  if (uri.startsWith("spotify")) {
    return Spotify;
  } else if (uri.startsWith("soundcloud")) {
    return Soundcloud;
  } else if (uri.startsWith("local")) {
    return CloudDownload;
  }
};
