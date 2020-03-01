import { EventBroadcastAdapter, BroadcastSubscription, AppCommandBroadcaster } from 'fengwuxp-declarative-broadcast-adapter';

/**
 * 浏览器的广播事件实现
 */
declare class BrowserEventBroadcastAdapter implements EventBroadcastAdapter {
    private listenerHandles;
    private emitter;
    constructor();
    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription;
    once(eventType: string, listener: (...args: any[]) => any, context: any): BroadcastSubscription;
    emit(eventType: string, ...params: any[]): void;
    listeners(eventType: string): BroadcastSubscription[];
    removeAllListeners(eventType?: string): void;
    removeListener(eventType: string, listener: (...args: any[]) => any): void;
}

/**
 *
 * @param pathPrefix
 */
declare const browserAppCommandBroadcasterFactory: <T extends AppCommandBroadcaster>(pathPrefix?: string) => T;

export { BrowserEventBroadcastAdapter, browserAppCommandBroadcasterFactory };
