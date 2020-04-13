import * as log4js from "log4js";
import {SKU, SKUItemValue, SpecificationValueItem} from "../../src/sku/SKUSelector";
import DefaultSKUSelector from "../../src/sku/DefaultSKUSelector";


const logger = log4js.getLogger();
logger.level = 'debug';

describe("sku select", () => {

    const sku: SKU<SKUItemValue> = {
        // '4G|白色|电信': {id: 1, price: 2, stock: 0},
        // '4G|黑色|电信': {id: 1, price: 2, stock: 10},
        // '4G|金色|电信': {id: 1, price: 2, stock: 10},

        '4G|白色|移动': {id: 1, price: 2, stock: 0},
        '4G|黑色|移动': {id: 1, price: 2, stock: 10},
        '4G|金色|移动': {id: 1, price: 2, stock: 0},

        '4G|白色|联通': {id: 1, price: 2, stock: 0},
        '4G|黑色|联通': {id: 1, price: 2, stock: 0},
        '4G|金色|联通': {id: 1, price: 2, stock: 10},

        '5G|白色|电信': {id: 1, price: 2, stock: 10},
        '5G|黑色|电信': {id: 1, price: 2, stock: 10},
        '5G|金色|电信': {id: 1, price: 2, stock: 10},

        '5G|白色|移动': {id: 1, price: 2, stock: 10},
        '5G|黑色|移动': {id: 1, price: 2, stock: 10},
        '5G|金色|移动': {id: 1, price: 2, stock: 10},

        '5G|白色|联通': {id: 1, price: 2, stock: 10},
        '5G|黑色|联通': {id: 1, price: 2, stock: 10},
        '5G|金色|联通': {id: 1, price: 2, stock: 10},
    };

    const specificationAttrValues: SpecificationValueItem[][] = [
        [
            {
                specification: "网络",
                value: "4G",
                specificationIndex: 0,
                valueIndex: 0
            },
            {
                specification: "网络",
                value: "5G",
                specificationIndex: 0,
                valueIndex: 1
            },
        ],
        [
            {
                specification: "颜色",
                value: "白色",
                specificationIndex: 1,
                valueIndex: 0
            },
            {
                specification: "颜色",
                value: "黑色",
                specificationIndex: 1,
                valueIndex: 1
            },
            {
                specification: "颜色",
                value: "金色",
                specificationIndex: 1,
                valueIndex: 2
            },
        ],
        [
            {
                specification: "运营商",
                value: "电信",
                specificationIndex: 2,
                valueIndex: 0
            },
            {
                specification: "运营商",
                value: "移动",
                specificationIndex: 2,
                valueIndex: 1
            },
            {
                specification: "运营商",
                value: "联通",
                specificationIndex: 2,
                valueIndex: 2
            }

        ]
    ];

    test("test default sku selector", () => {


        const defaultSKUSelector = new DefaultSKUSelector(sku, specificationAttrValues);

        defaultSKUSelector.selected(
            {
                specification: "网络",
                value: "4G",
                specificationIndex: 0,
                valueIndex: 0
            }).then((result) => {
            logger.debug("选中结果", result);
        });

        defaultSKUSelector.selected(
            {
                specification: "颜色",
                value: "黑色",
                specificationIndex: 1,
                valueIndex: 1
            }).then((result) => {
            logger.debug("选中结果==>2", result);
        });

        defaultSKUSelector.selected(
            {
                specification: "运营商",
                value: "联通",
                specificationIndex: 2,
                valueIndex: 2
            }).then((result) => {
            logger.debug("选中结果==>3", result);
        })
    })

});

