export interface EventMap {
  view: {
    mediaId: number;
    mediaType: "photo" | "video";
  };

  download: {
    mediaId: number;
    mediaType: "photo" | "video";
  };
}

type Listener<T> = (payload: T) => void;

export class EventEmitter {
  private listeners = new Map<
    keyof EventMap,
    Set<Listener<any>>
  >();

  constructor() {
    this.on("view", (payload) => {
      console.log("[media-core] view", payload);
    });

    this.on("download", (payload) => {
      console.log("[media-core] download", payload);
    });
  }

  on<K extends keyof EventMap>(
    event: K,
    listener: Listener<EventMap[K]>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(listener);

    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  emit<K extends keyof EventMap>(
    event: K,
    payload: EventMap[K]
  ): void {
    this.listeners.get(event)?.forEach((listener) => {
      listener(payload);
    });
  }
}