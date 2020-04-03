import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.less'
import ExampleService from '@feign/services/ExampleService'
import {AppRouter} from "@src/AppRouter";
import DemoComponent from '@src/components/demo/DemoComponent';
import DemoComponent2 from '@src/components/demo/DemoComponent2';
import RefreshListContainer from '@src/components/pull-refresh/refreshListContainer';


export interface IndexProps {


}

export interface IndexSate {

    a: string;
    b: number;
    c: boolean;
    point: {
        x: number;
        y: number
    }
}


export default class Index extends Component<IndexProps, IndexSate> {

    state: IndexSate = {
        a: null,
        b: null,
        c: false,
        point: null
    };

    constructor(props: IndexProps, context: any) {
        super(props, context);
    }

    componentWillMount() {

    }

    componentDidMount() {
        ExampleService.queryMember({
            querySize: 1
        }).then(() => {

        }).catch(() => {
            this.setState({
                point: {
                    x: 1,
                    y: 2
                }
            })
            // AppRouter.member({
            //     memberId: 1
            // },{
            //     name:"test111"
            // });
            // AppRouter.charsF2();
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
        navigationBarTitleText: '首页'
    };

    render() {
        const {point} = this.state;
        console.log("==p=>");
        if (point == null) {
            return;
        }
        return (
            <RefreshListContainer className='index'>
                <Text>Hello world! {point.x}</Text>
                {this.renderItem()}
                {/*{<DemoComponent items={["1", "2"]}*/}
                {/*                renderItem={text => {*/}

                {/*                    return <Text>{text} item</Text>*/}
                {/*                }}/>}*/}
                {<DemoComponent2 items={["1","222"]}
                                 renderItem={item => {
                                     console.log("====text==>",item)
                                     return <Text key={1}> item</Text>
                                 }}/>}
            </RefreshListContainer>
        )
    }

    private renderItem = () => {
        return (
            <View className='index'>
                <Text>Hello world!</Text>
            </View>
        )
    }
}
