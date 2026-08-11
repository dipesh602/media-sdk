import { PexelsClient } from "./pexels-client.js";
import { MemoryCache } from "./cache.js";
import { EventEmitter } from "./emitter.js";
import {
  MediaItem,
  PaginatedResult
} from "./types.js";

export interface MediaClientConfig {
  apiKey: string;
}

export class MediaClient {
  private readonly pexels: PexelsClient;
  private readonly cache = new MemoryCache<unknown>();

  public readonly events: EventEmitter;

  constructor(config: MediaClientConfig) {
    if (!config.apiKey) {
      throw new Error("Pexels API key is required");
    }

    this.pexels = new PexelsClient(config.apiKey);
    this.events = new EventEmitter();
  }

  public readonly photos = {
    search: async (
      query: string,
      page = 1,
      perPage = 20
    ): Promise<PaginatedResult<MediaItem>> => {
      const cacheKey =
        `photos:search:${query}:${page}:${perPage}`;

      const cached =
        this.cache.get<PaginatedResult<MediaItem>>(
          cacheKey
        );

      if (cached) {
        return cached;
      }

      const result =
        await this.pexels.searchPhotos(
          query,
          page,
          perPage
        );

      this.cache.set(cacheKey, result);

      return result;
    },

    curated: async (
      page = 1,
      perPage = 20
    ): Promise<PaginatedResult<MediaItem>> => {
      const cacheKey =
        `photos:curated:${page}:${perPage}`;

      const cached =
        this.cache.get<PaginatedResult<MediaItem>>(
          cacheKey
        );

      if (cached) {
        return cached;
      }

      const result =
        await this.pexels.curatedPhotos(
          page,
          perPage
        );

      this.cache.set(cacheKey, result);

      return result;
    },

    getById: async (
      id: number
    ): Promise<MediaItem> => {
      const cacheKey = `photo:${id}`;

      const cached =
        this.cache.get<MediaItem>(cacheKey);

      if (cached) {
        return cached;
      }

      const result =
        await this.pexels.getPhoto(id);

      this.cache.set(cacheKey, result);

      return result;
    }
  };

  public readonly videos = {
    popular: async (
      page = 1,
      perPage = 20
    ): Promise<PaginatedResult<MediaItem>> => {
      const cacheKey =
        `videos:popular:${page}:${perPage}`;

      const cached =
        this.cache.get<PaginatedResult<MediaItem>>(
          cacheKey
        );

      if (cached) {
        return cached;
      }

      const result =
        await this.pexels.popularVideos(
          page,
          perPage
        );

      this.cache.set(cacheKey, result);

      return result;
    },

    search: async (
      query: string,
      page = 1,
      perPage = 20
    ): Promise<PaginatedResult<MediaItem>> => {
      const cacheKey =
        `videos:search:${query}:${page}:${perPage}`;

      const cached =
        this.cache.get<PaginatedResult<MediaItem>>(
          cacheKey
        );

      if (cached) {
        return cached;
      }

      const result =
        await this.pexels.searchVideos(
          query,
          page,
          perPage
        );

      this.cache.set(cacheKey, result);

      return result;
    }
  };

  public trackView(
    mediaId: number,
    mediaType: "photo" | "video"
  ): void {
    this.events.emit("view", {
      mediaId,
      mediaType
    });
  }

  public trackDownload(
    mediaId: number,
    mediaType: "photo" | "video"
  ): void {
    this.events.emit("download", {
      mediaId,
      mediaType
    });
  }
}

export function createMediaClient(
  config: MediaClientConfig
): MediaClient {
  return new MediaClient(config);
}