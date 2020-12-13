/**
 * 语言描述
 */
import {Language} from "../enums/Language";

export interface LanguageDescription {

    /**
     * 名称
     */
    name: string;

    /**
     * 文件后缀名称
     */
    extension: string;

    /**
     * 模板目录
     * 默认使用{@link #name}
     */
    templateDir: string;
}

const createLanguageDescription = (name: string, extension: string, templateDir: string = name): LanguageDescription => {
    return {
        name,
        extension,
        templateDir
    }
}

export const NONE = createLanguageDescription("", "")

export const TYPESCRIPT = createLanguageDescription("typescript", "ts");

export const getLanguageDescription = (language: Language) => {

    switch (language) {
        case Language.TYPESCRIPT:
            return TYPESCRIPT;
        default:
            return NONE
    }
}