



export interface WebSocketConnectionConfiguration {

    // server url
    url: string,

    // sub protocols
    protocols?: string | string[],

    // http Headers , header 中不能设置 Referer
    headers?: Record<string, string>;
}
