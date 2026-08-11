import {
  useCallback,
  useRef
} from "react";

export interface GridItem {
  id: number | string;
}

export interface UseGridOptions {
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export interface GridItemProps {
  "data-media-id": string | number;
}

export function useMediaGrid(
  options: UseGridOptions
) {
  const {
    hasNextPage,
    loading,
    onLoadMore
  } = options;

  const observer = useRef<IntersectionObserver | null>(
    null
  );

  const getItemProps = useCallback(
    (item: GridItem): GridItemProps => {
      return {
        "data-media-id": item.id
      };
    },
    []
  );

  const getLoadMoreRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (!node || loading || !hasNextPage) {
        return;
      }

      observer.current =
        new IntersectionObserver(
          (entries) => {
            if (
              entries[0]?.isIntersecting &&
              !loading &&
              hasNextPage
            ) {
              onLoadMore();
            }
          },
          {
            rootMargin: "300px"
          }
        );

      observer.current.observe(node);
    },
    [
      hasNextPage,
      loading,
      onLoadMore
    ]
  );

  return {
    getItemProps,
    getLoadMoreRef
  };
}