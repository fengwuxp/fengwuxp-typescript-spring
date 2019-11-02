import {HttpRequest} from "../../../packages/feign/src/client/HttpRequest";
import {HttpAdapter} from '../../../packages/feign/src/adapter/HttpAdapter';
import {HttpMediaType} from '../../../packages/feign/src/constant/http/HttpMediaType';
import {HttpClient} from '../../../packages/feign/src/client/HttpClient';


export default class HttpClientFactory {


    public static newHttpClient = <T extends HttpRequest = HttpRequest>(
        httpAdapter: HttpAdapter<T>,
        defaultProduce?: HttpMediaType,
        interceptors?: Array<MappedClientHttpRequestInterceptor<T>>) => {

        const client: HttpClient<T> = {


        }
    }
}
