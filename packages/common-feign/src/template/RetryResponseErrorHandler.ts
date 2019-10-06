import {ResponseErrorHandlerInterFace} from "./ResponseErrorHandler";
import {HttpRequest} from "../client/HttpRequest";
import {HttpResponse} from "../client/HttpResponse";

/**
 * Support error handling for request retry
 **/
export class RetryResponseErrorHandler<T extends HttpRequest = HttpRequest> implements ResponseErrorHandlerInterFace<T> {

    handleError = (request: T, response: HttpResponse<any>): Promise<HttpResponse<any>> => {

        return null;
    }


}
