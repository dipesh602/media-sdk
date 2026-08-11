import {
  useEffect,
  useCallback
} from "react";

export interface LightboxItem {
  id: number | string;
  type: "photo" | "video";
  url: string;
  previewUrl?: string;
}

export function useLightbox(
  open: boolean,
  onClose: () => void
) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  const getLightboxProps =
    useCallback(
      () => ({
        role: "dialog" as const,
        "aria-modal": true,
        tabIndex: -1
      }),
      []
    );

  const getCloseButtonProps =
    useCallback(
      () => ({
        type: "button" as const,
        "aria-label": "Close"
      }),
      []
    );

  return {
    getLightboxProps,
    getCloseButtonProps
  };
}