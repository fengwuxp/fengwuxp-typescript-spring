import {Expression} from "../Expression";
import {EvaluationContext} from "../EvaluationContext";
import {ParserContext} from "../ParserContext";


const KEY_WORD = {
    "#": "#",
    "'": "'",
    '"': '"',
};

// 变量名称结束的标记
const END_CHARS = [
    "[",
    "(",
    ".",
    " ",
    "+",
    "-",
    "*",
    "%",
    ">",
    "<",
    "=",
    "&",
    "|",
    "!"
];

/**
 * 字符是否为引号
 * @param c
 */
const isQuotationMarks = (c: string) => c != KEY_WORD["'"] && c != KEY_WORD['"'];

export default class FunctionNodeExpression implements Expression {

    private expressionString: string;

    private invokeFunction: Function;

    constructor(expressionString: string, parserContext?: ParserContext) {

        if (!parserContext.isTemplate()) {
            return;
        }

        // 遍历整个表达式 将表达式转换为函数调用
        // 变量名称列表
        const variableNames: string[][] = [];
        let index = 0, variableNameIndex = -1, variableIndex = 0;
        let newExpression = [];
        while (expressionString[index] != null) {
            const c = expressionString[index];
            if (c == KEY_WORD["#"]) {
                // ParserContext#getExpressionPrefix
                if (isQuotationMarks(expressionString[index - 1])) {
                    // 下一个是字符是变量名称或方法的组成部分
                    // 过滤掉这个字符串
                    variableNameIndex = index + 1;
                }
            } else if (END_CHARS.indexOf(c) >= 0) {
                if (isQuotationMarks(expressionString[index - 1])) {
                    // 变量名称或方法到此结束
                    variableNameIndex = -1;
                    variableIndex++;
                }
            } else {

            }
            if (index !== variableNameIndex - 1) {
                // 不是#
                newExpression.push(c);
            }
            if (variableNameIndex > 0 && index >= variableNameIndex) {
                // 组装变量名称
                if (variableNames[variableIndex] == null) {
                    variableNames[variableIndex] = [];
                }
                variableNames[variableIndex].push(c);
            }
            index++;
        }

        this.expressionString = newExpression.join("");

        // 执行阶段的变量列表
        const executeVariableNames = this.getExecuteVariableNames(variableNames);


        this.invokeFunction = function (context?: EvaluationContext, rootObject?: object) {

            const code = executeVariableNames.length == 0 ? `        
                 return ${this.expressionString};
            ` : `     
                 
                  let {${executeVariableNames}}=arguments[0];      
                  return ${this.expressionString};
            `;
            console.log("执行的代码", code);
            return new Function(code)(context);
        }

    }


    getExpressionString = () => this.expressionString;

    getValue = <T = any>(context?: EvaluationContext, rootObject?: object) => {

        return this.invokeFunction(context, rootObject);
    };

    isWritable = (context?: EvaluationContext, rootObject?: object) => false;

    setValue = (context: EvaluationContext, rootObject: object, value: any) => undefined;

    private getExecuteVariableNames = (variableNames: string[][]) => {
        const names = new Set<string>(variableNames.filter(chars => {
            return chars.length > 0;
        }).map(chars => {
            return chars.join("");
        }));

        return Array.from(names).join(",");
    }
}
