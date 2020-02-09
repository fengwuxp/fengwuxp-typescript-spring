
import {BabelTypeFilter} from "./BabelTypeFilter";
import {MetadataType} from "../../core/type/TypeFilter";


/**
 * 匹配存在 {@code decoratorPath} 装饰器的程序代码
 */
export class DecoratorTypeFilter implements BabelTypeFilter {

    private decoratorPath: string;
    private decoratorName: string;


    constructor(decoratorPath: string, decoratorName: string) {
        this.decoratorPath = decoratorPath;
        this.decoratorName = decoratorName;
    }

    match = (file: MetadataType) => {

        return null;
    };


}
