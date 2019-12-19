import {EventBroadcastAdapter} from "./EventBroadcastAdapter";
import {BroadcastSubscription} from "./BroadcastEmitterListener";


export default class DefaultEventBroadcastAdapterWrapper implements EventBroadcastAdapter {

    private eventBroadcastAdapter: EventBroadcastAdapter;

    private pathPrefix?: string;


    constructor(eventBroadcastAdapter: EventBroadcastAdapter, pathPrefix?: string) {
        this.eventBroadcastAdapter = eventBroadcastAdapter;
        this.pathPrefix = pathPrefix || "";
    }

    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription {
        return this.eventBroadcastAdapter.addListener(this.getEventType(eventType), listener, context);
    }

    once(eventType: string, listener: (...args: any[]) => any, context: any): BroadcastSubscription {
        return this.eventBroadcastAdapter.once(this.getEventType(eventType), listener, context);
    }

    emit(eventType: string, ...params: any[]): void {
        return this.eventBroadcastAdapter.emit(this.getEventType(eventType), ...params);
    }

    listeners(eventType: string): BroadcastSubscription[] {
        return this.eventBroadcastAdapter.listeners(this.getEventType(eventType));
    }

    removeAllListeners(eventType?: string): void {
        return this.eventBroadcastAdapter.removeAllListeners(this.getEventType(eventType));
    }

    removeListener(eventType: string, listener: (...args: any[]) => any): void {
        return this.eventBroadcastAdapter.removeListener(this.getEventType(eventType), listener);
    }

    private getEventType = (eventType?: string) => {
        if (eventType == null) {
            return eventType;
        }
        return `${this.pathPrefix}${eventType}`;
    }


}
