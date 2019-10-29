

/**
 * response data
 */
export interface HttpResponseDataDecoder<E = any> {

    /**
     * decode
     * @param response
     */
    decode: (response: E) => E;
}
