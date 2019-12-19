import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

interface BroadcastEmitterListener {
    /**
     * Adds a listener to be invoked when events of the specified type are
     * emitted. An optional calling context may be provided. The data arguments
     * emitted will be passed to the listener function.
     *
     * @param eventType - Name of the event to listen to
     * @param listener - Function to invoke when the specified event is
     *   emitted
     * @param context - Optional context object to use when invoking the
     *   listener
     */
    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription;
    /**
     * Similar to addListener, except that the listener is removed after it is
     * invoked once.
     *
     * @param eventType - Name of the event to listen to
     * @param listener - Function to invoke only once when the
     *   specified event is emitted
     * @param context - Optional context object to use when invoking the
     *   listener
     */
    once(eventType: string, listener: (...args: any[]) => any, context: any): BroadcastSubscription;
}
/**
 * EventSubscription represents a subscription to a particular event. It can
 * remove its own subscription.
 */
interface BroadcastSubscription {
    readonly eventType: string;
    /**
     * Removes this subscription from the subscriber that controls it.
     */
    remove(): void;
}

/**
 *  event broadcast adapter
 */
interface EventBroadcastAdapter extends BroadcastEmitterListener {
    /**
     * Removes all of the registered listeners, including those registered as
     * listener maps.
     *
     * @param eventType - Optional name of the event whose registered
     *   listeners to remove
     */
    removeAllListeners(eventType?: string): void;
    /**
     * Returns an array of listeners that are currently registered for the given
     * event.
     *
     * @param eventType - Name of the event to query
     */
    listeners(eventType: string): BroadcastSubscription[];
    /**
     * Emits an event of the given type with the given data. All handlers of that
     * particular type will be notified.
     *
     * @param eventType - Name of the event to emit
     * @param params Arbitrary arguments to be passed to each registered listener
     *
     * @example
     *   emitter.addListener('someEvent', function(message) {
     *     console.log(message);
     *   });
     *
     *   emitter.emit('someEvent', 'abc'); // logs 'abc'
     */
    emit(eventType: string, ...params: any[]): void;
    /**
     * Removes the given listener for event of specific type.
     *
     * @param eventType - Name of the event to emit
     * @param listener - Function to invoke when the specified event is
     *   emitted
     *
     * @example
     *   emitter.removeListener('someEvent', function(message) {
     *     console.log(message);
     *   }); // removes the listener if already registered
     *
     */
    removeListener(eventType: string, listener: (...args: any[]) => any): void;
}

declare type EmitEventMethod<T = any> = (...params: T[]) => void;
declare type ReceiveEventListenerMethod<P = any, C = any> = (listener: (...args: P[]) => any, P?: any) => BroadcastSubscription;
declare type RemoveEventListenerMethod<P = any> = (listener: (...args: P[]) => any) => void;
interface AppCommandBroadcaster extends EventBroadcastAdapter {
}

interface BroadcastCommandConfiguration {
    broadcastAdapter: () => EventBroadcastAdapter;
    methodNameCommandResolver?: () => MethodNameCommandResolver;
}

/**
 *
 * @param configuration
 * @param pathPrefix
 */
declare const appCommandBroadcasterFactory: <T extends AppCommandBroadcaster>(configuration: BroadcastCommandConfiguration, pathPrefix?: string) => T;

declare class DefaultEventBroadcastAdapterWrapper implements EventBroadcastAdapter {
    private eventBroadcastAdapter;
    private pathPrefix?;
    constructor(eventBroadcastAdapter: EventBroadcastAdapter, pathPrefix?: string);
    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription;
    once(eventType: string, listener: (...args: any[]) => any, context: any): BroadcastSubscription;
    emit(eventType: string, ...params: any[]): void;
    listeners(eventType: string): BroadcastSubscription[];
    removeAllListeners(eventType?: string): void;
    removeListener(eventType: string, listener: (...args: any[]) => any): void;
    private getEventType;
}

declare enum EventBroadcastCommand {
    EMIT = "emit",
    SEND = "send",
    REMOVE = "remove",
    RECEIVE = "receive"
}

export { AppCommandBroadcaster, BroadcastCommandConfiguration, BroadcastEmitterListener, BroadcastSubscription, DefaultEventBroadcastAdapterWrapper, EmitEventMethod, EventBroadcastAdapter, EventBroadcastCommand, ReceiveEventListenerMethod, RemoveEventListenerMethod, appCommandBroadcasterFactory };
