import { ResolveHttpResponse } from "./ResolveHttpResponse";
import { HttpResponse } from "../client/HttpResponse";
export default class CommonResolveHttpResponse implements ResolveHttpResponse<Response> {
    resolve: (resp: Response) => HttpResponse<any>;
}
