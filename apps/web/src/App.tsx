import {
  useMemo,
  useState
} from "react";

import {
  MediaProvider,
  useMedia,
  useMediaSearch,
  useVideoSearch,
  useMediaEvent
} from "@media-sdk/react";

import {
  useMediaGrid,
  useLightbox,
  useReelSwiper
} from "@media-sdk/ui-react";

import {
  createMediaClient
} from "@media-sdk/core";



const apiKey =
  import.meta.env.VITE_PEXELS_API_KEY;

const client = createMediaClient({
  apiKey
});


function VideoReels({
  videos,
  loading,
  hasNextPage,
  onLoadMore
}: {
  videos: import("@media-sdk/core").MediaItem[];
  loading: boolean;
  hasNextPage: boolean;
  onLoadMore: () => Promise<void>;
}) {
  const media = useMedia();

  const {
    getReelItemProps,
    getReelItemRef
  } = useReelSwiper((id) => {
    console.log("Active video:", id);

    media.trackView(
      Number(id),
      "video"
    );
  });

  if (loading && videos.length === 0) {
    return (
      <div className="reels-loading">
        Loading videos...
      </div>
    );
  }

  return (
    <div className="reels">

      {videos.map((video) => (
        <article
          key={video.id}
          {...getReelItemProps(video)}
          ref={getReelItemRef}
          className="reel-item"
        >

          <video
            src={video.previewUrl}
            poster={video.thumbnailUrl}
            controls
            playsInline
            loop
            muted
            preload="metadata"
          />

          <div className="reel-info">

            <strong>
              {video.photographer ??
                "Unknown photographer"}
            </strong>

            <span>
              {video.duration
                ? `${video.duration}s`
                : "Video"}
            </span>

            <button
              type="button"
              onClick={() => {
                media.trackDownload(
                  video.id,
                  "video"
                );

                window.open(
                  video.url,
                  "_blank"
                );
              }}
            >
              Download
            </button>

          </div>

        </article>
      ))}

      {loading && (
        <div className="reels-loading">
          Loading more videos...
        </div>
      )}

      {!loading && hasNextPage && (
  <div className="video-load-more">
    <button
      type="button"
      onClick={onLoadMore}
      className="load-more-button"
    >
      Load more videos
    </button>
  </div>
)}

{!loading && !hasNextPage && videos.length > 0 && (
  <p className="no-more-videos">
    No more videos
  </p>
)}

    </div>
  );
}


