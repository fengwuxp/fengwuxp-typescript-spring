/**
 * mars command
 * {@link https://github.com/Tencent/mars/wiki/Mars-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%89%A9%E5%B1%95}
 */
export enum MarsCommand {

    // 表示是服务主动push下来的包
    DEFAULT_PUSH_SEQ = 0,

    // ping pong 的命令
    MARS_CMD_HEARTBEAT_VALUE = 6,

    // 信令
    MARS_CMD_SIGNALLING_VALUE = 243
}
