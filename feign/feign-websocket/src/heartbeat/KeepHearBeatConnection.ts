type StopHearBeatFunction = () => void;


export interface KeepHearBeatConnection<S = any> {


    isConnected: () => boolean;

    /**
     * 开始心跳检测任务
     * @param options
     */
    start: () => void;

    /**
     * 关闭连接
     */
    close: () => void;

    /**
     * 标记最后接收到服务端信息时间
     */
    markLastServerMessageTimes: () => void;

    onClose: (callback: () => void) => void;

}