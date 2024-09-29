import { useQuery } from "@tanstack/react-query";
import { getPlaylists } from "services/mopidy";

export const usePlaylists = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["playlists"],
    queryFn: getPlaylists,
    staleTime: 60_000,
  });

  return {
    playlists: data,
    playlistsLoading: isLoading,
    error,
  };
};
