import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { MediaProvider, useMedia, useMediaSearch, useVideoSearch, useMediaEvent } from "@media-sdk/react";
import { useMediaGrid, useLightbox, useReelSwiper } from "@media-sdk/ui-react";
import { createMediaClient } from "@media-sdk/core";
const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
const client = createMediaClient({
    apiKey
});
function VideoReels({ videos, loading, hasNextPage, onLoadMore }) {
    const media = useMedia();
    const { getReelItemProps, getReelItemRef } = useReelSwiper((id) => {
        console.log("Active video:", id);
        media.trackView(Number(id), "video");
    });
    if (loading && videos.length === 0) {
        return (_jsx("div", { className: "reels-loading", children: "Loading videos..." }));
    }
    return (_jsxs("div", { className: "reels", children: [videos.map((video) => (_jsxs("article", { ...getReelItemProps(video), ref: getReelItemRef, className: "reel-item", children: [_jsx("video", { src: video.previewUrl, poster: video.thumbnailUrl, controls: true, playsInline: true, loop: true, muted: true, preload: "metadata" }), _jsxs("div", { className: "reel-info", children: [_jsx("strong", { children: video.photographer ??
                                    "Unknown photographer" }), _jsx("span", { children: video.duration
                                    ? `${video.duration}s`
                                    : "Video" }), _jsx("button", { type: "button", onClick: () => {
                                    media.trackDownload(video.id, "video");
                                    window.open(video.url, "_blank");
                                }, children: "Download" })] })] }, video.id))), loading && (_jsx("div", { className: "reels-loading", children: "Loading more videos..." })), !loading && hasNextPage && (_jsx("div", { className: "video-load-more", children: _jsx("button", { type: "button", onClick: onLoadMore, className: "load-more-button", children: "Load more videos" }) })), !loading && !hasNextPage && videos.length > 0 && (_jsx("p", { className: "no-more-videos", children: "No more videos" }))] }));
}
function MediaApp() {
    const media = useMedia();
    useMediaEvent("view", (event) => {
        console.log("[app] Viewed media:", event);
    });
    useMediaEvent("download", (event) => {
        console.log("[app] Downloaded media:", event);
    });
    const [query, setQuery] = useState("nature");
    const [input, setInput] = useState("nature");
    const [showVideos, setShowVideos] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // PHOTOS
    const { items, loading, error, hasNextPage, loadMore } = useMediaSearch(query);
    // VIDEOS
    const { items: videoItems, loading: videoLoading, error: videoError, hasNextPage: videoHasNextPage, loadMore: loadMoreVideos } = useVideoSearch(query);
    // SELECTED PHOTO
    const selectedItem = useMemo(() => items.find((item) => item.id === selectedId), [items, selectedId]);
    // PHOTO GRID
    const { getItemProps, getLoadMoreRef } = useMediaGrid({
        hasNextPage,
        loading,
        onLoadMore: loadMore
    });
    // LIGHTBOX
    const { getLightboxProps, getCloseButtonProps } = useLightbox(Boolean(selectedItem), () => setSelectedId(null));
    function handleSearch(event) {
        event.preventDefault();
        const value = input.trim();
        if (value) {
            setQuery(value);
        }
    }
    return (_jsxs("div", { className: "app", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { className: "brand", children: [_jsx("h1", { children: "Media SDK" }), _jsx("p", { children: "Headless Media SDK Demo" })] }), _jsxs("form", { className: "search", onSubmit: handleSearch, children: [_jsx("input", { value: input, onChange: (event) => setInput(event.target.value), placeholder: "Search photos...", "aria-label": "Search media" }), _jsx("button", { type: "submit", children: "Search" })] }), _jsxs("div", { className: "media-tabs", children: [_jsx("button", { type: "button", onClick: () => setShowVideos(false), className: !showVideos
                                    ? "active"
                                    : "", children: "Photos" }), _jsx("button", { type: "button", onClick: () => setShowVideos(true), className: showVideos
                                    ? "active"
                                    : "", children: "Videos" })] })] }), !showVideos && error && (_jsxs("div", { className: "error", children: [_jsx("strong", { children: "Something went wrong:" }), _jsx("span", { children: error.message })] })), showVideos && videoError && (_jsxs("div", { className: "error", children: [_jsx("strong", { children: "Something went wrong:" }), _jsx("span", { children: videoError.message })] })), !showVideos && (_jsxs(_Fragment, { children: [_jsx("main", { className: "grid", children: items.map((item) => (_jsxs("article", { ...getItemProps(item), className: "card", onClick: () => {
                                setSelectedId(item.id);
                                media.trackView(item.id, item.type);
                            }, tabIndex: 0, role: "button", "aria-label": `Open ${item.photographer ??
                                "media"} photo`, onKeyDown: (event) => {
                                if (event.key ===
                                    "Enter" ||
                                    event.key === " ") {
                                    event.preventDefault();
                                    setSelectedId(item.id);
                                    media.trackView(item.id, item.type);
                                }
                            }, children: [_jsx("img", { src: item.thumbnailUrl ??
                                        item.url, alt: item.title ??
                                        `Photo by ${item.photographer ??
                                            "unknown"}`, loading: "lazy" }), _jsx("div", { className: "card-overlay", children: _jsx("span", { children: item.photographer ??
                                            "Unknown photographer" }) })] }, item.id))) }), _jsxs("div", { ref: getLoadMoreRef, className: "load-more", children: [loading && (_jsx("div", { className: "loader", children: "Loading..." })), !loading &&
                                hasNextPage && (_jsx("button", { className: "load-more-button", onClick: loadMore, children: "Load more" })), !loading &&
                                !hasNextPage &&
                                items.length > 0 && (_jsx("p", { children: "No more results" }))] })] })), showVideos && (_jsx(VideoReels, { videos: videoItems, loading: videoLoading, hasNextPage: videoHasNextPage, onLoadMore: loadMoreVideos })), selectedItem && (_jsxs("div", { ...getLightboxProps(), className: "lightbox", onClick: () => setSelectedId(null), children: [_jsx("button", { ...getCloseButtonProps(), className: "close-button", onClick: (event) => {
                            event.stopPropagation();
                            setSelectedId(null);
                        }, children: "\u00D7" }), _jsxs("div", { className: "lightbox-content", onClick: (event) => event.stopPropagation(), children: [_jsx("img", { src: selectedItem.previewUrl ??
                                    selectedItem.url, alt: selectedItem.title ??
                                    "Selected media" }), _jsxs("div", { className: "lightbox-info", children: [_jsx("strong", { children: selectedItem.photographer ??
                                            "Unknown photographer" }), selectedItem.photographerUrl && (_jsx("a", { href: selectedItem.photographerUrl, target: "_blank", rel: "noreferrer", children: "Photographer" })), _jsx("button", { type: "button", onClick: () => {
                                            media.trackDownload(selectedItem.id, selectedItem.type);
                                            window.open(selectedItem.url, "_blank");
                                        }, children: "Download" })] })] })] }))] }));
}
export default function App() {
    if (!apiKey) {
        return (_jsxs("div", { children: [_jsx("h1", { children: "Missing Pexels API key" }), _jsx("p", { children: "Add VITE_PEXELS_API_KEY to apps/web/.env" })] }));
    }
    return (_jsx(MediaProvider, { client: client, children: _jsx(MediaApp, {}) }));
}
