import {EventBroadcastAdapter, BroadcastSubscription} from "fengwuxp-declarative-broadcast-adapter";
import Taro from "@tarojs/taro";

/**
 *
 */
export default class TarojsEventBroadcastAdapter implements EventBroadcastAdapter {

    private listenerHandles: Map<string, BroadcastSubscription[]> = new Map<string, BroadcastSubscription[]>();

    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription {
        Taro.eventCenter.on(eventType, listener);
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
                Taro.eventCenter.off(eventType, listener);
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
        Taro.eventCenter.once(eventType, handle);
        const subscription = {
            eventType,
            listener: handle,
            remove(): void {
                functions = functions.filter(item => item["listener"] !== handle);
                listenerHandles.set(eventType, functions);
                Taro.eventCenter.off(eventType, handle);
            }
        };
        functions.push(subscription);
        listenerHandles.set(eventType, functions);
        return subscription;
    }

    emit(eventType: string, ...params: any[]): void {
        Taro.eventCenter.trigger(eventType, ...params);
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
        Taro.eventCenter.off(eventType, listener);
    }


}
