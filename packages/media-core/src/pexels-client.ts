import { MediaSdkError } from "./errors.js";

import {
  MediaItem,
  PaginatedResult
} from "./types.js";

function mapPhoto(photo: PexelsPhoto): MediaItem {
  return {
    id: photo.id,
    type: "photo",

    width: photo.width,
    height: photo.height,

    url: photo.url,

    title: photo.alt,

    thumbnailUrl: photo.src.medium,
    previewUrl: photo.src.large,

    photographer: photo.photographer,
    photographerUrl: photo.photographer_url
  };
}

function mapVideo(video: PexelsVideo): MediaItem {
  const previewFile =
    video.video_files.find(
      (file) => file.quality === "hd"
    ) ?? video.video_files[0];

  return {
    id: video.id,
    type: "video",

    width: video.width,
    height: video.height,

    url: video.url,

    thumbnailUrl: video.image,
    previewUrl: previewFile?.link,

    photographer: video.user?.name,
    photographerUrl: video.user?.url,

    duration: video.duration
  };
}

function mapPagination(
  response: {
    page: number;
    per_page: number;
    total_results: number;
    next_page?: string;
  }
) {
  return {
    page: response.page,
    perPage: response.per_page,
    totalResults: response.total_results,
    hasNextPage: Boolean(response.next_page)
  };
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  alt?: string;
  photographer?: string;
  photographer_url?: string;

  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    tiny: string;
  };
}

interface PexelsPhotoResponse {
  photos: PexelsPhoto[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
}

interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width?: number;
  height?: number;
  link: string;
}

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;

  user?: {
    name: string;
    url: string;
  };

  video_files: PexelsVideoFile[];
}

interface PexelsVideoResponse {
  videos: PexelsVideo[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
}

const PEXELS_BASE_URL = "https://api.pexels.com/v1";
const PEXELS_VIDEO_BASE_URL = "https://api.pexels.com/videos";

export class PexelsClient {
  constructor(private readonly apiKey: string) {}

  private async request<T>(
    url: string,
    params?: Record<string, string | number>
  ): Promise<T> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, String(value));
      });
    }

    const finalUrl = searchParams.toString()
      ? `${url}?${searchParams.toString()}`
      : url;

    const response = await fetch(finalUrl, {
      headers: {
        Authorization: this.apiKey
      }
    });

    if (!response.ok) {
      throw new MediaSdkError(
        `Pexels API request failed: ${response.statusText}`,
        response.status
      );
    }

    return response.json() as Promise<T>;
  }

  async searchPhotos(
  query: string,
  page = 1,
  perPage = 20
): Promise<PaginatedResult<MediaItem>> {
  const response =
    await this.request<PexelsPhotoResponse>(
      `${PEXELS_BASE_URL}/search`,
      {
        query,
        page,
        per_page: perPage
      }
    );

  return {
    items: response.photos.map(mapPhoto),
    pagination: mapPagination(response)
  };
}

  async curatedPhotos(
  page = 1,
  perPage = 20
): Promise<PaginatedResult<MediaItem>> {
  const response =
    await this.request<PexelsPhotoResponse>(
      `${PEXELS_BASE_URL}/curated`,
      {
        page,
        per_page: perPage
      }
    );

  return {
    items: response.photos.map(mapPhoto),
    pagination: mapPagination(response)
  };
}
  async getPhoto(
  id: number
): Promise<MediaItem> {
  const response =
    await this.request<PexelsPhoto>(
      `${PEXELS_BASE_URL}/photos/${id}`
    );

  return mapPhoto(response);
}

  async popularVideos(
  page = 1,
  perPage = 20
): Promise<PaginatedResult<MediaItem>> {
  const response =
    await this.request<PexelsVideoResponse>(
      `${PEXELS_VIDEO_BASE_URL}/popular`,
      {
        page,
        per_page: perPage
      }
    );

  return {
    items: response.videos.map(mapVideo),
    pagination: mapPagination(response)
  };
}

  async searchVideos(
  query: string,
  page = 1,
  perPage = 20
): Promise<PaginatedResult<MediaItem>> {
  const response =
    await this.request<PexelsVideoResponse>(
      `${PEXELS_VIDEO_BASE_URL}/search`,
      {
        query,
        page,
        per_page: perPage
      }
    );

  return {
    items: response.videos.map(mapVideo),
    pagination: mapPagination(response)
  };
}
}