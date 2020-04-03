import Taro, { useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import get from 'lodash/get';
import { mergeStyle } from './utils';

interface Props{
    className?: string,
    style?: Object | string,
    onClick: Function,
    scrollEvent: Object,
    icon?: string,
    iconSize?: number,
    color?: string,
    backTopComponent?: any
}
const showBackTopDistance = 300;  // 显示/隐藏返回顶部距离

export default function BackTop(props:Props) {
    const { style = {}, onClick, scrollEvent, iconSize = 16, color = '#ccc' } = props;
    const [ showBackTop, setShowBackTop ] = useState(false);

    const scrollTop = scrollEvent ? get(scrollEvent, 'detail.scrollTop') : null;

    const rootStyle = {
        fontSize: `${Taro.pxTransform(iconSize)}`,
        color
    };

    if(scrollEvent && scrollTop){
        if(scrollTop > showBackTopDistance && !showBackTop){
            setShowBackTop(()=>true);
        }else if(scrollTop < showBackTopDistance && showBackTop){
            setShowBackTop(()=>false);
        }
    }

    return (
        <View style={mergeStyle([style, showBackTop ? style_.show : style_.hide])}>
            {/*返回顶部*/}
            {this.props.backTopComponent ? this.props.backTopComponent : (
                <View
                    style={mergeStyle([style_.initStyle])}
                    onClick={()=>{ setShowBackTop(()=>false); onClick && onClick() }}
                >
                    <Text style={mergeStyle([rootStyle, style])} />
                </View>
            )}
        </View>
    );
}

const style_ = {
    initStyle:  {
        height: Taro.pxTransform(30),
        width: Taro.pxTransform(30),
        background: '#fff',
        boxShadow: '0 0 10px 1px #ddd',
        borderRadius: '50%',
        position: 'fixed',
        right: Taro.pxTransform(12),
        bottom: Taro.pxTransform(50),
        zIndex: 999,
        textAlign: 'center',
        lineHeight: Taro.pxTransform(30)
    },
    show: {
        display: 'block'
    },
    hide: {
        display: 'none'
    }
};
