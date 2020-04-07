



export interface WebSocketConnectionConfiguration {

    // server url
    url: string,

    // sub protocols
    protocols?: string | string[],

    // http Headers , headers 中不能设置 Referer
    headers?: Record<string, string>;
}
