import {BabelTypeFilter} from "./BabelTypeFilter";
import {File} from '@babel/types';
import {ModulePackageInfo} from "../ModulePackageInfo";
import {findDefaultDeclarationHandlers} from "../find";


/**
 * 默认导出类型的匹配
 */
export default class DefaultExportTypeFilter implements BabelTypeFilter {


    private modulePackageInfo: ModulePackageInfo;


    constructor(modulePackageInfo: ModulePackageInfo) {
        this.modulePackageInfo = modulePackageInfo;
    }

    match = (file: File) => {

        const modulePackageInfo = this.modulePackageInfo;
        return findDefaultDeclarationHandlers.reduce((prev, handle) => {
            if (prev == null) {
                return handle(file, modulePackageInfo);
            }
            return prev;
        }, null) != null;
    };


}
