import {
  useCallback
} from "react";

export interface ReelItem {
  id: number | string;
}

export function useReelSwiper(
  onActiveChange?: (
    id: number | string
  ) => void
) {
  const getReelItemProps =
    useCallback(
      (item: ReelItem) => ({
        nativeID: `reel-${item.id}`
      }),
      []
    );

  const handleActiveChange =
    useCallback(
      (id: number | string) => {
        onActiveChange?.(id);
      },
      [onActiveChange]
    );

  return {
    getReelItemProps,
    handleActiveChange
  };
}