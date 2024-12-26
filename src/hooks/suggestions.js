import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSuggestions, onTrackPlaybackEnded } from "services/mopidy";

let subscriptionInitialised = false;

export const useSuggestions = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: getSuggestions,
    staleTime: 0,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (subscriptionInitialised) {
      return;
    }

    const cleanup = onTrackPlaybackEnded(async () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    });

    return cleanup;
  }, []);

  return {
    suggestions: data?.suggestions,
    suggestionsLoading: isLoading,
    error,
  };
};
