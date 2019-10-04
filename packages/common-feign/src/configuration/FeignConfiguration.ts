import {HttpAdapter} from "../adapter/HttpAdapter";
import {HttpClient} from "../client/HttpClient";
import {RestOperations} from "../template/RestOperations";
import {FeignClientBuilder} from "../FeignClientBuilder";

/**
 * feign configuration
 */
export interface FeignConfiguration {


    getHttpAdapter: () => HttpAdapter;

    getHttpClient: () => HttpClient;

    getRestTemplate: () => RestOperations;

    getFeignClientBuilder: () => FeignClientBuilder;
}
