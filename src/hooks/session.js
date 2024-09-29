import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  getCurrentSession,
  onSessionEnded,
  onSessionStarted,
  onTrackPlaybackStarted,
} from "services/mopidy";

let sessionDetailsSubscriptionInitialised = false;
let sessionSubscriptionInitialised = false;

export const useSessionDetails = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["session", "sessionDetails"],
    queryFn: getCurrentSession,
    staleTime: 30000,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (sessionDetailsSubscriptionInitialised) {
      return;
    }

    const cleanupTracklistChanged = onTrackPlaybackStarted(() => {
      queryClient.invalidateQueries({
        queryKey: ["session", "sessionDetails"],
      });
    });

    return () => {
      cleanupTracklistChanged();
    };
  }, []);

  return {
    session: data
      ? {
          started: data.started,
          playlistNames: data.playlists.map((p) => p.name),
          skipThreshold: data.skipThreshold,
          startedAt: dayjs(data.startTime),
          playedTracks: data.playedTracks,
          remainingPlaylistTracks: data.remainingPlaylistTracks,
        }
      : null,
    sessionLoading: isLoading,
    error,
    refetchSession: refetch,
  };
};

export const useSessionStarted = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["session"],
    queryFn: getCurrentSession,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (sessionSubscriptionInitialised) {
      return;
    }

    const cleanupSessionStarted = onSessionStarted(() => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    });

    const cleanupSessionEnded = onSessionEnded(() => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    });

    return () => {
      cleanupSessionStarted();
      cleanupSessionEnded();
    };
  }, []);

  return {
    sessionStarted: data ? data.started : null,
    sessionStartedLoading: isLoading,
    error,
    refetchSessionStarted: refetch,
  };
};
