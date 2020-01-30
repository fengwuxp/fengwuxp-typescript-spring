import EventStateManagerHolder from "../EventStateManagerHolder";
import {newProxyInstance, newProxyInstanceEnhance, ProxyScope} from "fengwuxp-common-proxy";
import {MethodNameCommandResolver, noneResolver} from "fengwuxp-declarative-command";
import {CmdProviderMethodOptions} from "./CmdProviderMethod";
import {Reflection as Reflect} from '@abraham/reflection';

/**
 * 指令数据提供者配置
 */
export interface CmdDataProviderOptions {

    /**
     * cmd data provider bound event name
     *
     * default: {@code setEventNameGenerator} {@see EventNameGenerator}
     */
    eventName?: string;
}

export type EventNameGenerator = () => string;

export interface CmdDataProviderType {
    (options?: CmdDataProviderOptions): any;

    setEventNameGenerator: (generator: EventNameGenerator) => void;

    setMethodNameCommandResolver: (commandResolver: MethodNameCommandResolver) => void;

    readonly eventNameGenerator?: EventNameGenerator;

    readonly commandResolver?: MethodNameCommandResolver;
}

/**
 * 指令数据提供者
 * @constructor
 */
const CmdDataProvider: CmdDataProviderType = (options: CmdDataProviderOptions = {}) => {

    const eventNameGenerator: EventNameGenerator = CmdDataProvider.eventNameGenerator;

    if (eventNameGenerator && options.eventName == null) {
        options.eventName = eventNameGenerator();
    }


    return (clazz: { new(...args: any[]): {} }): any => {

        return class extends clazz {

            constructor() {
                super();
                const eventStateManager = EventStateManagerHolder.getManager();
                const eventState = eventStateManager.getEventState(options.eventName);
                const proxyInstance = newProxyInstanceEnhance(this, (object: any, propertyKey: string, receiver: any) => {
                    const state = eventState.getState();
                    const cmdProviderOptions: Readonly<CmdProviderMethodOptions> = Reflect.getMetadata(CMD_DATA_PROVIDER_KEY, object, propertyKey);
                    return async function (...args) {
                        const oldFunction = object[propertyKey];
                        if (cmdProviderOptions != null) {
                            if (cmdProviderOptions.ignore) {
                                // 忽略该方法的处理
                                oldFunction.bind(proxyInstance, ...args)();
                                return;
                            }
                        }
                        const commandResolver = CmdDataProvider.commandResolver;
                        const propName: string = cmdProviderOptions == null ? commandResolver(propertyKey) : cmdProviderOptions.propName || commandResolver(propertyKey);
                        const newState = await oldFunction.bind(proxyInstance, ...args, state[propName])();
                        await eventState.setState(newState, propName);
                        return newState;
                    }
                }, null);
                return proxyInstance;
            }
        }
    }
};

CmdDataProvider.setEventNameGenerator = function (generator: EventNameGenerator) {
    // @ts-ignore
    CmdDataProvider['eventNameGenerator'] = generator;
};

CmdDataProvider.setMethodNameCommandResolver = function (commandResolver: MethodNameCommandResolver) {
    // @ts-ignore
    CmdDataProvider['commandResolver'] = commandResolver;
};

CmdDataProvider.setMethodNameCommandResolver(noneResolver);

export const CMD_DATA_PROVIDER_KEY = "_cmd_data_provider_";

export default CmdDataProvider;
