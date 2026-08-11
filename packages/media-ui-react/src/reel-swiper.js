import { useCallback, useEffect, useRef } from "react";
export function useReelSwiper(onActiveChange) {
    const observerRef = useRef(null);
    const nodesRef = useRef([]);
    const activeNodeRef = useRef(null);
    const handleIntersection = useCallback((entries) => {
        let bestEntry;
        for (const entry of entries) {
            if (!entry.isIntersecting) {
                continue;
            }
            if (!bestEntry ||
                entry.intersectionRatio >
                    bestEntry.intersectionRatio) {
                bestEntry = entry;
            }
        }
        if (!bestEntry) {
            return;
        }
        const activeNode = bestEntry.target;
        if (activeNodeRef.current === activeNode) {
            return;
        }
        activeNodeRef.current =
            activeNode;
        /*
         * Pause every video
         */
        nodesRef.current.forEach((node) => {
            const video = node.querySelector("video");
            if (!video) {
                return;
            }
            if (node !== activeNode) {
                video.pause();
            }
        });
        /*
         * Play active video
         */
        const activeVideo = activeNode.querySelector("video");
        if (activeVideo) {
            activeVideo.muted = true;
            activeVideo
                .play()
                .catch((error) => {
                if (error?.name !== "AbortError") {
                    console.error("Autoplay failed:", error);
                }
            });
        }
        const id = activeNode.dataset.reelId;
        if (id && onActiveChange) {
            onActiveChange(id);
        }
    }, [onActiveChange]);
    /*
     * Create observer
     */
    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: [0.5, 0.7, 0.9],
        });
        observerRef.current = observer;
        /*
         * Observe already registered nodes
         */
        nodesRef.current.forEach((node) => {
            observer.observe(node);
        });
        return () => {
            observer.disconnect();
            observerRef.current = null;
        };
    }, [handleIntersection]);
    /*
     * Return props for each reel
     */
    const getReelItemProps = useCallback((item) => ({
        "data-reel-id": String(item.id)
    }), []);
    /*
     * Register each reel DOM node
     */
    const getReelItemRef = useCallback((node) => {
        if (!node) {
            return;
        }
        if (!nodesRef.current.includes(node)) {
            nodesRef.current.push(node);
        }
        observerRef.current?.observe(node);
    }, []);
    return {
        getReelItemProps,
        getReelItemRef
    };
}
