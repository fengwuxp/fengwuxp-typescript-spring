import {HttpResponseEventHandlerSupplier, HttpResponseEventPublisher} from "./HttpResponseEvent";
import {HttpResponse} from '../client/HttpResponse';
import {FeignRequestOptions} from "../FeignRequestOptions";


export default class SimpleHttpResponseEventPublisher implements HttpResponseEventPublisher {

    private readonly supplier: HttpResponseEventHandlerSupplier;

    constructor(supplier: HttpResponseEventHandlerSupplier) {
        this.supplier = supplier;
    }

    publishEvent = (request: FeignRequestOptions, response: HttpResponse): void => {
        this.supplier.getHandlers(response.statusCode).forEach(handler => handler(request, response));
    }

}