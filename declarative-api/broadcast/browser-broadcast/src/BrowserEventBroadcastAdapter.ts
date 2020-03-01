import {EventBroadcastAdapter, BroadcastSubscription} from "fengwuxp-declarative-broadcast-adapter";
import EmitterOnFire from 'onfire.js';


/**
 * 浏览器的广播事件实现
 */
export default class BrowserEventBroadcastAdapter implements EventBroadcastAdapter {

    private listenerHandles: Map<string, BroadcastSubscription[]> = new Map<string, BroadcastSubscription[]>();

    private emitter: EmitterOnFire = new EmitterOnFire();

    constructor() {
    }

    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription {
        const emitter = this.emitter;
        emitter.on(eventType, listener);
        const listenerHandles = this.listenerHandles;
        let functions = listenerHandles.get(eventType);
        if (functions == null) {
            functions = []
        }
        const subscription = {
            eventType,
            listener,
            remove(): void {
                functions = functions.filter(item => item["listener"] !== listener);
                listenerHandles.set(eventType, functions);
                emitter.off(eventType, listener);
            }
        };
        functions.push(subscription);
        listenerHandles.set(eventType, functions);
        return subscription;
    }

    once(eventType: string, listener: (...args: any[]) => any, context: any): BroadcastSubscription {
        const listenerHandles = this.listenerHandles;
        let functions = listenerHandles.get(eventType);
        if (functions == null) {
            functions = []
        }
        const handle = (...args: any[]) => {
            // 移除
            const handles = listenerHandles.get(eventType).filter(item => item["listener"] !== handle);
            listenerHandles.set(eventType, handles);
            listener(...args);
        };
        const emitter = this.emitter;
        emitter.once(eventType, handle);
        const subscription = {
            eventType,
            listener: handle,
            remove(): void {
                functions = functions.filter(item => item["listener"] !== handle);
                listenerHandles.set(eventType, functions);
                emitter.off(eventType, handle);
            }
        };
        functions.push(subscription);
        listenerHandles.set(eventType, functions);
        return subscription;
    }

    emit(eventType: string, ...params: any[]): void {
        this.emitter.emit(eventType, ...params);
    }

    listeners(eventType: string): BroadcastSubscription[] {
        return this.listenerHandles.get(eventType);
    }

    removeAllListeners(eventType?: string): void {
        if (eventType) {
            this.listeners(eventType).forEach((item) => {
                return item.remove();
            })
        } else {
            for (const key of this.listenerHandles.keys()) {
                this.removeAllListeners(key);
            }
        }
    }

    removeListener(eventType: string, listener: (...args: any[]) => any): void {
        this.emitter.off(eventType, listener);
    }


}
