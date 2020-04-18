import {ExpectAction, SelectResult, SKU, SKUItemValue, SKUSelector, SpecificationValueItem} from "./SKUSelector";
import SimplePathMatcher from "../match/SimplePathMatcher";
import StringUtils from "../string/StringUtils";


// 规格属性的库存权重
enum ShortageWeight {
    DISABLE,

    ACTIVE
}

export default class DefaultSKUSelector<T extends SKUItemValue = SKUItemValue> implements SKUSelector<T> {


    // 分割 SKUItemKey的符号
    public static SPLIT_SYMBOL: string = "/";

    // sku 集合
    private sku: SKU<T> = null;

    // 无库存的sku集合
    private inventoryShortageSku: SKU<T> = null;

    // 规格属性列表
    private specificationAttrValues: SpecificationValueItem[][];

    // 当前选中的规格值
    private selectedValues: SpecificationValueItem[];

    // 无效的规格属性值
    private invalidValues: SpecificationValueItem[][];

    // 使用路径匹配来匹配将会被选中的规格商品
    private pathMatcher;


    constructor(sku: SKU<T>, specificationAttrValues: SpecificationValueItem[][]) {
        this.specificationAttrValues = specificationAttrValues;
        this.initSku(sku);
        // 初始化
        this.clear();
        this.pathMatcher = new SimplePathMatcher(DefaultSKUSelector.SPLIT_SYMBOL);
    }

    clear = () => {
        this.selectedValues = this.specificationAttrValues.map(item => null)
        this.invalidValues = [];
    };

    remove = (value: SpecificationValueItem): Promise<SelectResult<T>> => {

        // 已经选中，移除选中
        return this.actionItem(value, ExpectAction.REMOVE);
    };

    selected = (value: SpecificationValueItem): Promise<SelectResult<T>> => {
        // 已经选中，移除选中
        return this.actionItem(value, ExpectAction.SELECTED);
    };

    selectedSku = (values: SpecificationValueItem[]) => {

        return Promise.all(values.map((item) => {
            return this.selected(item);
        })).then((values) => {
            return values.pop();
        })
    };

    randomSelectedSku = () => {

        return this.selectedSku([]);
    };

    /**
     * 发生点击
     * @param value          被点击的值
     */
    onClick = (value: SpecificationValueItem): Promise<SelectResult<T>> => {
        if (this.isSelected(value)) {
            // 当前选项已经选中，则移除
            return this.remove(value)
        } else {
            return this.selected(value);
        }

    };


    /**
     * 按照动作处理每个选项
     * @param value
     * @param action
     */
    private actionItem = (value: SpecificationValueItem, action: ExpectAction): Promise<SelectResult<T>> => {

        const {selectedValues} = this;
        const isSelected = ExpectAction.SELECTED === action;
        if (isSelected) {
            // 选中
            selectedValues[value.specificationIndex] = value;
        } else if (ExpectAction.REMOVE === action) {
            // 移除
            selectedValues[value.specificationIndex] = null;
        }
        this.markInventorySkuGoods(value, isSelected);
        const sku = selectedValues.includes(null) ? null : this.getSkuItem(selectedValues);
        const isInventoryShortage = sku == null ? false : this.isInventoryShortage(sku);
        if (isInventoryShortage || selectedValues.filter(item => item != null).length === 0) {
            // 选中的数据无库存
            this.clear();

        }
        return Promise.resolve({
            sku: isInventoryShortage ? null : sku,
            // 如果选中的没有库存 移除所有选中
            selected: isInventoryShortage ? [] : selectedValues/*.filter(item => item != null)*/,
            invalid: this.invalidValues
        });

    };

    /**
     * 标记无效的sku goods
     * @param current
     * @param isSelected
     */
    private markInventorySkuGoods = (current: SpecificationValueItem, isSelected: boolean) => {
        const matchAllSkuGoods = this.matchAllInventoryShortageSkuGoods();
        // const selectedValues = this.selectedValues;
        console.log("=====none stock sku goods===>", matchAllSkuGoods.map((item) => `${item.key} ==> ${item.value.stock}`));
        // console.log("=====has stock sku goods===>", matchAllSkuGoods.filter(item => !this.isInventoryShortage(item.value)).map((item)=>`${item.key} ==> ${item.value.stock}`));
        /**
         * 第一位：规格属性的索引
         * 第二位: 规格值权重值，有库存+1，没有库存-1
         */
        const specificationValueWeight: Record<string, number> = {};
        matchAllSkuGoods.forEach(({key, value}) => {
            const values = key.split(DefaultSKUSelector.SPLIT_SYMBOL);
            values.filter((item) => StringUtils.hasText(item))
                .forEach((key2, index) => {
                    const name = `${key2}_${index}`;
                    specificationValueWeight[name] = ShortageWeight.DISABLE;
                });
        });

        // console.log("=====specificationValueWeight===>", specificationValueWeight);

        const specificationAttrValues = this.specificationAttrValues;
        const invalidValues: Array<Set<SpecificationValueItem>> = specificationAttrValues.map(() => new Set<SpecificationValueItem>());
        for (let key in specificationValueWeight) {
            const [name, index] = key.split("_")
            // 需要禁用
            const valueItem = specificationAttrValues[index].find(item => item.value === name);
            if (valueItem != null && !this.isSelected(valueItem)) {
                invalidValues[index].add(valueItem);
            }
        }
        this.invalidValues = invalidValues.map((items) => Array.from(items));

    }


