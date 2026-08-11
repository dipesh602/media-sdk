import { useCallback } from "react";
export function useLightbox(open, onClose) {
    const getLightboxProps = useCallback(() => ({
        accessibilityViewIsModal: true,
        accessible: true
    }), []);
    const getCloseButtonProps = useCallback(() => ({
        accessibilityRole: "button",
        accessibilityLabel: "Close"
    }), []);
    return {
        open,
        getLightboxProps,
        getCloseButtonProps,
        onClose
    };
}
