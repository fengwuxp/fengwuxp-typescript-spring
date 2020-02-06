import {EventState, InitStateInvoker} from "./EventState";
import {Subscription} from "./Subscription";
import {StateProvider} from "../provider/StateProvider";
import EventStateManagerHolder from "../EventStateManagerHolder";

export abstract class AbstractEventState<T = any> implements EventState<T>, StateProvider<T> {

    public defaultState: InitStateInvoker<T>;

    protected eventName: string;

    protected state: T;

    protected stateIsComplex: boolean;

    private removeStateHandle: Function;

    protected isInitStatus = false;


    constructor(eventName: string, initInvoker: InitStateInvoker<T>, removeStateHandle?: Function) {
        this.eventName = eventName;
        this.removeStateHandle = removeStateHandle;
        this.defaultState = initInvoker;

    }

    close = () => {
        if (typeof this.removeStateHandle === "function") {
            this.removeStateHandle()
        }
    };

    getEventName = () => this.eventName;

    initState = async () => {
        if (this.isInitStatus) {
            return Promise.reject();
        }
        this.isInitStatus = true;

        const invoker = this.defaultState;
        if (invoker == null) {
            this.state = {} as any;
            this.stateIsComplex = true;
            return;
        }
        let state;
        if (typeof invoker === "function") {
            state = await invoker();
        } else {
            const {
                selectEvent,
                init
            } = invoker;
            state = await Promise.all(
                selectEvent().map(name => {
                    return EventStateManagerHolder.getManager().getEventState(name)
                })
            ).then((values) => {
                return init(...values);
            });
        }
        this.stateIsComplex = typeof state === "object";
        this.state = state;
    };

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

    abstract subject: (handle: (data: T) => void) => Subscription;


}
