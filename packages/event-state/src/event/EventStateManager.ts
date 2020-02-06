import {EventState, InitStateInvoker} from "./EventState";


/**
 * event state manager
 */
export interface EventStateManager {


    /**
     * 获取状态列表
     */
    getEventNames: () => string[];

    /**
     * 获取一个状态
     * @param eventName
     */
    getEventState: <T = any>(eventName: string, initState?:InitStateInvoker<T>) => EventState<T> | Promise<EventState<T>>;

    /**
     * 移除一个状态
     * @param eventName
     */
    removeEventState: (eventName: string) => void;

}
