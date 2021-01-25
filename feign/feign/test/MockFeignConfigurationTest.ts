import {MockFeignConfiguration} from "../src/configuration/MockFeignConfiguration";
import ProcessBarExecutorInterceptor from "../src/ui/ProcessBarExecutorInterceptor";
import {FeignRequestOptions, FileUploadProgressBarOptions, ProgressBarOptions} from "../src";
import CodecFeignClientExecutorInterceptor from "../src/codec/CodecFeignClientExecutorInterceptor";
import DateEncoder from "../src/codec/DateEncoder";
import UnifiedFailureToastExecutorInterceptor from "../src/ui/UnifiedFailureToastExecutorInterceptor";
import {MockRequestFileObjectEncoder} from "./upload/MockRequestFileObjectEncoder";
import TraceRequestExecutorInterceptor from "../src/trace/TraceRequestExecutorInterceptor";
import MockHttpAdapter from "../src/adapter/mock/MockHttpAdapter";
import {REQUEST_AUTHENTICATION_TYPE_HEADER_NAME} from "../src/constant/FeignConstVar";


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
                    console.log("showProgressBar", progressBarOptions);
                },
                hideProgressBar: () => {
                    console.log("hideProgressBar");
                }
            }),
            new CodecFeignClientExecutorInterceptor([
                new DateEncoder(),
                new MockRequestFileObjectEncoder({
                    // @ts-ignore
                    fileUploadProgressBar: () => {
                        return {
                            hideProgressBar: function () {
                                console.debug("fileUploadStrategy hideProgressBar")
                            },
                            onUploadProgressChange: function (progress: number, fileIndex: number) {
                                console.debug("onUploadProgressChange", progress, fileIndex);
                            },
                            showProgressBar: function (progressBarOptions: FileUploadProgressBarOptions) {
                                console.debug("fileUploadStrategy showProgressBar", progressBarOptions)
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
                console.log("-----UnifiedTransformDataExecutorInterceptor-->", response);
            }),
            new TraceRequestExecutorInterceptor({
                onRequest: (options) => {
                    console.info("请求参数：", options);
                },
                onSuccess: (options, response) => {
                    console.info("请求成功：", options, response);
                },
                onError: (options, response) => {
                    console.error("请求失败：", options, response);
                },
            })
        ]
    }
}
