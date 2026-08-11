export class EventEmitter {
    listeners = new Map();
    constructor() {
        this.on("view", (payload) => {
            console.log("[media-core] view", payload);
        });
        this.on("download", (payload) => {
            console.log("[media-core] download", payload);
        });
    }
    on(event, listener) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(listener);
        return () => {
            this.listeners.get(event)?.delete(listener);
        };
    }
    emit(event, payload) {
        this.listeners.get(event)?.forEach((listener) => {
            listener(payload);
        });
    }
}
