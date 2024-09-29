import { useQuery } from "@tanstack/react-query";
import { getConfig } from "services/mopidy";

export const useConfig = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["config"],
    queryFn: getConfig,
    staleTime: Infinity,
  });

  return {
    config: data,
    configLoading: isLoading,
    error,
  };
};
