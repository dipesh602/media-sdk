import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const MediaContext = createContext(null);
export function MediaProvider({ client, children }) {
    return (_jsx(MediaContext.Provider, { value: client, children: children }));
}
export function useMedia() {
    const client = useContext(MediaContext);
    if (!client) {
        throw new Error("useMedia must be used inside MediaProvider");
    }
    return client;
}
