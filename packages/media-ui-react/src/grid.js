import { useCallback, useRef } from "react";
export function useMediaGrid(options) {
    const { hasNextPage, loading, onLoadMore } = options;
    const observer = useRef(null);
    const getItemProps = useCallback((item) => {
        return {
            "data-media-id": item.id
        };
    }, []);
    const getLoadMoreRef = useCallback((node) => {
        if (observer.current) {
            observer.current.disconnect();
        }
        if (!node || loading || !hasNextPage) {
            return;
        }
        observer.current =
            new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting &&
                    !loading &&
                    hasNextPage) {
                    onLoadMore();
                }
            }, {
                rootMargin: "300px"
            });
        observer.current.observe(node);
    }, [
        hasNextPage,
        loading,
        onLoadMore
    ]);
    return {
        getItemProps,
        getLoadMoreRef
    };
}
