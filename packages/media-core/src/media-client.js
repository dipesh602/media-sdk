import { PexelsClient } from "./pexels-client.js";
import { MemoryCache } from "./cache.js";
import { EventEmitter } from "./emitter.js";
export class MediaClient {
    pexels;
    cache = new MemoryCache();
    events;
    constructor(config) {
        if (!config.apiKey) {
            throw new Error("Pexels API key is required");
        }
        this.pexels = new PexelsClient(config.apiKey);
        this.events = new EventEmitter();
    }
    photos = {
        search: async (query, page = 1, perPage = 20) => {
            const cacheKey = `photos:search:${query}:${page}:${perPage}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            const result = await this.pexels.searchPhotos(query, page, perPage);
            this.cache.set(cacheKey, result);
            return result;
        },
        curated: async (page = 1, perPage = 20) => {
            const cacheKey = `photos:curated:${page}:${perPage}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            const result = await this.pexels.curatedPhotos(page, perPage);
            this.cache.set(cacheKey, result);
            return result;
        },
        getById: async (id) => {
            const cacheKey = `photo:${id}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            const result = await this.pexels.getPhoto(id);
            this.cache.set(cacheKey, result);
            return result;
        }
    };
    videos = {
        popular: async (page = 1, perPage = 20) => {
            const cacheKey = `videos:popular:${page}:${perPage}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            const result = await this.pexels.popularVideos(page, perPage);
            this.cache.set(cacheKey, result);
            return result;
        },
        search: async (query, page = 1, perPage = 20) => {
            const cacheKey = `videos:search:${query}:${page}:${perPage}`;
            const cached = this.cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            const result = await this.pexels.searchVideos(query, page, perPage);
            this.cache.set(cacheKey, result);
            return result;
        }
    };
    trackView(mediaId, mediaType) {
        this.events.emit("view", {
            mediaId,
            mediaType
        });
    }
    trackDownload(mediaId, mediaType) {
        this.events.emit("download", {
            mediaId,
            mediaType
        });
    }
}
export function createMediaClient(config) {
    return new MediaClient(config);
}
