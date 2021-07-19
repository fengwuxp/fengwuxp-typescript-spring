import {MockFeignConfiguration} from "./mock/MockFeignConfiguration";
import ProcessBarExecutorInterceptor from "../src/ui/ProcessBarExecutorInterceptor";
import {FeignRequestOptions, FileUploadProgressBarOptions, ProgressBarOptions} from "../src";
import CodecFeignClientExecutorInterceptor from "../src/codec/CodecFeignClientExecutorInterceptor";
import DateEncoder from "../src/codec/DateEncoder";
import UnifiedFailureToastExecutorInterceptor from "../src/ui/UnifiedFailureToastExecutorInterceptor";
import {MockRequestFileObjectEncoder} from "./upload/MockRequestFileObjectEncoder";
import TraceRequestExecutorInterceptor from "../src/trace/TraceRequestExecutorInterceptor";
import MockHttpAdapter from "./mock/MockHttpAdapter";
import {REQUEST_AUTHENTICATION_TYPE_HEADER_NAME} from "../src/constant/FeignConstVar";
import * as log4js from "log4js";

const logger = log4js.getLogger();
logger.level = 'debug';

export default class MockFeignConfigurationTest extends MockFeignConfiguration {

    getHttpAdapter = () => {
        return new MockHttpAdapter(this.baseUrl, {
            "HEAD /test/example": {
                [REQUEST_AUTHENTICATION_TYPE_HEADER_NAME]: 'NONE'
            }
        })
    };
    getFeignClientExecutorInterceptors = () => {


        return [
            new ProcessBarExecutorInterceptor({
                showProgressBar: (progressBarOptions?: ProgressBarOptions) => {
                    logger.log("[ProcessBarExecutorInterceptor]showProgressBar", progressBarOptions);
                    return () => {
                        logger.log("[ProcessBarExecutorInterceptor]hideProgressBar");
                    }
                }
            }),
            new CodecFeignClientExecutorInterceptor([
                new DateEncoder(),
                new MockRequestFileObjectEncoder({
                    // @ts-ignore
                    fileUploadProgressBar: () => {
                        return {
                            onUploadProgressChange: function (progress: number, fileIndex: number) {
                                logger.debug("[fileUploadProgressBar] onUploadProgressChange", progress, fileIndex);
                            },
                            showProgressBar: function (progressBarOptions: FileUploadProgressBarOptions) {
                                logger.debug("[fileUploadProgressBar] showProgressBar", progressBarOptions)
                                return () => {
                                    logger.log("[ProcessBarExecutorInterceptor]hideProgressBar");
                                }
                            }
                        };
                    },
                    upload: function (file: any, index: number, request: FeignRequestOptions) {
                        this.fileUploadStrategy().onUploadProgressChange(100, index);
                        return Promise.resolve(`http://file_${file}_${index}.png`);
                    }

                })
            ], []),

            new UnifiedFailureToastExecutorInterceptor((response) => {
                logger.log("[UnifiedTransformDataExecutorInterceptor] failure toast", response);
            }),
            new TraceRequestExecutorInterceptor({
                onRequest: (options) => {
                    logger.info("[TraceRequestExecutorInterceptor]请求参数：", options);
                },
                onSuccess: (options, response) => {
                    logger.info("[TraceRequestExecutorInterceptor]请求成功：", options, response);
                },
                onError: (options, response) => {
                    logger.error("[TraceRequestExecutorInterceptor]请求失败：", options, response);
                },
            })
        ]
    }
}
