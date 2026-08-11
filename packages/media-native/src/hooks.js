import { useCallback, useEffect, useState } from "react";
import { useMedia } from "./context.js";
export function useMediaSearch(query) {
    const media = useMedia();
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const fetchPage = useCallback(async (pageNumber, replace = false) => {
        if (!query.trim()) {
            setItems([]);
            setHasNextPage(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const result = await media.photos.search(query, pageNumber, 20);
            setItems((previous) => replace
                ? result.items
                : [...previous, ...result.items]);
            setPage(pageNumber);
            setHasNextPage(result.pagination.hasNextPage);
        }
        catch (err) {
            setError(err instanceof Error
                ? err
                : new Error("Failed to load media"));
        }
        finally {
            setLoading(false);
        }
    }, [media, query]);
    useEffect(() => {
        fetchPage(1, true);
    }, [fetchPage]);
    const loadMore = useCallback(async () => {
        if (loading || !hasNextPage) {
            return;
        }
        await fetchPage(page + 1);
    }, [
        loading,
        hasNextPage,
        page,
        fetchPage
    ]);
    const refresh = useCallback(async () => {
        await fetchPage(1, true);
    }, [fetchPage]);
    return {
        items,
        loading,
        error,
        hasNextPage,
        loadMore,
        refresh
    };
}
export function useMediaEvent(event, listener) {
    const media = useMedia();
    useEffect(() => {
        return media.events.on(event, listener);
    }, [media, event, listener]);
}
