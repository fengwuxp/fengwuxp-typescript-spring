export interface Unsubscribable {

    /**
     * 取消订阅
     */
    unsubscribe(): void;
}

/**
 * 某个订阅的持有者
 */
export interface Subscription extends Unsubscribable {

    /**
     * 是否已被关闭
     */
    isClosed: () => boolean;
}
