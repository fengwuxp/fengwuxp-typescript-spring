// 需要进行代码格式化的参数
import {CSSProperties} from "react";

const SIZE_PROPS_NAMES = [
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderBottomWidth',
    'borderRadius',
    'borderRightWidth',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderTopWidth',
    'shadowRadius',
    'elevation',
    'fontSize',
    'letterSpacing',
    'lineHeight',
    'width',
    'height',
    'textShadowRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderWidth',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderWidth',
    'bottom',
    'left',
    'margin',
    'marginBottom',
    'marginHorizontal',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginVertical',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'padding',
    'paddingBottom',
    'paddingHorizontal',
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingVertical',
    'right',
    'top'
];


/**
 * postCss transformer
 * @param cssObject
 * @param transformerFunctionName   example 'reactNativeScreenAdapter.scalePx2dp'
 */
export const postCssTransformer = (cssObject: Record<string, CSSProperties>, transformerFunctionName: string) => {

    Object.keys(cssObject).filter((key) => {
        //样式对象
        const styles = cssObject[key];
        SIZE_PROPS_NAMES.forEach((stylePropName) => {
            const stylePropValue = styles[stylePropName];
            if (typeof stylePropValue !== "number") {
                // 只处理 number
                return;
            }
            styles[stylePropName] = `@{${transformerFunctionName}(${stylePropValue})}`;
        });
    });
};


/**
 * 生成  输出 react-native
 * @param cssObject
 */
export const postCssTransformerCodeGenerator = (cssObject: Record<string, CSSProperties>) => {

    postCssTransformer(cssObject, "StyleSheetScreenAdapter.scalePx2dp");
    // 替换 "@{StyleSheetScreenAdapter.scalePx2dp(\\d)}" ==> StyleSheetScreenAdapter.scalePx2dp(\\d)
    const cssCodeText = JSON.stringify(cssObject).replace(/"@\{(.+?)\}"/g, function ($1, $2) {
        return $2;
    });
    return `
       import {StyleSheetScreenAdapter} from 'fengwuxp-react-native-starter';
       import {StyleSheet} from 'react-native';
       
       const cssObject = ${cssCodeText};
       const styles = StyleSheet.create(cssObject);
    
       export default styles;
    `
};


/**
 * 处理 css 变量的生成
 * @param cssVariables
 * @param transformerFunctionName
 */
export const postCssVariableTransformer = (cssVariables: Record<string, any>, transformerFunctionName: string) => {
    Object.keys(cssVariables).forEach((stylePropName) => {
        const stylePropValue = cssVariables[stylePropName];
        if (typeof stylePropValue !== "number") {
            // 只处理 number
            return;
        }
        cssVariables[stylePropName] = `@{${transformerFunctionName}(${stylePropValue})}`;
    });
};

/**
 * 生成 css variable 输出 react-native
 * @param cssObject
 */
export const postCssVariableTransformerCodeGenerator = (cssObject: Record<string, CSSProperties>) => {

    postCssTransformer(cssObject, "StyleSheetScreenAdapter.scalePx2dp");
    // 替换 "@{StyleSheetScreenAdapter.scalePx2dp(\\d)}" ==> StyleSheetScreenAdapter.scalePx2dp(\\d)
    const cssCodeText = JSON.stringify(cssObject).replace(/"@\{(.+?)\}"/g, function ($1, $2) {
        return $2;
    });
    return `
       import {StyleSheetScreenAdapter} from 'fengwuxp-react-native-starter';
        
       export default  ${cssCodeText};
    `
};
