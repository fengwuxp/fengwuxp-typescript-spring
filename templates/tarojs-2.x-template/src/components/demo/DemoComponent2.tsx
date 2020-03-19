import Taro, {Component} from "@tarojs/taro";
import {Block, View} from "@tarojs/components";


export interface DemoComponent2Props {

    items: string[];

    renderItem: any
}


export default class DemoComponent2 extends Component<DemoComponent2Props> {


    constructor(props: DemoComponent2Props, context: any) {
        super(props, context);
    }

    render() {

        // console.log("====this.props===>", this.props);
        const {items, renderItem} = this.props;

        return <View>
            <Block>
                {
                    items.map((item, index) => {
                        return renderItem(item, index);
                    })
                }
            </Block>
            {/*{*/}
            {/* renderItem("xxx")*/}
            {/*}*/}
        </View>

    }
}
