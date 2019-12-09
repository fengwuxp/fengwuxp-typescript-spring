import * as log4js from "log4js";
import {
    AppCommandBroadcaster,
    EmitEventMethod,
    ReceiveEventListenerMethod,
    RemoveEventListenerMethod
} from "../src/AppCommandBroadcaster";
import {appCommandBroadcasterFactory} from '../src/AppCommandBroadcasterFactory';
import {EventBroadcastAdapter} from "../src/EventBroadcastAdapter";
import {BroadcastSubscription} from "../src/BroadcastEmitterListener";

const logger = log4js.getLogger();
logger.level = 'debug';

interface MockAppBroadcaster extends AppCommandBroadcaster {

    sendMemberLogin: EmitEventMethod;

    receiveMemberLogin: ReceiveEventListenerMethod;

    removeMemberLogin: RemoveEventListenerMethod;

}

class MockEventBroadcastAdapter implements EventBroadcastAdapter {

    private eventMap: Map<string, Function[]> = new Map<string, Function[]>();

    addListener(eventType: string, listener: (...args: any[]) => any, context?: any): BroadcastSubscription {
        let functions = this.eventMap.get(eventType);
        if (functions == null) {
            functions = [listener];
            this.eventMap.set(eventType, functions);
        } else {
            functions.push(listener);
        }
        // const key = functions.length;
        return {
            eventType,
            remove: () => {
                this.removeListener(eventType, listener);
            }
        };
    }

    emit(eventType: string, ...params: any[]): void {
        let functions = this.eventMap.get(eventType);
        if (functions == null) {
            return
        }
        functions.forEach((listener) => {
            if (listener != null) {
                listener(...params);
            }
        })
    }

    listeners(eventType: string): BroadcastSubscription[] {
        return [];
    }

    removeAllListeners(eventType?: string): void {
    }

    removeListener(eventType: string, listener: (...args: any[]) => any): void {
        logger.debug("移除 listener", eventType);
        let functions = this.eventMap.get(eventType);
        if (functions == null) {
            return
        }
        functions = functions.filter(fn => fn != listener);
        this.eventMap.set(eventType, functions);
    }

}

describe("test  app command broadcaster factory", () => {


    const mockAppBroadcaster: MockAppBroadcaster = appCommandBroadcasterFactory({
        broadcastAdapter: () => {
            return new MockEventBroadcastAdapter();
        }

    });

    test("app broadcast", () => {

        const listener = (memberInfo) => {
            logger.debug("接收到用户登录事件", memberInfo);
        };

        mockAppBroadcaster.sendMemberLogin({id: 1, name: "张三"});
        let holder = mockAppBroadcaster.receiveMemberLogin(listener);
        mockAppBroadcaster.sendMemberLogin({id: 2, name: "张三"});
        holder.remove();
        mockAppBroadcaster.sendMemberLogin({id: 3, name: "张三"});
        holder = mockAppBroadcaster.receiveMemberLogin(listener);
        mockAppBroadcaster.sendMemberLogin({id: 4, name: "张三"});
        mockAppBroadcaster.removeMemberLogin(listener);
        mockAppBroadcaster.sendMemberLogin({id: 5, name: "张三"});

    })

});
