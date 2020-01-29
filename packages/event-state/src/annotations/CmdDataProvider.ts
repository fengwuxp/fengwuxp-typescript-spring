import EventStateManagerHolder from "../EventStateManagerHolder";
import {newProxyInstanceEnhance} from "fengwuxp-common-proxy";
import {MethodNameCommandResolver, noneResolver} from "fengwuxp-declarative-command";


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
                return newProxyInstanceEnhance(this, (object: any, propertyKey: string, receiver: any) => {
                    const state = eventState.getState();
                    return async function (...args) {
                        const commandResolver = CmdDataProvider.commandResolver;
                        const propName: string = commandResolver(propertyKey);
                        const oldFunction = object[propName];
                        const newState = await oldFunction(...args, state[propName]);
                        await eventState.setState(newState, propName);
                        return newState;
                    }
                }, null);
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

export default CmdDataProvider;
