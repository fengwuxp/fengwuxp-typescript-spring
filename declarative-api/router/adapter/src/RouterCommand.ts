/**
 * 路由指令
 */
export enum RouterCommand {


    //在堆栈顶部添加路由，然后向前导航到该路径
    PUSH = "push",

    TO = "to",

    //导航回以前的路线
    POP = "pop",

    //导航到堆栈的顶部路径，解除所有其他路径
    POP_TO_TOP = "popToTop",

    //用新状态替换当前状态
    RESET = "reLaunch",

    //用另一条路线替换给定键的路线
    REPLACE = "replace"


}
