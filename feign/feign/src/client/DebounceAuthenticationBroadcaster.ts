import {AuthenticationBroadcaster} from './AuthenticationStrategy';


/**
 * debounce broadcaster
 */
export default class DebounceAuthenticationBroadcaster implements AuthenticationBroadcaster {

    private unAuthorizedIsSend: boolean = false;

    private broadcaster: AuthenticationBroadcaster;


    constructor(broadcaster: AuthenticationBroadcaster) {
        this.broadcaster = broadcaster;
    }

    receiveAuthorizedEvent(handle: () => void): void {
        this.broadcaster.receiveAuthorizedEvent(() => {
            handle();
            this.unAuthorizedIsSend = false;
        });
    }

    sendUnAuthorizedEvent(): void {
        if (this.unAuthorizedIsSend) {
            return;
        }
        this.unAuthorizedIsSend = true;
        this.broadcaster.sendUnAuthorizedEvent();
    }


}
