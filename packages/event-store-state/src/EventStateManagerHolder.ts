import {EventStateManager} from "./event/EventStateManager";
import RxjsEventStateManager from "./rxjs/RxjsEventStateManager";


export default class EventStateManagerHolder {

    private static EVENT_STATE_MANAGER: EventStateManager;

    /**
     * default use  {@link RxjsEventStateManager}
     */
    public static getManager = (): EventStateManager => {
        if (EventStateManagerHolder.EVENT_STATE_MANAGER == null) {
            EventStateManagerHolder.EVENT_STATE_MANAGER = new RxjsEventStateManager()
        }
        return EventStateManagerHolder.EVENT_STATE_MANAGER;
    };

    /**
     * This method can only be called once and must be called before the getManager method, otherwise an exception will be thrown
     * @param manager
     */
    public static setManager = (manager: EventStateManager) => {
        if (EventStateManagerHolder.EVENT_STATE_MANAGER == null) {
            EventStateManagerHolder.EVENT_STATE_MANAGER = manager;
        } else {
            throw new Error("event state manager is inited");
        }
    }
}
