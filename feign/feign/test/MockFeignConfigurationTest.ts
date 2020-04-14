import {MockFeignConfiguration} from "../src/configuration/MockFeignConfiguration";
import ProcessBarExecutorInterceptor from "../src/ui/ProcessBarExecutorInterceptor";
import {FeignRequestOptions, FileUploadProgressBarOptions, ProgressBarOptions} from "../src";
import CodecFeignClientExecutorInterceptor from "../src/codec/CodecFeignClientExecutorInterceptor";
import DateEncoder from "../src/codec/DateEncoder";
import UnifiedFailureToastExecutorInterceptor from "../src/ui/UnifiedFailureToastExecutorInterceptor";
import {MockRequestFileObjectEncoder} from "./upload/MockRequestFileObjectEncoder";


export default class MockFeignConfigurationTest extends MockFeignConfiguration{


    getFeignClientExecutorInterceptors= () =>{

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
                    fileUploadStrategy: function () {
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
            })
        ]
    }
}