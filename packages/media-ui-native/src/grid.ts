import {
  useCallback
} from "react";

export interface GridItem {
  id: number | string;
}

export interface UseGridOptions {
  hasNextPage: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export function useMediaGrid(
  options: UseGridOptions
) {
  const {
    hasNextPage,
    loading,
    onLoadMore
  } = options;

  const getItemProps = useCallback(
    (item: GridItem) => ({
      nativeID: `media-${item.id}`
    }),
    []
  );

  const loadMore = useCallback(
    () => {
      if (
        !loading &&
        hasNextPage
      ) {
        onLoadMore();
      }
    },
    [
      loading,
      hasNextPage,
      onLoadMore
    ]
  );

  return {
    getItemProps,
    loadMore
  };
}