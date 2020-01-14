/**
 * 为了兼容小程序无法从global 对象上读取属性
 */

import "reflect-metadata";

const Reflect = global["Reflect"];

export default Reflect;