    /**
     * 匹配出所有和单前选中的无效商品
     */
    private matchAllInventoryShortageSkuGoods = (): Array<{ key: string, value: T }> => {
        // let length = this.selectedValues.length
        const selectedValues = this.selectedValues
            .filter((item) => {
                return item != null;
            });

        const matchSkuGoods = selectedValues.map(this.matchInventoryShortageSkuGoods)
            .flatMap((items) => [...items]);
        // 过滤掉重复数据
        const marked: Record<string, boolean> = {}
        return matchSkuGoods.filter((item) => {
            if (!marked[item.key]) {
                marked[item.key] = true;
                return true;
            }
            return false;
        })

    }

    /**
     * 匹配商品
     * @param value
     */
    private matchInventoryShortageSkuGoods = (value: SpecificationValueItem): Array<{ key: string, value: T }> => {
        const pattern = this.getAntPath(value);
        const result = [];
        for (let path in this.inventoryShortageSku) {
            if (!this.pathMatcher.match(pattern, path)) {
                continue;
            }
            result.push({
                key: path,
                value: this.sku[path]
            });
        }
        return result;
    }


    /**
     * 获取ant 风格的路径
     * @param item
     */
    private getAntPath = (item: SpecificationValueItem) => {
        const strings = [
            DefaultSKUSelector.SPLIT_SYMBOL,
            "**",
            item.value,
            DefaultSKUSelector.SPLIT_SYMBOL,
            "**",
        ]
        return strings.join("/");
        // if (values.length === 1) {
        //
        // } else {
        //     let prev = null;
        //     const key = values.map((item) => {
        //         let result = null;
        //         if (item == null) {
        //             if (prev == null) {
        //                 return null;
        //             } else {
        //                 return "**";
        //             }
        //         } else {
        //             result = item.value;
        //         }
        //         prev = item;
        //         return result;
        //     }).filter(item => item != null).join(DefaultSKUSelector.SPLIT_SYMBOL)
        //     return `/${key}`;
        // }

    }


    /**
     * 是否库存不足
     * @param val
     */
    protected isInventoryShortage = (val: T) => {

        if (val.enabled != null && val.enabled === false) {
            return true;
        }

        return val.stock <= 0;
    };

    /**
     * 当前点击的项是否已经选中
     * @param value
     */
    private isSelected = (value: SpecificationValueItem) => {

        return this.selectedValues.filter((item) => item != null)
            .filter(item => item.specificationIndex === value.specificationIndex)
            .some(item => {
                return item.specification === value.specification && item.value === value.value
            });

    };

    private getSkuItem = (values: SpecificationValueItem[]) => {
        if (values.some(item => item == null)) {
            return null;
        }
        const sku = this.sku;
        const key = this.getKey(values.map((item) => item.value));
        return sku[key];

    }

    private initSku = (sku: SKU<T>) => {

        const newSku = {};
        const inventoryShortageSku = {};

        for (let key in sku) {
            const key1 = this.getKey(key.split(DefaultSKUSelector.SPLIT_SYMBOL));
            const element = sku[key];
            newSku[key1] = element;
            if (this.isInventoryShortage(element)) {
                inventoryShortageSku[key1] = element;
            }
        }
        // 处理所有的排序组合
        const specificationAttrValues = this.specificationAttrValues;
        const keys: string[][] = specificationAttrValues.reduce((prev, current, index) => {
            if (index == 0) {
                return prev;
            }
            return this.fullPermutations(prev, current);
        }, specificationAttrValues[0].map((item) => [item.value]));


        // 合并所有的排列组合
        keys.map(this.getKey).forEach((key) => {
            if (newSku[key] == null) {
                const item = {
                    stock: -1
                };
                // @ts-ignore
                newSku[key] = item
                inventoryShortageSku[key] = item;
            }
        });
        // console.log("===sku===>", sku);
        // console.log("===sku===>", Object.keys(sku).length);
        this.sku = newSku;
        this.inventoryShortageSku = inventoryShortageSku;
    }

    private fullPermutations = (items1: string[][], items2: SpecificationValueItem[]): string[][] => {
        const items = [];
        items1.forEach(item => {
            items2.forEach((item2) => {
                items.push([...item, item2.value])
            })
        })
        return items
    }


    private getKey = (strings: string[]) => {

        return `${DefaultSKUSelector.SPLIT_SYMBOL}${strings/*.sort()*/.join(DefaultSKUSelector.SPLIT_SYMBOL)}${DefaultSKUSelector.SPLIT_SYMBOL}`
    }
}
