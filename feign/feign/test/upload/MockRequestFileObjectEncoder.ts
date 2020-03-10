import {AbstractRequestFileObjectEncoder} from '../../src/upload/AbstractRequestFileObjectEncoder';
import {AutoFileUploadOptions, FileUploadStrategy} from "../../src";


export class MockRequestFileObjectEncoder extends AbstractRequestFileObjectEncoder {


    constructor(fileUploadStrategy: FileUploadStrategy<any>) {
        super(fileUploadStrategy);
    }

    attrIsNeedUpload = (name: string, value, options: AutoFileUploadOptions) => {

        return true;
    };


}
