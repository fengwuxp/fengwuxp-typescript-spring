import {LoggingEvent} from "./event/LoggingEvent";


export interface LogRecoder<T extends LoggingEvent=LoggingEvent> {

    recording: (event: T) => void;
}
