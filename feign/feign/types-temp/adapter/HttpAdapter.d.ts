import { HttpRequest } from "../client/HttpRequest";
import { HttpResponse } from "../client/HttpResponse";
/**
 * http request adapter
 *
 * different http clients can be implemented according to different java script runtime environments.
 */
export interface HttpAdapter<T extends HttpRequest = HttpRequest> {
    /**
     * send an http request to a remote server
     * @param req
     */
    send: (req: T) => Promise<HttpResponse>;
}
