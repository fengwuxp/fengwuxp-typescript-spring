

export interface RestOperationOptions {


    /**
     * 使用统一响应转换
     * 默认：true
     */
    useUnifiedTransformResponse?: boolean;

    /**
     * 是否过滤提交数据中的 空字符串，null的数据，数值类型的NaN
     * 默认：true
     * @link {../utils/SerializeRequestBodyUtil.ts}
     */
    filterEmptyString?: boolean;

    /**
     * 需要鉴权
     *  默认：false
     */
    needAuth?: boolean;



}
