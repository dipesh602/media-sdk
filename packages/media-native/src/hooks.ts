import {
  useCallback,
  useEffect,
  useState
} from "react";

import type {
  MediaItem
} from "@media-sdk/core";

import {
  useMedia
} from "./context.js";

export interface UseMediaSearchResult {
  items: MediaItem[];
  loading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMediaSearch(
  query: string
): UseMediaSearchResult {
  const media = useMedia();

  const [items, setItems] =
    useState<MediaItem[]>([]);

  const [page, setPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  const [hasNextPage, setHasNextPage] =
    useState(false);

  const fetchPage = useCallback(
    async (
      pageNumber: number,
      replace = false
    ) => {
      if (!query.trim()) {
        setItems([]);
        setHasNextPage(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result =
          await media.photos.search(
            query,
            pageNumber,
            20
          );

        setItems((previous: MediaItem[]) =>
          replace
            ? result.items
            : [...previous, ...result.items]
        );

        setPage(pageNumber);

        setHasNextPage(
          result.pagination.hasNextPage
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load media")
        );
      } finally {
        setLoading(false);
      }
    },
    [media, query]
  );

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = useCallback(
    async () => {
      if (loading || !hasNextPage) {
        return;
      }

      await fetchPage(page + 1);
    },
    [
      loading,
      hasNextPage,
      page,
      fetchPage
    ]
  );

  const refresh = useCallback(
    async () => {
      await fetchPage(1, true);
    },
    [fetchPage]
  );

  return {
    items,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh
  };
}

export function useMediaEvent(
  event: "view" | "download",
  listener: (
    payload: {
      mediaId: number;
      mediaType: "photo" | "video";
    }
  ) => void
) {
  const media = useMedia();

  useEffect(() => {
    return media.events.on(
      event,
      listener
    );
  }, [media, event, listener]);
}