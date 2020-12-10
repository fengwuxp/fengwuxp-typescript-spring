/* tslint:disable */
import {Sex} from "../enums/Sex";

/**
 * 这是一个样例描述
 **/
export interface ExampleReq {

   name: number;
   /**
    * 年龄
    **/
   age?: number;
   /**
    * is main
    **/
   isMain?: number;
   sex?: Sex;
   /**
    * 生日
    **/
   birthday?: number;
   values?: number;
}