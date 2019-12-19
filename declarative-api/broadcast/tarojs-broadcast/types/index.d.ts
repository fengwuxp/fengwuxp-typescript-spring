import { AppCommandBroadcaster, EventBroadcastAdapter, BroadcastSubscription } from 'fengwuxp-declarative-broadcast-adapter';

/**
 *
 * @param pathPrefix
 */
declare const tarojsAppCommandBroadcasterFactory: <T extends AppCommandBroadcaster>(pathPrefix?: string) => T;

/**
 *
 */
declare class TarojsEventBroadcastAdapter implements EventBroadcastAdapter {
    private listenerHandles;
    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription;
    once(eventType: string, listener: (...args: any[]) => any, context: any): BroadcastSubscription;
    emit(eventType: string, ...params: any[]): void;
    listeners(eventType: string): BroadcastSubscription[];
    removeAllListeners(eventType?: string): void;
    removeListener(eventType: string, listener: (...args: any[]) => any): void;
}

export { TarojsEventBroadcastAdapter, tarojsAppCommandBroadcasterFactory };
