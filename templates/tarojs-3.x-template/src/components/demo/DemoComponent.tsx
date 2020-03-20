import Taro from "@tarojs/taro";
import {View} from "@tarojs/components";


export interface DemoComponentProps {

    items: string[];
    renderItem: any
}


const DemoComponent = (props: DemoComponentProps) => {

    // console.log("====this.props===>", props);
    // const { items} = props;

    return <View>
        {
            // items.map((item)=>{
            //     return props.renderItem(item);
            // })
        }
    </View>
};

export default DemoComponent
