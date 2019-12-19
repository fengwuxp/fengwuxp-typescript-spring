export interface BroadcastEmitterListener {
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
export interface BroadcastSubscription {

    readonly eventType: string;

    // readonly key: number;


    /**
     * Removes this subscription from the subscriber that controls it.
     */
    remove(): void;
}
