import {BroadcastEmitterListener, BroadcastSubscription} from "./BroadcastEmitterListener";


/**
 *  event broadcast adapter
 */
export interface EventBroadcastAdapter extends BroadcastEmitterListener{


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
