import {HttpResponse} from "../client/HttpResponse";
import {HttpMethod} from "../constant/HttpMethod";
import {ResponseExtractor} from "./ResponseExtractor";

/**
 * Interface specifying a basic set of RESTful operations.
 * Implemented by {@link RestTemplate}. Not often used directly, but a useful
 * option to enhance testability, as it can easily be mocked or stubbed.
 */
export interface RestOperations {

    //GET

    /**
     * Retrieve a representation by doing a GET on the specified URL.
     * The response (if any) is converted and returned.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    getForObject: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;

    /**
     * Retrieve a representation by doing a GET on the URI template.
     * The response is converted and stored in an {@link HttpResponse}.
     * <p>URI Template variables are expanded using the given map.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    getForEntity: <E = any>(url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;

    //HEAD

    /**
     * Retrieve all headers of the resource specified by the URI template.
     * <p>URI Template variables are expanded using the given map.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return all HTTP headers of that resource
     * @see {@link UriVariable}
     */
    headForHeaders: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<Record<string, string>>;

    //POST

    /**
     * Create a new resource by POSTing the given object to the URI template,
     * and returns the response as {@link HttpResponse}.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * <p>The body of the entity, or {@code request} itself, can be a
     * @param url the URL
     * @param request the Object to be POSTed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    postForEntity: <E = any>(url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpResponse<E>>;

    /**
     * Create a new resource by POSTing the given object to the URI template, and returns the value of
     * the {@code Location} header. This header typically indicates where the new resource is stored.
     * <p>URI Template variables are expanded using the given map.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request
     * <p>The body of the entity, or {@code request} itself, can be a
     * @param url the URL
     * @param request the Object to be POSTed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the value for the {@code Location} header
     * @see {@link UriVariable}
     */
    postForLocation: (url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<string>;

    /**
     * Create a new resource by POSTing the given object to the URI template,
     * and returns the representation found in the response.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * <p>The body of the entity, or {@code request} itself, can be a
     * @param url the URL
     * @param request the Object to be POSTed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    postForObject: <E = any>(url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;

    //PUT

    /**
     * Create or update a resource by PUTting the given object to the URI.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * @param url the URL
     * @param request the Object to be PUT (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @see {@link UriVariable}
     */
    put: (url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;

    //PATCH

    /**
     * Update a resource by PATCHing the given object to the URL,
     * and return the representation found in the response.
     * <p>The {@code request} parameter can be a {@link HttpRequest} in order to
     * add additional HTTP headers to the request.
     * <p><b>NOTE: The standard JDK HTTP library does not support HTTP PATCH.
     * You need to use the Apache HttpComponents or OkHttp request factory.</b>
     * @param url the URL
     * @param request the object to be PATCHed (may be {@code null})
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the converted object
     * @see {@link UriVariable}
     */
    patchForObject: <E = any>(url: string, request: any, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<E>;

    //DELETE

    /**
     * Delete the resources at the specified URI.
     * <p>URI Template variables are expanded using the given URI variables, if any.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @see {@link UriVariable}
     */
    delete: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<void>;

    //OPTIONS

    /**
     * Return the value of the Allow header for the given URI.
     * <p>URI Template variables are expanded using the given map.
     * @param url the URL
     * @param uriVariables the variables to expand the template  or  uriVariables the map containing variables for the URI template
     * @param headers
     * @return the value of the allow header
     * @see {@link UriVariable}
     */
    optionsForAllow: (url: string, uriVariables?: UriVariable, headers?: Record<string, string>) => Promise<HttpMethod[]>;

    /**
     * Execute the HTTP method to the given URL, preparing the request with the，and reading the response with a {@link ResponseExtractor}.
     * @param url the URL
     * @param method the HTTP method (GET, POST, etc)
     * @param uriVariables object that extracts the return value from the response
     * @param request object that prepares the request
     * @param responseExtractor object that extracts the return value from the response
     * @param headers
     * @return an arbitrary object, as returned by the {@link ResponseExtractor}
     */
    execute: <E = any>(url: string,
                       method: HttpMethod,
                       uriVariables?: UriVariable,
                       request?: any,
                       responseExtractor?: ResponseExtractor<E>,
                       headers?: Record<string, string>) => Promise<E>;
}

/**
 * uri path variable
 * example url: "http://a.b.com/{module}/{id}", ["member",1]  ==> "http://a.b.com/member/1"
 */
type UriPathVariable = Array<boolean | string | number | Date>;

/**
 * query params type
 */
export type QueryParamType = Record<string, boolean | number | string | Date | UriPathVariable>;

/**
 * uri variable type
 * example url: "http://a.b.com/",{module:"member",id:1}  ==> "http://a.b.com/?module=member&id=1"
 */
export type UriVariable = UriPathVariable | QueryParamType;

