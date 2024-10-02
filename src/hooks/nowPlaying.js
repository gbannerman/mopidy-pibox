import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getArtwork,
  getCurrentTrack,
  getPlaybackState,
  onPlaybackChanged,
} from "services/mopidy";

let subscriptionInitialised = false;

export const useNowPlaying = () => {
  const { data: currentTrack, isLoading: currentTrackLoading } = useQuery({
    queryKey: ["currentTrack"],
    queryFn: getCurrentTrack,
    staleTime: 30000,
  });

  const { data: playbackState, isLoading: playbackStateLoading } = useQuery({
    queryKey: ["playbackState"],
    queryFn: getPlaybackState,
    staleTime: 30000,
  });

  const { data: artworkUrl, isLoading: artworkUrlLoading } = useQuery({
    queryKey: [currentTrack, "artworkUrl"],
    queryFn: async () => {
      if (!currentTrack) {
        return null;
      }
      return getArtwork(currentTrack.uri);
    },
    enabled: !!currentTrack,
    staleTime: 30000,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (subscriptionInitialised) {
      return;
    }

    const cleanup = onPlaybackChanged(async () => {
      queryClient.invalidateQueries({ queryKey: ["currentTrack"] });
      queryClient.invalidateQueries({ queryKey: ["playbackState"] });
    });

    return cleanup;
  }, []);

  return {
    currentTrack,
    currentTrackLoading,
    playbackState,
    playbackStateLoading,
    artworkUrl,
    artworkUrlLoading,
  };
};
