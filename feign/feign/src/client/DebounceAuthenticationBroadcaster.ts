import {AuthenticationBroadcaster} from './AuthenticationStrategy';
import debounce from "lodash/debounce";

/**
 * debounce broadcaster
 */
export default class DebounceAuthenticationBroadcaster implements AuthenticationBroadcaster {


    private broadcaster: AuthenticationBroadcaster;

    constructor(broadcaster: AuthenticationBroadcaster) {
        this.broadcaster = broadcaster;
    }

    receiveAuthorizedEvent(handle: () => void): void {
        this.broadcaster.receiveAuthorizedEvent(handle);
    }

    sendUnAuthorizedEvent = debounce(() => {
        this.broadcaster.sendUnAuthorizedEvent();
    }, 200);


}
