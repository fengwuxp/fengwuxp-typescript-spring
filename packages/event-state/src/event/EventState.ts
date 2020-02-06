import {Subscription} from "./Subscription";

/**
 *  event state
 *  Associate certain states with an event and update it anywhere
 */
export interface EventState<T = any> {


    /**
     * 获取事件
     */
    getEventName: () => string;

    /**
     * 初始化状态
     */
    initState: () => void | Promise<void>;

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

type InitStateSynFC<T> = () => T;
type InitStateAsyncFC<T> = () => Promise<T>;

type InitSateType<T> = {
    selectEvent: () => string[];
    init: (...otherSates: any[]) => T | Promise<T>
}

export type InitStateInvoker<T = any> = InitStateSynFC<T> | InitStateAsyncFC<T> | InitSateType<T>;
