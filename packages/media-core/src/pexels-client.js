import { MediaSdkError } from "./errors.js";
function mapPhoto(photo) {
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
function mapVideo(video) {
    const previewFile = video.video_files.find((file) => file.quality === "hd") ?? video.video_files[0];
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
function mapPagination(response) {
    return {
        page: response.page,
        perPage: response.per_page,
        totalResults: response.total_results,
        hasNextPage: Boolean(response.next_page)
    };
}
const PEXELS_BASE_URL = "https://api.pexels.com/v1";
const PEXELS_VIDEO_BASE_URL = "https://api.pexels.com/videos";
export class PexelsClient {
    apiKey;
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    async request(url, params) {
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
            throw new MediaSdkError(`Pexels API request failed: ${response.statusText}`, response.status);
        }
        return response.json();
    }
    async searchPhotos(query, page = 1, perPage = 20) {
        const response = await this.request(`${PEXELS_BASE_URL}/search`, {
            query,
            page,
            per_page: perPage
        });
        return {
            items: response.photos.map(mapPhoto),
            pagination: mapPagination(response)
        };
    }
    async curatedPhotos(page = 1, perPage = 20) {
        const response = await this.request(`${PEXELS_BASE_URL}/curated`, {
            page,
            per_page: perPage
        });
        return {
            items: response.photos.map(mapPhoto),
            pagination: mapPagination(response)
        };
    }
    async getPhoto(id) {
        const response = await this.request(`${PEXELS_BASE_URL}/photos/${id}`);
        return mapPhoto(response);
    }
    async popularVideos(page = 1, perPage = 20) {
        const response = await this.request(`${PEXELS_VIDEO_BASE_URL}/popular`, {
            page,
            per_page: perPage
        });
        return {
            items: response.videos.map(mapVideo),
            pagination: mapPagination(response)
        };
    }
    async searchVideos(query, page = 1, perPage = 20) {
        const response = await this.request(`${PEXELS_VIDEO_BASE_URL}/search`, {
            query,
            page,
            per_page: perPage
        });
        return {
            items: response.videos.map(mapVideo),
            pagination: mapPagination(response)
        };
    }
}
