import { useEffect, useCallback } from "react";
export function useLightbox(open, onClose) {
    useEffect(() => {
        if (!open) {
            return;
        }
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);
    const getLightboxProps = useCallback(() => ({
        role: "dialog",
        "aria-modal": true,
        tabIndex: -1
    }), []);
    const getCloseButtonProps = useCallback(() => ({
        type: "button",
        "aria-label": "Close"
    }), []);
    return {
        getLightboxProps,
        getCloseButtonProps
    };
}
