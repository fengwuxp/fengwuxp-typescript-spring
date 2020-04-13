import {ExpectAction, SelectResult, SKU, SKUItemValue, SKUSelector, SpecificationValueItem} from "./SKUSelector";


export default class DefaultSKUSelector<T extends SKUItemValue = SKUItemValue> implements SKUSelector<T> {


    // 分割 SKUItemKey的符号
    public static SPLIT_SYMBOL: string = "|";

    // sku 集合
    private sku: SKU<T> = null;

    // 规格属性列表
    private specificationAttrValues: SpecificationValueItem[][];

    // 当前选中的规格值
    private selectedValues: SpecificationValueItem[];

    // 无效的规格属性值
    private invalidValues: SpecificationValueItem[][];


    constructor(sku: SKU<T>, specificationAttrValues: SpecificationValueItem[][]) {
        this.sku = sku;
        this.specificationAttrValues = specificationAttrValues;
        // 初始化
        this.selectedValues = specificationAttrValues.map(item => null);
        this.invalidValues = [];
    }

    clear = () => {
        this.selectedValues = [];
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
        const selected = this.isSelected(value);
        if (selected) {
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

        const {selectedValues, specificationAttrValues} = this;

        if (ExpectAction.SELECTED === action) {
            // 选中
            selectedValues[value.specificationIndex] = value;
        } else if (ExpectAction.REMOVE === action) {
            // 移除
            selectedValues[value.specificationIndex] = null;
        }
        this.permutationsSpecification(selectedValues, specificationAttrValues);

        const sku = this.selectedValues.includes(null) ? null : this.getSkuItem(this.selectedValues);
        const isInventoryShortage = sku == null ? false : this.isInventoryShortage(sku);
        if (isInventoryShortage) {
            this.invalidValues = [];
        }
        return Promise.resolve({
            sku,
            // 如果选中的没有库存 移除所有选中
            selected: isInventoryShortage ? [] : this.selectedValues.filter(item => item != null),
            invalid: this.invalidValues
        });

    };


    /**
     * 排列组合 规格值
     * @param selectedValues 以选中的规格属性
     * @param values         所有的规格属性
     */
    private permutationsSpecification = (selectedValues: SpecificationValueItem[], values: SpecificationValueItem[][]) => {

        // 过滤出null的列，进行排列
        const items: SpecificationValueItem[] = [];
        const indexs = selectedValues.map((item, index) => {
            const notNull = item != null;
            if (notNull) {
                items.push(item);
            }
            return notNull ? -1 : index;
        }).filter(index => index >= 0);

        if (indexs.length === 0) {
            // 全部选中
        } else {
            const permutations = this.permutations(items, values.filter((item, index) => indexs.includes(index)));
            this.markDisabled(permutations);
        }


    };


    /**
     * 排列组合
     * @param selectedValues   选中的的值
     * @param otherValues      未选中的值
     */
    private permutations = (selectedValues: SpecificationValueItem[],
                            otherValues: SpecificationValueItem[][]): SpecificationValueItem[][] => {

        // 得到全部的排列组合
        // return otherValues.reduce((prev, currentValue) => {
        //
        //     return this.allPermutations(currentValue, prev);
        // }, selectedValues as any);

        const temp: Array<SpecificationValueItem[] | SpecificationValueItem> = otherValues.reduce((previousValue, currentValue) => {
            return this.allPermutations(previousValue, currentValue);
        }, otherValues.pop() as any);

        if (Array.isArray(temp[0])) {
            return this.allPermutations(selectedValues, temp) as SpecificationValueItem[][];
        } else {
            return this.allPermutations([selectedValues], temp) as SpecificationValueItem[][];
        }
    };


    /**
     * 全排列2 个数组
     * @param v1
     * @param v2
     */
    protected allPermutations = (v1: Array<SpecificationValueItem[] | SpecificationValueItem>, v2: Array<SpecificationValueItem[] | SpecificationValueItem>): Array<SpecificationValueItem[] | SpecificationValueItem> => {

        return v1.map((i1) => {

            return v2.map((i2) => {
                if (Array.isArray(i2)) {
                    return [i1, ...i2]
                }
                if (Array.isArray(i1)) {
                    return [...i1, i2]
                } else {
                    return [i1, i2]
                }
            })
        }).flatMap(items => [...items]) as Array<SpecificationValueItem[] | SpecificationValueItem>;
    };


    /**
     * 标记为不可用，将不可选中的加入无效的列表中
     * @param values
     */
    protected markDisabled = (values: SpecificationValueItem[][]) => {
        const markMaps: Map<SpecificationValueItem, number[]/*库存是否失效*/> = new Map();
        values.forEach((items) => {
            const skuItem = this.getSkuItem(items);
            if (skuItem == null) {
                // throw new Error(`sku not found ${values}`);
                return null;
            }
            // 判断是库存是否不足
            const isInventoryShortage = this.isInventoryShortage(skuItem);
            // 设置标记
            items.forEach((item) => {
                let number = markMaps.get(item) || [];
                if (isInventoryShortage) {
                    number.push(-1)
                } else {
                    number.push(1);
                }
                markMaps.set(item, number);
            })
        });

        const invalidValues = this.specificationAttrValues.map(item => []);
        const selectedValues = this.selectedValues;
        // const specificationAttrValues = this.specificationAttrValues;
        markMaps.forEach((value, key) => {
            if (!value.includes(1)) {
                // 所有的排列都没有库存了
                const indexOf = selectedValues.indexOf(key);
                if (indexOf >= 0) {
                    // selectedValues[indexOf] = null;
                } else {
                    // invalidValues.add(key);
                    invalidValues[key.specificationIndex].push(key);
                }
            }
        });

        this.invalidValues = invalidValues;

    };


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
     * 当前项是否已经选中
     * @param value
     */
    private isSelected = (value: SpecificationValueItem) => {

        return this.selectedValues.some(item => {
            return item.specification == value.specification && item.value == item.value
        })

    };

    private getSkuItem = (values: SpecificationValueItem[]) => {
        const skuKey = values.sort((v1, v2) => {
            return v1.specificationIndex - v2.specificationIndex;
        }).map(item => item.value).join(DefaultSKUSelector.SPLIT_SYMBOL);
        const skuElement = this.sku[skuKey];
        if (skuElement == null) {
            return null;
        }
        // console.log("----->", skuKey, skuElement.stock);
        return skuElement;

    }
}
