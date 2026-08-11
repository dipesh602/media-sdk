import {
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
  const getLightboxProps =
    useCallback(
      () => ({
        accessibilityViewIsModal: true,
        accessible: true
      }),
      []
    );

  const getCloseButtonProps =
    useCallback(
      () => ({
        accessibilityRole: "button" as const,
        accessibilityLabel: "Close"
      }),
      []
    );

  return {
    open,
    getLightboxProps,
    getCloseButtonProps,
    onClose
  };
}