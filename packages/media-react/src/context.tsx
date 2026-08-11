import {
  createContext,
  useContext,
  type ReactNode
} from "react";

import type {
  MediaClient
} from "@media-sdk/core";

const MediaContext =
  createContext<MediaClient | null>(null);

export interface MediaProviderProps {
  client: MediaClient;
  children: ReactNode;
}

export function MediaProvider({
  client,
  children
}: MediaProviderProps) {
  return (
    <MediaContext.Provider value={client}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia(): MediaClient {
  const client = useContext(MediaContext);

  if (!client) {
    throw new Error(
      "useMedia must be used inside MediaProvider"
    );
  }

  return client;
}