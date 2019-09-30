import {ResolveHttpResponse} from "./ResolveHttpResponse";
import {HttpResponse} from "../client/HttpResponse";


export default class CommonResolveHttpResponse implements ResolveHttpResponse<Response> {


    resolve = (resp: Response): HttpResponse => {

        const {headers, ok, status} = resp;

        return {
            data: resp['data'],
            headers,
            ok,
            status,
            statusText: resp["statusText"] || null
        }
    };


}
