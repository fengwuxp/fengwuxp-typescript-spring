import {File} from "@babel/types";
import {BabelTypeFilter} from "./BabelTypeFilter";


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

    match = (file: File) => {

        return null;
    };


}
