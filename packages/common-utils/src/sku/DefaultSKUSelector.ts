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
        const specificationValueWeight = this.matchSkuSpecificationValueWeight();
        console.log("=====specificationValueWeight===>", specificationValueWeight);
        const specificationAttrValues = this.specificationAttrValues;
        const invalidValues: Array<Set<SpecificationValueItem>> = specificationAttrValues.map(() => new Set<SpecificationValueItem>());
        for (let key in specificationValueWeight) {
            if (specificationValueWeight[key] >= 0) {
                continue;
            }
            const [name, index] = key.split("_");
            // 需要禁用
            const valueItem = specificationAttrValues[index].find(item => item.value === name);
            if (valueItem != null && !this.isSelected(valueItem)) {
                invalidValues[index].add(valueItem);
            }
        }
        this.invalidValues = invalidValues.map((items) => Array.from(items));

    }


    /**
     * 获取到所有sku 规格属性的权重，
     */
    private matchSkuSpecificationValueWeight = (): Record<string, number> => {
        // let length = this.selectedValues.length
        const selectedValues = this.selectedValues
            .filter((item) => {
                return item != null;
            });


        // 合并相同没有库存的sku 记录，并将权重设置为-1

        const skuGoodsWeight = {};

        const matchSkuGoods: Array<{ key: string, value: T }>[] = selectedValues.map(this.matchSkuGoods);


        // 查找一定有库存的路径
        const stockSkuGoods: Array<{ key: string, value: T }> = this.filterSkuGoodsByStock(matchSkuGoods, true);

        // 查找一定没有库存的路径
        const noneStockSkuGoods: Array<{ key: string, value: T }> = this.filterSkuGoodsByStock(matchSkuGoods, false);

        noneStockSkuGoods.forEach(({key, value}) => {
            skuGoodsWeight[key] = value;
            skuGoodsWeight[key].weight = -1;
        });

        stockSkuGoods.forEach(({key, value}) => {
            skuGoodsWeight[key] = value;
            skuGoodsWeight[key].weight = 1;
        });

        console.log("====skuGoodsWeight===>", skuGoodsWeight);
        return this.weightCalculation(skuGoodsWeight);

    }

    /**
     * 按照是否有库存过滤商品
     * @param skuGoods
     * @param hasStock
     */
    private filterSkuGoodsByStock = (skuGoods: Array<{ key: string, value: T }>[], hasStock: boolean) => {
        if (skuGoods.length == 0) {
            return [];
        }
        const filterCondition = (value: T) => {
            const inventoryShortage = this.isInventoryShortage(value);
            if (hasStock) {
                return !inventoryShortage;
            }
            return inventoryShortage;
        }

        return skuGoods.reduce((prev, current, index) => {
            if (index === 0) {
                return prev;
            }
            return prev.filter(({key, value}) => {
                return current.filter((item) => {
                    return filterCondition(item.value);
                }).some((item) => {
                    return item.value === value;
                })
            });
        }, skuGoods[0].filter(({value}) => {
            return filterCondition(value);
        }));
    }

    /**
     * 计算{@link #matchSkuGoods}匹配出来的sku商品权重
     * 计算规则 将sku的路径分割后，如果当前的sku商品的库存无效，则权重-1 有效则+1
     * 默认权重为 0
     * @param skuGoods
     * @return 每个规格的值的权重
     */
    private weightCalculation = (skuGoods: Record<string, T & { weight: number }>): Record<string, number> => {
        /**
         * 第一位：规格属性的索引
         * 第二位: 规格值权重值，有库存+1，没有库存-1
         */
        const specificationValueWeight: Record<string, number> = {};

        for (let key in skuGoods) {
            const values = key.split(DefaultSKUSelector.SPLIT_SYMBOL);
            const skuGood: T & { weight: number } = skuGoods[key];
            // let weight = this.isInventoryShortage(skuGood) ? -1 : 1
            values.filter((item) => StringUtils.hasText(item))
                .forEach((key2, index) => {
                    const name = `${key2}_${index}`;
                    if (specificationValueWeight[name] == null) {
                        specificationValueWeight[name] = 0;
                    }
                    specificationValueWeight[name] += skuGood.weight;
                });
        }

        return specificationValueWeight;
    }

    /**
     * 匹配sku商品路径包含{@param item}路径的商品
     * @param item
     */
    private matchSkuGoods = (item: SpecificationValueItem): Array<{ key: string, value: T }> => {
        const pattern = this.getAntPath(item);
        const result = [];
        const sku = this.sku;
        for (let path in sku) {
            if (!this.pathMatcher.match(pattern, path)) {
                continue;
            }
            // result[path] = sku[path]
            result.push({
                key: path,
                value: sku[path]
            })
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
