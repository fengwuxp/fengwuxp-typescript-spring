import {MarsCommand} from "./MarsCommand";

/**
 * 协议定义参考了
 * {@link https://github.com/Tencent/mars}
 */
export interface MarsSocketProtocol {

    /**
     * 命令id
     * 长连的cgi命令号，用于标识长连请求的cgi。相当于短连的 URI
     * 用于在接收到消息时分发消息处理的依据
     * {@see WebSocketMessageRouteStrategy#route}
     * {@see WebSocketMessageProcessor#process}
     */
    commandId: string | number;

    /**
     * 序列号（消息id）
     * 是用来标识消息的唯一性的，长连上也通过比较 seq 的值来对应请求包和回包的关系。
     * 默认情况下0：表示是服务主动push下来的包
     * {@see MarsCommand#DEFAULT_PUSH_SEQ}
     */
    seq: number | MarsCommand.DEFAULT_PUSH_SEQ;

    /**
     * 客户端版本号
     * 在需要兼容多个版本时，用以区分
     */
    clientVersion?: string | number;

    /**
     * 消息体
     * 如果数据是类型是字符串，一般应该使用json格式
     */
    body: string | Blob | ArrayBuffer;
}



