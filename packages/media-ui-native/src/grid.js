import { useCallback } from "react";
export function useMediaGrid(options) {
    const { hasNextPage, loading, onLoadMore } = options;
    const getItemProps = useCallback((item) => ({
        nativeID: `media-${item.id}`
    }), []);
    const loadMore = useCallback(() => {
        if (!loading &&
            hasNextPage) {
            onLoadMore();
        }
    }, [
        loading,
        hasNextPage,
        onLoadMore
    ]);
    return {
        getItemProps,
        loadMore
    };
}
