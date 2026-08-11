import {
  useCallback,
  useEffect,
  useRef
} from "react";

export interface ReelItem {
  id: number | string;
}

export function useReelSwiper(
  onActiveChange?: (
    id: number | string
  ) => void
) {
  const observerRef =
    useRef<IntersectionObserver | null>(null);

  const nodesRef =
    useRef<HTMLElement[]>([]);

  const activeNodeRef =
    useRef<HTMLElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      let bestEntry:
        | IntersectionObserverEntry
        | undefined;

      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        if (
          !bestEntry ||
          entry.intersectionRatio >
            bestEntry.intersectionRatio
        ) {
          bestEntry = entry;
        }
      }

      if (!bestEntry) {
        return;
      }

      const activeNode =
        bestEntry.target as HTMLElement;

      if (
        activeNodeRef.current === activeNode
      ) {
        return;
      }

      activeNodeRef.current =
        activeNode;

      /*
       * Pause every video
       */
      nodesRef.current.forEach((node) => {
        const video =
          node.querySelector(
            "video"
          ) as HTMLVideoElement | null;

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
      const activeVideo =
        activeNode.querySelector(
          "video"
        ) as HTMLVideoElement | null;

      if (activeVideo) {
        activeVideo.muted = true;

        activeVideo
  .play()
  .catch((error) => {
    if (
      error?.name !== "AbortError"
    ) {
      console.error(
        "Autoplay failed:",
        error
      );
    }
  });
      }

      const id =
        activeNode.dataset.reelId;

      if (id && onActiveChange) {
        onActiveChange(id);
      }
    },
    [onActiveChange]
  );

  /*
   * Create observer
   */
  useEffect(() => {
    const observer =
      new IntersectionObserver(
        handleIntersection,
        {
          threshold: [0.5, 0.7, 0.9],
        }
      );

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
  const getReelItemProps =
    useCallback(
      (item: ReelItem) => ({
        "data-reel-id": String(item.id)
      }),
      []
    );

  /*
   * Register each reel DOM node
   */
  const getReelItemRef =
    useCallback(
      (node: HTMLElement | null) => {
        if (!node) {
          return;
        }

        if (
          !nodesRef.current.includes(node)
        ) {
          nodesRef.current.push(node);
        }

        observerRef.current?.observe(node);
      },
      []
    );

  return {
    getReelItemProps,
    getReelItemRef
  };
}