function MediaApp() {

  const media = useMedia();

  useMediaEvent(
    "view",
    (event) => {
      console.log(
        "[app] Viewed media:",
        event
      );
    }
  );

  useMediaEvent(
    "download",
    (event) => {
      console.log(
        "[app] Downloaded media:",
        event
      );
    }
  );

  const [query, setQuery] =
    useState("nature");

  const [input, setInput] =
    useState("nature");

  const [showVideos, setShowVideos] =
    useState(false);

  const [selectedId, setSelectedId] =
    useState<number | null>(null);


  // PHOTOS

  const {
    items,
    loading,
    error,
    hasNextPage,
    loadMore
  } = useMediaSearch(query);


  // VIDEOS

  const {
    items: videoItems,
    loading: videoLoading,
    error: videoError,
    hasNextPage: videoHasNextPage,
    loadMore: loadMoreVideos
  } = useVideoSearch(query);


  // SELECTED PHOTO

  const selectedItem =
    useMemo(
      () =>
        items.find(
          (item) =>
            item.id === selectedId
        ),
      [items, selectedId]
    );


  // PHOTO GRID

  const {
    getItemProps,
    getLoadMoreRef
  } = useMediaGrid({
    hasNextPage,
    loading,
    onLoadMore: loadMore
  });


  // LIGHTBOX

  const {
    getLightboxProps,
    getCloseButtonProps
  } = useLightbox(
    Boolean(selectedItem),
    () => setSelectedId(null)
  );


  function handleSearch(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const value =
      input.trim();

    if (value) {
      setQuery(value);
    }
  }


  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="brand">

          <h1>
            Media SDK
          </h1>

          <p>
            Headless Media SDK Demo
          </p>

        </div>


        <form
          className="search"
          onSubmit={handleSearch}
        >

          <input
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value
              )
            }
            placeholder="Search photos..."
            aria-label="Search media"
          />

          <button type="submit">
            Search
          </button>

        </form>


        {/* PHOTO / VIDEO TABS */}

        <div className="media-tabs">

          <button
            type="button"
            onClick={() =>
              setShowVideos(false)
            }
            className={
              !showVideos
                ? "active"
                : ""
            }
          >
            Photos
          </button>


          <button
            type="button"
            onClick={() =>
              setShowVideos(true)
            }
            className={
              showVideos
                ? "active"
                : ""
            }
          >
            Videos
          </button>

        </div>

      </header>


      {/* PHOTO ERROR */}

      {!showVideos && error && (
        <div className="error">

          <strong>
            Something went wrong:
          </strong>

          <span>
            {error.message}
          </span>

        </div>
      )}


      {/* VIDEO ERROR */}

      {showVideos && videoError && (
        <div className="error">

          <strong>
            Something went wrong:
          </strong>

          <span>
            {videoError.message}
          </span>

        </div>
      )}


      {/* PHOTOS */}

      {!showVideos && (

        <>

          <main className="grid">

            {items.map((item) => (

              <article
                key={item.id}
                {...getItemProps(item)}
                className="card"

                onClick={() => {

                  setSelectedId(
                    item.id
                  );

                  media.trackView(
                    item.id,
                    item.type
                  );

                }}

                tabIndex={0}
                role="button"

                aria-label={`Open ${
                  item.photographer ??
                  "media"
                } photo`}

                onKeyDown={(event) => {

                  if (
                    event.key ===
                      "Enter" ||
                    event.key === " "
                  ) {

                    event.preventDefault();

                    setSelectedId(
                      item.id
                    );

                    media.trackView(
                      item.id,
                      item.type
                    );

                  }

                }}
              >

                <img
                  src={
                    item.thumbnailUrl ??
                    item.url
                  }
                  alt={
                    item.title ??
                    `Photo by ${
                      item.photographer ??
                      "unknown"
                    }`
                  }
                  loading="lazy"
                />


                <div className="card-overlay">

                  <span>
                    {item.photographer ??
                      "Unknown photographer"}
                  </span>

                </div>

              </article>

            ))}

          </main>


          {/* PHOTO LOAD MORE */}

          <div
            ref={getLoadMoreRef}
            className="load-more"
          >

            {loading && (
              <div className="loader">
                Loading...
              </div>
            )}


            {!loading &&
              hasNextPage && (

                <button
                  className="load-more-button"
                  onClick={loadMore}
                >
                  Load more
                </button>

              )}


            {!loading &&
              !hasNextPage &&
              items.length > 0 && (

                <p>
                  No more results
                </p>

              )}

          </div>

        </>

      )}


      {/* VIDEOS */}

      {showVideos && (

        <VideoReels
          videos={videoItems}
          loading={videoLoading}
          hasNextPage={
            videoHasNextPage
          }
          onLoadMore={
            loadMoreVideos
          }
        />

      )}


      {/* PHOTO LIGHTBOX */}

      {selectedItem && (

        <div
          {...getLightboxProps()}
          className="lightbox"

          onClick={() =>
            setSelectedId(null)
          }
        >

          <button
            {...getCloseButtonProps()}
            className="close-button"

            onClick={(event) => {

              event.stopPropagation();

              setSelectedId(null);

            }}
          >
            ×
          </button>


          <div
            className="lightbox-content"

            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={
                selectedItem.previewUrl ??
                selectedItem.url
              }
              alt={
                selectedItem.title ??
                "Selected media"
              }
            />


            <div className="lightbox-info">

              <strong>
                {selectedItem.photographer ??
                  "Unknown photographer"}
              </strong>


              {selectedItem.photographerUrl && (

                <a
                  href={
                    selectedItem.photographerUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  Photographer
                </a>

              )}


              <button
                type="button"

                onClick={() => {

                  media.trackDownload(
                    selectedItem.id,
                    selectedItem.type
                  );

                  window.open(
                    selectedItem.url,
                    "_blank"
                  );

                }}
              >
                Download
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


export default function App() {
  if (!apiKey) {
    return (
      <div>
        <h1>Missing Pexels API key</h1>

        <p>
          Add VITE_PEXELS_API_KEY to
          apps/web/.env
        </p>
      </div>
    );
  }

  return (
    <MediaProvider client={client}>
      <MediaApp />
    </MediaProvider>
  );
}