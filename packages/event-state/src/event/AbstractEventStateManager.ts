import {EventStateManager} from "./EventStateManager";
import {EventState, InitStateInvoker} from "./EventState";
import {ApplicationEventType} from "../enums/ApplicationEventType";


export abstract class AbstractEventStateManager implements EventStateManager {

    protected eventStateMap: Map<string, EventState | EventState[]> = new Map<string, EventState | EventState[]>();


    protected abstract newEventState: (event: string, initInvoker:InitStateInvoker) => Promise<EventState>;

    getEventState = async <T = any>(eventName: string, initInvoker?: InitStateInvoker<T>) => {
        let eventStates = this.eventStateMap.get(eventName);
        if (eventStates == null) {
            const eventState = await this.newEventState(eventName, initInvoker);
            if (eventName.startsWith(ApplicationEventType.ROUTE)) {
                eventStates = [eventState];
            } else {
                eventStates = eventState;
            }
            this.eventStateMap.set(eventName, eventStates);
        }
        if (Array.isArray(eventStates)) {
            return eventStates[eventStates.length - 1];
        } else {
            return eventStates;
        }
    };


    getEventNames = () => {
        const eventStateMap = this.eventStateMap;
        return [...eventStateMap.keys()];
    };

    removeEventState = (eventName: string) => {
        const eventStateMap = this.eventStateMap;
        const eventStates = eventStateMap.get(eventName);
        if (eventStates == null) {
            return
        }
        if (Array.isArray(eventStates)) {
            if (eventStates.length == 1) {
                eventStateMap.delete(eventName)
            } else {
                eventStates.pop();
            }
        } else {
            eventStateMap.delete(eventName);
        }

    };


}
