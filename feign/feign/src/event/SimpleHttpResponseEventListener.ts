import {HttpResponseEventHandler, SmartHttpResponseEventListener} from "./HttpResponseEvent";
import {HttpStatus} from '../constant/http/HttpStatus';
import {HttpResponse} from "../client/HttpResponse";


export default class SimpleHttpResponseEventListener implements SmartHttpResponseEventListener {

    private errorHandlers: HttpResponseEventHandler[] = [];

    private readonly handlerCaches: Record<number, HttpResponseEventHandler[]> = {};

    onEvent = (httpStatus: HttpStatus | number | HttpResponseEventHandler, handler?: HttpResponseEventHandler): void => {
        const handlers = this.getHandlersByHttpStatus(httpStatus as number);
        handlers.push(handler);
        this.storeHandlers(httpStatus as number, handlers);
    }

    onFound = (handler: (response: HttpResponse) => void): void => {
        this.onEvent(HttpStatus.FOUND, handler);
    }

    onForbidden = (handler: HttpResponseEventHandler): void => {
        this.onEvent(HttpStatus.FORBIDDEN, handler);
    }

    onUnAuthorized = (handler: HttpResponseEventHandler): void => {
        this.onEvent(HttpStatus.UNAUTHORIZED, handler);
    }

    onError = (handler: HttpResponseEventHandler): void => {
        this.errorHandlers.push(handler);
    }

    removeErrorListen = (handler: HttpResponseEventHandler): void => {
        this.errorHandlers = this.filterHandlers(this.errorHandlers, handler);
    }

    removeListen(httpStatus: HttpStatus | number, handler?: HttpResponseEventHandler): void {
        if (handler == null) {
            this.storeHandlers(httpStatus, []);
        } else {
            const handlers = this.getHandlersByHttpStatus(httpStatus);
            this.storeHandlers(httpStatus, this.filterHandlers(handlers, handler));
            this.removeErrorListen(handler);
        }
    }

    getHandlers = (httpStatus: HttpStatus | number): HttpResponseEventHandler[] => {
        return [
            ...this.getHandlersByHttpStatus(httpStatus),
            ...this.errorHandlers
        ];
    }
    private getHandlersByHttpStatus = (httpStatus: HttpStatus | number): HttpResponseEventHandler[] => {
        return this.handlerCaches[httpStatus] ?? [];
    }

    private storeHandlers = (httpStatus: HttpStatus | number, handlers: HttpResponseEventHandler[]) => {
        this.handlerCaches[httpStatus] = handlers;
    }

    private filterHandlers = (handlers: HttpResponseEventHandler[], handler: HttpResponseEventHandler): HttpResponseEventHandler[] => {
        return handlers.filter(item => item != handler);
    }
}