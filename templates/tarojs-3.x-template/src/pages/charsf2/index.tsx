import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {fixF2} from 'taro-f2/dist/weapp/common/f2-tool'
import {F2Canvas} from "taro-f2";
import {initViewState} from "fengwuxp-tarojs-router";
// import F2 from "@antv/f2/lib/index"
const F2 = require('@antv/f2/lib/core'); // 必须引入
require('@antv/f2/lib/geom/interval'); // 引入 interval 几何标记
require('@antv/f2/lib/coord/polar'); // 引入 极坐标
require('@antv/f2/lib/geom/adjust/stack'); // 引入数据层叠调整类型

export interface CharF2Props {

    charType: string;

    x?: number;
}

export default class Index extends Component<CharF2Props> {


    drawRadar(canvas, width, height) {

        // ⚠️ 别忘了这行
        // 为了兼容微信与支付宝的小程序，你需要通过这个命令为F2打补丁
        fixF2(F2);

        const data = [
            {name: '超大盘能力', value: 6.5},
            {name: '抗跌能力', value: 9.5},
            {name: '稳定能力', value: 9},
            {name: '绝对收益能力', value: 6},
            {name: '选证择时能力', value: 6},
            {name: '风险回报能力', value: 8}
        ];
        const chart = new F2.Chart({
            el: canvas,
            width,
            height
        });
        chart.source(data, {
            value: {
                min: 0,
                max: 10
            }
        });
        chart.coord('polar');
        chart.axis('value', {
            grid: {
                lineDash: null
            },
            label: null,
            line: null
        });
        chart.axis('name', {
            grid: {
                lineDash: null
            }
        });
        chart.area()
            .position('name*value')
            .color('#FE5C5B')
            .style({
                fillOpacity: 0.2
            })
            .animate({
                appear: {
                    animation: 'groupWaveIn'
                }
            });
        chart.line()
            .position('name*value')
            .color('#FE5C5B')
            .size(1)
            .animate({
                appear: {
                    animation: 'groupWaveIn'
                }
            });
        chart.point().position('name*value').color('#FE5C5B').animate({
            appear: {
                delay: 300
            }
        });
        chart.guide().text({
            position: ['50%', '50%'],
            content: '73',
            style: {
                fontSize: 32,
                fontWeight: 'bold',
                fill: '#FE5C5B'
            }
        });
        chart.render();
    }

    componentDidMount(): void {


    }

    render() {


        return (
            <View className='index'>
                <View style='width:100%;height:500px'>
                    <F2Canvas onCanvasInit={this.drawRadar.bind(this)}></F2Canvas>
                </View>
            </View>
        )
    }

}
