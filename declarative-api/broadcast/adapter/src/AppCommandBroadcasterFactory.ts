import {BroadcastCommandConfiguration} from "./BroadcastCommandConfiguration";
import {AppCommandBroadcaster} from "./AppCommandBroadcaster";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import DefaultEventBroadcastAdapterWrapper from "./DefaultEventBroadcastAdapterWrapper";
import {
    tryConverterMethodNameCommandResolver,
    toUpperCaseResolver,
    reduceRightCommandResolvers,
    toLineResolver
} from "fengwuxp-declarative-command";
import {EventBroadcastCommand} from "./EventBroadcastCommand";


const EVENT_BROADCAST_COMMAND_VALUES = Object.keys(EventBroadcastCommand).map((key) => {
    return EventBroadcastCommand[key]
});
const initialLowercase = (str: string) => {
    return str.replace(str[0], str[0].toLocaleLowerCase());
};
/**
 *
 * @param configuration
 * @param pathPrefix
 */
export const appCommandBroadcasterFactory = <T extends AppCommandBroadcaster>(configuration: BroadcastCommandConfiguration,
                                                                              pathPrefix?: string): T => {

    const methodNameCommandResolver = typeof configuration.methodNameCommandResolver === "function" ?
        configuration.methodNameCommandResolver() : reduceRightCommandResolvers(toUpperCaseResolver, toLineResolver, initialLowercase);
    const broadcaster = new DefaultEventBroadcastAdapterWrapper(configuration.broadcastAdapter(), pathPrefix);

    return newProxyInstanceEnhance<T>(broadcaster as any, null,
        (object, propertyKey: string, receiver) => {

            return function (...args: any[]): any {

                //尝试从方法名称中解析到 指令 事件类型
                let [command, eventType] = tryConverterMethodNameCommandResolver(propertyKey, EVENT_BROADCAST_COMMAND_VALUES, EventBroadcastCommand.EMIT);
                eventType = methodNameCommandResolver(eventType);

                switch (command) {
                    case EventBroadcastCommand.EMIT:
                    case EventBroadcastCommand.SEND:
                        return broadcaster.emit(eventType, ...args);
                    case EventBroadcastCommand.RECEIVE:
                        return broadcaster.addListener(eventType, args[0], args[1]);
                    case EventBroadcastCommand.REMOVE:
                        return broadcaster.removeListener(eventType, args[0]);
                    default:
                        throw new Error(`not support command: ${command}`);
                }

            }
        });
};
