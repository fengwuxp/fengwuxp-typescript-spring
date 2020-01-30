import { MethodNameCommandResolver } from 'fengwuxp-declarative-command';

/**
 * 指令数据提供者配置
 */
interface CmdDataProviderOptions {
    /**
     * cmd data provider bound event name
     *
     * default: {@code setEventNameGenerator} {@see EventNameGenerator}
     */
    eventName?: string;
}
declare type EventNameGenerator = () => string;
interface CmdDataProviderType {
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
declare const CmdDataProvider: CmdDataProviderType;

interface CmdProviderMethodOptions {
    /**
     * 状态属性的名称
     * 默认：方法名称
     */
    propName?: string;
    /**
     * 是否忽略该方法 默认：false
     */
    ignore?: boolean;
}
/**
 * 指令数据提供者 用于增强方法描述的注解
 * @param options
 * @constructor
 */
declare const CmdProviderMethod: (options: CmdProviderMethodOptions) => (target: any, methodName: any) => void;

/**
 * 应用事件类型
 */
declare enum ApplicationEventType {
    /**
     * 路由
     */
    ROUTE = "ROUTE",
    /**
     * 全局
     */
    GLOBAL = "GLOBAL"
}

interface Unsubscribable {
    /**
     * 取消订阅
     */
    unsubscribe(): void;
}
/**
 * 某个订阅的持有者
 */
interface Subscription extends Unsubscribable {
    /**
     * 是否已被关闭
     */
    isClosed: () => boolean;
}

/**
 *  event state
 *  Associate certain states with an event and update it anywhere
 */
interface EventState<T = any> {
    /**
     * 获取事件
     */
    getEventName: () => string;
    /**
     * 获取状态
     */
    getState: () => T;
    /**
     * 设置某个事件的状态
     * @param newState
     * @param propKey
     */
    setState: (newState: any, propKey?: string) => Promise<void>;
    /**
     * 订阅事件
     * @param event
     * @param handle
     */
    subject: (handle: (data: T) => void) => Subscription;
    /**
     * 关闭（移除）这个状态
     */
    close: () => void;
}

declare abstract class AbstractEventState<T = any> implements EventState<T> {
    protected eventName: string;
    private removeStateHandle;
    protected state: T;
    protected stateIsComplex: boolean;
    constructor(eventName: string, initSate: T, removeStateHandle?: Function);
    close: () => void;
    getEventName: () => string;
    getState: () => T;
    setState: (newState: any, propKey?: string) => Promise<void>;
    /**
     * 广播这个状态的更新
     */
    protected abstract broadcastStateUpdate: () => Promise<void>;
    abstract subject: (handle: (data: T) => void) => Subscription;
}

/**
 * event state manager
 */
interface EventStateManager {
    /**
     * 获取状态列表
     */
    getEventNames: () => string[];
    /**
     * 获取一个状态
     * @param eventName
     */
    getEventState: <T = any>(eventName: string) => EventState<T>;
    /**
     * 移除一个状态
     * @param eventName
     */
    removeEventState: (eventName: string) => void;
}

declare abstract class AbstractEventStateManager implements EventStateManager {
    protected eventStateMap: Map<string, EventState | EventState[]>;
    protected abstract newEventState: (event: string) => EventState;
    getEventState: <T = any>(eventName: string) => EventState<any>;
    getEventNames: () => string[];
    removeEventState: (eventName: string) => void;
}

declare class RxjsEventState<T> extends AbstractEventState<T> {
    private rxjsSubject;
    constructor(eventName: string, initSate?: T, removeStateHandle?: Function);
    protected broadcastStateUpdate: () => Promise<void>;
    subject: (handle: (data: T) => void) => Subscription;
}

declare class RxjsEventStateManager extends AbstractEventStateManager {
    constructor();
    protected newEventState: (event: string) => RxjsEventState<unknown>;
}

declare class EventStateManagerHolder {
    private static EVENT_STATE_MANAGER;
    /**
     * default use  {@link RxjsEventStateManager}
     */
    static getManager: () => EventStateManager;
    /**
     * This method can only be called once and must be called before the getManager method, otherwise an exception will be thrown
     * @param manager
     */
    static setManager: (manager: EventStateManager) => void;
}

export { AbstractEventState, AbstractEventStateManager, ApplicationEventType, CmdDataProvider, CmdDataProviderOptions, CmdDataProviderType, CmdProviderMethod, CmdProviderMethodOptions, EventState, EventStateManager, EventStateManagerHolder, RxjsEventState, RxjsEventStateManager, Subscription };
