import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getTracklist, onTracklistChanged, onVoteAdded } from "services/mopidy";

let subscriptionInitialised = false;

export const useTracklist = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tracklist"],
    queryFn: getTracklist,
    staleTime: 30000,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (subscriptionInitialised) {
      return;
    }

    const cleanupTracklistChanged = onTracklistChanged(async () => {
      queryClient.invalidateQueries({ queryKey: ["tracklist"] });
    });

    const cleanupVoteAdded = onVoteAdded(async () => {
      queryClient.invalidateQueries({ queryKey: ["tracklist"] });
    });

    return () => {
      cleanupTracklistChanged();
      cleanupVoteAdded();
    };
  }, []);

  return {
    tracklist: data,
    tracklistLoading: isLoading,
    error,
    refetchTracklist: refetch,
  };
};
