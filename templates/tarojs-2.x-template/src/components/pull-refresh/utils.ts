/**
 * 合并 style
 * @param {Object|String} style1
 * @param {Object|String} style2
 * @returns {String}
 * 例：
 * { borderColor: '', paddingLeft: '' } 与 'border-color: "", padding-left: ""'合并
 * { borderColor: '', paddingLeft: '' } 与 { borderColor: '', paddingLeft: '' }合并
 * 'border-color: "", padding-left: ""' 与 'border-color: "", padding-left: ""'合并
 */
export function mergeStyle(style: Array<any>) {
    const objectStyleArr: Array<Object> = [{}];
    let strStyle: string = '';
    style.length && style.map((item: never)=>{
        if(typeof item === 'object'){
            objectStyleArr.push(item);
        }else {
            strStyle += item;
        }
    });
    // 如果没有对象类样式
    if(!objectStyleArr.length && strStyle.length){
        return strStyle;
        //如果没有字符串类样式
    }else if(!strStyle.length && objectStyleArr.length){
        return reduceObject(objectStyleArr);
    }else {
        return objectToString(reduceObject(objectStyleArr)) + strStyle;
    }
}

/*
* 转换对象样式 => 字符串样式
* { borderColor: '', paddingLeft: '' } => 'border-color: "", padding-left: ""'
* */
function objectToString(style: Object | string){
    if (style && typeof style === 'object') {
        let styleStr: string = '';
        Object.keys(style).forEach(key => {
            const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            styleStr += `${lowerCaseKey}:${style[key]};`;
        });
        return styleStr;
    } else if (style && typeof style === 'string') {
        return style;
    }
    return '';
}

/**
 * 把对象数组合并成一个对象
 * */
function reduceObject(arr: Array<Object>) {
    arr.push({});
    return arr.reduce((a: Object, b: Object) => Object.assign(a, b));
};
