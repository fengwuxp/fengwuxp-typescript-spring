import {AbstractEventStateManager} from "../event/AbstractEventStateManager";
import RxjsEventState from "./RxjsEventState";
import {InitStateInvoker} from "../event/EventState";


export default class RxjsEventStateManager extends AbstractEventStateManager {


    constructor() {
        super();
    }

    protected newEventState = async (event: string, initInvoker:InitStateInvoker) => {

        const rxjsEventState = new RxjsEventState(event, initInvoker);
        await rxjsEventState.initState();
        return rxjsEventState;
    };


}
