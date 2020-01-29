import {AbstractEventStateManager} from "../event/AbstractEventStateManager";
import RxjsEventState from "./RxjsEventState";


export default class RxjsEventStateManager extends AbstractEventStateManager {


    constructor() {
        super();
    }

    protected newEventState = (event: string) => {

        return new RxjsEventState(event);
    };


}
