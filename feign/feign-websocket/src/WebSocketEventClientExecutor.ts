import {
    DefaultFeignLog4jFactory,
    FeignClientExecutor,
    FeignProxyClient,
    RequestHeaderResolver,
    RequestURLResolver,
    restfulRequestURLResolver,
    simpleRequestHeaderResolver
} from "fengwuxp-typescript-feign";
import {FeignWebSocketConfiguration} from "./configuration/FeignWebSocketConfiguration";
import {
    SOCKET_METHOD_VALUES,
    WebsocketMessageMappingOptions,
    WebSocketMethodMapping
} from "./annotations/WebSocketMapping";
import {FeignWebSocketRequestOptions} from "./FeignWebSocketRequestOptions";
import {
    WebSocketMessageEventConsumer,
    WebSocketMessageEventListener,
    WebSocketMessageEventPublisher
} from "./event/WebSocketMessageEvent";


export default class WebSocketEventClientExecutor<T extends FeignProxyClient = FeignProxyClient> implements FeignClientExecutor<FeignProxyClient, any> {

    private static LOG = DefaultFeignLog4jFactory.getLogger(WebSocketEventClientExecutor.name);

    private readonly apiService: T;

    private feignConfiguration: Readonly<FeignWebSocketConfiguration>;

    private messageEventPublisher: WebSocketMessageEventPublisher

    private messageEventListener: WebSocketMessageEventListener

    // request url resolver
    private requestURLResolver: RequestURLResolver = restfulRequestURLResolver;

    // request headers resolver
    private requestHeaderResolver: RequestHeaderResolver = simpleRequestHeaderResolver;

    /**
     * 是否已经初始化
     */
    private initialized: boolean = false;

    constructor(apiService: T) {
        this.apiService = apiService;
    }

    invoke = (methodName: string, ...args) => {

        // requestMapping
        const {requestMapping} = this.apiService.getFeignMethodConfig(methodName);

        const {method} = requestMapping;
        if (this.isSend(method)) {
            // 发送消息
            this.sendMessage(requestMapping, args[0], {
                ...(args[1])
            })
        } else {
            // 监听 websocket message
            return this.listenMessageEvent(requestMapping, args[0]);
        }

    }

    private isSend = (method: string): boolean => {
        return WebSocketMethodMapping.SEND === method;
    }

    private sendMessage = (mapping: WebsocketMessageMappingOptions, data, options: FeignWebSocketRequestOptions) => {


    }

    private listenMessageEvent = (mapping: WebsocketMessageMappingOptions, consumer: WebSocketMessageEventConsumer) => {
        // return this.messageEventListener.on(mapping.value, consumer);
        if (this.isLifeCycleEvent(mapping.value)) {

        }

    }

    private isLifeCycleEvent = (eventType: string) => {
        return SOCKET_METHOD_VALUES.has(eventType);
    }


    /**
     *  init feign client executor
     */
    private initialize = async () => {
        if (this.initialized) {
            return;
        }
        this.feignConfiguration = await this.apiService.feignConfiguration<FeignWebSocketConfiguration>();
        const {
            getApiSignatureStrategy,
            getRequestHeaderResolver,
            getRequestURLResolver,
            getDefaultFeignRequestContextOptions,
        } = this.feignConfiguration;

        if (getRequestURLResolver) {
            this.requestURLResolver = getRequestURLResolver();
        }
        if (getRequestHeaderResolver) {
            this.requestHeaderResolver = getRequestHeaderResolver();
        }

        this.initialized = true;
    }
}