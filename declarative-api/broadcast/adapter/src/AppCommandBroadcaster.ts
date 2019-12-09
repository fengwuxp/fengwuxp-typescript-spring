import {EventBroadcastAdapter} from "./EventBroadcastAdapter";
import {BroadcastSubscription} from "./BroadcastEmitterListener";


export type EmitEventMethod<T = any> = (...params: T[]) => void;

export type ReceiveEventListenerMethod<P = any, C = any> = (listener: (...args: P[]) => any, P?: any) => BroadcastSubscription;

export type RemoveEventListenerMethod<P = any> = (listener: (...args: P[]) => any) => void;

export interface AppCommandBroadcaster extends EventBroadcastAdapter {

    // sendXxx: EmitEventMethod;

    // emitXxx: EmitEventMethod;

    // receiveXxx: ReceiveEventListenerMethod

    // removeXxx: ReceiveEventListenerMethod
}
