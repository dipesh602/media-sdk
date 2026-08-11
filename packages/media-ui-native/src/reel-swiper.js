import { useCallback } from "react";
export function useReelSwiper(onActiveChange) {
    const getReelItemProps = useCallback((item) => ({
        nativeID: `reel-${item.id}`
    }), []);
    const handleActiveChange = useCallback((id) => {
        onActiveChange?.(id);
    }, [onActiveChange]);
    return {
        getReelItemProps,
        handleActiveChange
    };
}
