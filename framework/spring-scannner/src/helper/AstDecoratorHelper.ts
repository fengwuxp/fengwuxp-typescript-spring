import {Decorator, File,} from "@babel/types";
import {REACT_VIEW_MAPPING_DECORATOR_PACKAGE_NAME} from "../constant/DecoratorPackageConstantVar";
import {findDecoratorByExportDefault} from "./FindAstHelper";


/**
 * 是否为 ReactView decorator
 * @param file
 */
export const hasReactViewDecorator = (file: File) => {

    return getReactViewDecorator(file) != null;

};

/**
 * 获取 ReactView的注解
 * @link fengwuxp-spring-react/src/route/ReactView
 * @param file
 */
export const getReactViewDecorator = (file: File) => {

    return getFileDecorator(file, REACT_VIEW_MAPPING_DECORATOR_PACKAGE_NAME);
};


/**
 * 获取类上的注解
 * @param file
 * @param packageName 注解的包名
 */
export const getFileDecorator = (file: File, packageName: string): Decorator => {
    if (file == null) {
        return null;
    }

    return findDecoratorByExportDefault(file, {
        packageName
    });
};

