import {EventState} from "./EventState";
import {Subscription} from "./Subscription";

export abstract class AbstractEventState<T = any> implements EventState<T> {

    protected eventName: string;

    private removeStateHandle: Function;

    protected state: T;

    protected stateIsComplex: boolean;


    constructor(eventName: string, initSate: T, removeStateHandle?: Function) {
        this.eventName = eventName;
        this.removeStateHandle = removeStateHandle;
        this.state = initSate === undefined ? {} as T : initSate;
        const stateType = typeof this.state;
        this.stateIsComplex = stateType === "object" || stateType === "function";
    }


    close = () => {
        if (typeof this.removeStateHandle === "function") {
            this.removeStateHandle()
        }
    };

    getEventName = () => this.eventName;

    getState = () => this.state;

    setState = (newState: any, propKey?: string) => {
        if (this.stateIsComplex && propKey != null) {
            this.state[propKey] = newState;
        } else {
            this.state = newState;
        }
        return this.broadcastStateUpdate();
    };

    /**
     * 广播这个状态的更新
     */
    protected abstract broadcastStateUpdate: () => Promise<void>;

    abstract subject: ( handle: (data: T) => void) => Subscription;


}
