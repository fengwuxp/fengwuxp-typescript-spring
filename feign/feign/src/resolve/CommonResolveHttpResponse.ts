import {ResolveHttpResponse} from "./ResolveHttpResponse";
import {HttpResponse} from "../client/HttpResponse";


export default class CommonResolveHttpResponse implements ResolveHttpResponse<Response> {


    resolve = (resp: Response): HttpResponse => {
        if (resp == null) {
            return {
                ok: false,
                headers: {},
                data: null,
                statusCode: -1,
                statusText: "Response is null"
            }
        }

        const {headers, ok, status} = resp;

        return {
            data: resp['data'],
            headers: (headers as any),
            ok,
            statusCode: status,
            statusText: resp["statusText"] || null
        }
    };


}
