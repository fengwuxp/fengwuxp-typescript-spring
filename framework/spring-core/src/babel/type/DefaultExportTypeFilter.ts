import {BabelTypeFilter} from "./BabelTypeFilter";
import {File} from '@babel/types';
import {ModulePackageInfo} from "../ModulePackageInfo";
import {findDefaultDeclarationHandlers} from "../find";
import { MetadataType} from "../../core/type/TypeFilter";


/**
 * 默认导出类型的匹配
 */
export default class DefaultExportTypeFilter implements BabelTypeFilter {


    private modulePackageInfo: ModulePackageInfo;


    constructor(modulePackageInfo: ModulePackageInfo) {
        this.modulePackageInfo = modulePackageInfo;
    }

    match = (metadataType: MetadataType) => {

        const modulePackageInfo = this.modulePackageInfo;
        return findDefaultDeclarationHandlers.reduce((prev, handle) => {
            if (prev == null) {
                return handle(metadataType.file, modulePackageInfo);
            }
            return prev;
        }, null) != null;
    };


}
