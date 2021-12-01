import {HttpResponseEventHandlerSupplier, HttpResponseEventPublisher} from "./HttpResponseEvent";
import {HttpResponse} from '../client/HttpResponse';


export default class SimpleHttpResponseEventPublisher implements HttpResponseEventPublisher {

    private readonly supplier: HttpResponseEventHandlerSupplier;

    constructor(supplier: HttpResponseEventHandlerSupplier) {
        this.supplier = supplier;
    }

    publishEvent = (response: HttpResponse): void => {
        this.supplier.getHandlers(response.statusCode).forEach(handler => handler(response));
    }

}