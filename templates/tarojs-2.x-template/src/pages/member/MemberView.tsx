import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './styles.less'
import {initViewState} from "fengwuxp-tarojs-router";

export interface MemberViewProps {

    memberId: number;
}

interface MemberViewState {

}

export default class MemberView extends Component<MemberViewProps, MemberViewState> {

    componentWillMount() {
    }

    componentDidMount() {

        initViewState(this).then((viewState) => {
            console.log("viewState", viewState);
        })
    }

    componentWillUnmount() {
    }

    componentDidShow() {
    }

    componentDidHide() {
    }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '个人中心'
    }

    render() {
        return (
            <View className='index'>
                <Text>我的</Text>
            </View>
        )
    }
}
