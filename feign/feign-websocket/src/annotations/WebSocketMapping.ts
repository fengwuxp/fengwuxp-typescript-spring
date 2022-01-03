import {generateMapping, Mapping, MappingHeaders} from "fengwuxp-typescript-feign";


export enum WebSocketMethodMapping {

    SEND = "_SEND_",

    MESSAGE = "_MESSAGE_",

    OPEN = "_OPEN_",

    ERROR = "_ERROR_",

    CLOSE = "_CLOSE_"
}

export interface WebsocketMessageMappingOptions {

    /**
     * 消息类型或目标
     * 支持 path variable 例如：getMember/{memberId}，表明参数中的memberId将作为路径参数，命名要保持一致
     */
    value?: string;

    /**
     * 自定义请求头，支持命名占位符，且命名占位符支持默认值
     *
     * 1：固定值，例如 {myHeader:"1234"}
     * 2：将参数中的某些字段当做请求头，例如：{token:"{token:defaultValue}"}
     */
    headers?: MappingHeaders;
}


export const SendMessageMapping: Mapping<WebsocketMessageMappingOptions> = generateMapping<WebsocketMessageMappingOptions>(WebSocketMethodMapping.SEND);

export const SOCKET_METHOD_VALUES: Set<string> = new Set<string>([
    WebSocketMethodMapping.SEND,
    WebSocketMethodMapping.MESSAGE,
    WebSocketMethodMapping.OPEN,
    WebSocketMethodMapping.ERROR,
    WebSocketMethodMapping.CLOSE
]);

export const OnMessageMapping: Mapping<Exclude<WebsocketMessageMappingOptions, "headers">> = (options) => {
    // 检查 method 是不是和 WebSocketMethodMapping 冲突了
    if (SOCKET_METHOD_VALUES.has(options.value)) {
        throw new Error("event type in WebSocketMethodMapping key");
    }

    return generateMapping<Exclude<WebsocketMessageMappingOptions, "headers">>(WebSocketMethodMapping.MESSAGE)(options);
};

type OnMethodMappingType = Exclude<WebsocketMessageMappingOptions, "value" | "headers">

const onEventMethodMapping = (mapping: WebSocketMethodMapping) => () => {
    return generateMapping<OnMethodMappingType>(mapping)({value: mapping});
};

export const OnOpen = onEventMethodMapping(WebSocketMethodMapping.OPEN);

export const OnError = onEventMethodMapping(WebSocketMethodMapping.ERROR);

export const OnClose = onEventMethodMapping(WebSocketMethodMapping.CLOSE);
