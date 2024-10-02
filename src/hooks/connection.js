import { useEffect, useState } from "react";
import { onConnectionChanged } from "services/mopidy";

export function useConnected() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const cleanup = onConnectionChanged(setConnected);
    return () => cleanup();
  }, []);

  return connected;
}
