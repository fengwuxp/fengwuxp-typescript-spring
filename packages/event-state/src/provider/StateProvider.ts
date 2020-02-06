import {InitStateInvoker} from "../event/EventState";

/**
 * state provider
 */
export interface StateProvider<T = any> {

    /**
     * init sate
     */
    readonly defaultState?: InitStateInvoker<T>;
}
