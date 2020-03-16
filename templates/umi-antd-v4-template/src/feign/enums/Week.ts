import {Enum} from "fengwuxp-typescript-feign";

/**
 * 星期
 **/
export class Week {

  constructor() {
  }

  public static readonly 星期一: Enum = {
    name: "星期一",
    ordinal: 0,
    desc: "周一"
  };
  public static readonly 星期二: Enum = {
    name: "星期二",
    ordinal: 1,
    desc: "周一"
  };


}


for (let n in Week){

}
