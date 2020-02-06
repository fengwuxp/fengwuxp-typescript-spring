import {AbstractEventState} from "../event/AbstractEventState";
import {Subscription} from "../event/Subscription";
import {Subject} from "rxjs";
import {InitStateInvoker} from "../event/EventState";


export default class RxjsEventState<T> extends AbstractEventState<T> {

    private rxjsSubject: Subject<any>;

    constructor(eventName: string, initInvoker?: InitStateInvoker<T>, removeStateHandle?: Function) {
        super(eventName, initInvoker, removeStateHandle);
        this.rxjsSubject = new Subject<any>();
    }

    protected broadcastStateUpdate = async () => {
        this.rxjsSubject.next(this.state);
    };

    subject = (handle: (data: T) => void): Subscription => {
        const rxjsSubject = this.rxjsSubject;
        const subscription = rxjsSubject.subscribe(handle);
        return {
            unsubscribe(): void {
                subscription.unsubscribe()
            },
            isClosed() {
                return subscription.closed;
            }
        };
    };

}
