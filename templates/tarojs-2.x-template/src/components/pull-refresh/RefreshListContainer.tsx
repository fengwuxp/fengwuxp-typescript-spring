import Taro, {Component} from '@tarojs/taro';
import {View, Text, ScrollView, Image} from '@tarojs/components';
import {AtActivityIndicator} from 'taro-ui';
import get from 'lodash/get';
import {mergeStyle} from './utils';
import BackTop from './BackTop';

const refreshSize = 30;
const refreshInitTop = Taro.pxTransform(-refreshSize - 10);

const footerHeight = 30;

export const RefreshState = {
    Normal: 0,          //正常状态，及无状态时
    HeaderRefresh: 1,   //下拉刷新
    FooterRefresh: 2,   //加载更多
    NoMoreData: 3,      //暂无更多
    EmptyData: 4,       //空数据
    Failure: 5,         //失败 （尚未使用）
};

interface RefreshListContainerProps {
    style?: Object,
    className?: string,
    scrollY?: boolean,
    scrollX?: boolean,
    enableBackToTop?: boolean,
    scrollWithAnimation?: boolean,
    // 返回顶部组件上，添加的搜索跳转按钮的属性
    hasSearch?: boolean,
    onSearchClick?: Function,

    // onScroll?: Function,
    onTouchMove?: Function,
    onTouchEnd?: Function,
    onTouchStart?: Function,
    onScrollToUpper?: Function,

    onHeaderRefresh?: Function,   // 下拉刷新
    onFooterRefresh?: Function,   // 触发加载更多

    refreshState?: number,
    loadingMoreText?: string,
    emptyDataText?: string,
    noMoreDataText?: string,
    emptyDataImg?: Object | any,
    themeColor?: string,

    refreshControl?: any,   // 自定义下拉刷新组件
    loadingMoreComponent?: any, // 自定义加载更多组件
    emptyDataComponent?: any,   // 自定义列表空数据组件
    noMoreData?: any,   // 自定义暂无更多组件
    backTopComponent?: any  // 自定义返回顶部组件
}

interface State {
    winHeight: number,
    intoView: string,
    startPosition: Object | any,
    dargDownStyle: Object | any,
    footerStyle: Object | any,
    canRefresh: boolean,
    isHeaderRefresh: Boolean,
    isFooterRefresh: Boolean,
    refreshState: number | undefined,
    scrollEvent: Object
}

export default class RefreshListContainer extends Component<RefreshListContainerProps, State> {

    state = {
        winHeight: 0,
        intoView: '',
        startPosition: {},
        dargDownStyle: {},
        footerStyle: {},
        canRefresh: false,
        isHeaderRefresh: false,
        isFooterRefresh: false,
        refreshState: RefreshState.Normal,
        scrollEvent: {},
    };


    static defaultProps = {
        scrollY: true,
        scrollWithAnimation: true,
        enableBackToTop: true,
        hasSearch: false,
        refreshState: RefreshState.Normal,
        loadingMoreText: '玩命加载中...',
        emptyDataText: '暂无数据!',
        noMoreDataText: '暂无更多',
        themeColor: '#999'
    };

    componentDidMount(): void {
        const {windowHeight} = Taro.getSystemInfoSync();
        this.setState({
            winHeight: windowHeight
        });
    }

    componentWillReceiveProps(nextProps: Readonly<RefreshListContainerProps>): void {
        if (nextProps.refreshState !== RefreshState.HeaderRefresh || nextProps.refreshState !== RefreshState.FooterRefresh) {
            this.setState({
                dargDownStyle: {top: refreshInitTop},
                footerStyle: {height: Taro.pxTransform(footerHeight)},
                canRefresh: false,
                refreshState: nextProps.refreshState
            });
        } else if (nextProps.refreshState === RefreshState.HeaderRefresh) {
            this.setState({
                canRefresh: false,
                refreshState: nextProps.refreshState,
                intoView: 'top'
            });
        } else {
            this.setState({
                canRefresh: false,
                refreshState: nextProps.refreshState
            });
        }
    }

    onTouchStart(e) {
        const {pageY} = e.touches[0];
        const isHeaderRefresh = pageY < 200;
        if (isHeaderRefresh && this.state.refreshState !== RefreshState.EmptyData) {
            this.setState({
                startPosition: e.touches[0],
                isHeaderRefresh,
            });
        }
    }

    onTouchMove(e) {
        const {isHeaderRefresh, isFooterRefresh, refreshState} = this.state;

        if (isHeaderRefresh && refreshState !== RefreshState.HeaderRefresh) this.setState({refreshState: RefreshState.HeaderRefresh});

        if (isHeaderRefresh || isFooterRefresh) {
            let move_p = e.touches[0],//移动时的位置
                deviationX = 0.30,//左右偏移量(超过这个偏移量不执行下拉操作)
                deviationY = 60,//拉动长度（低于这个值的时候不执行）
                maxY = 100;//拉动的最大高度

            let start_x = get(this.state.startPosition, 'clientX', 0),
                start_y = get(this.state.startPosition, 'clientY', 0),
                move_x = move_p.clientX,
                move_y = move_p.clientY;

            //得到偏移数值
            let dev = Math.abs(move_x - start_x) / Math.abs(move_y - start_y);
            if (dev < deviationX) {//当偏移数值大于设置的偏移数值时则不执行操作
                let pY = Math.abs(move_y - start_y) / 3;//拖动倍率（使拖动的时候有粘滞的感觉）
                //下拉操作
                if (move_y - start_y > 0) {
                    if (pY >= maxY) {
                        pY = maxY;
                    }
                    if (pY > deviationY) this.setState({canRefresh: true});
                    this.setState({
                        dargDownStyle: {
                            top: pY - refreshSize + 'px',
                        },
                    });
                }
                //上拉操作
                if (start_y - move_y > 0) {
                    if (pY >= maxY) {
                        pY = maxY;
                    }
                    this.setState({
                        footerStyle: {
                            height: pY + 'px'
                        },
                    });
                }

            }
        }
    }

    onTouchEnd = async () => {
        const {canRefresh, isHeaderRefresh} = this.state;
        if (canRefresh && isHeaderRefresh) {
            this.props.onHeaderRefresh && await this.props.onHeaderRefresh();
            this.setState({
                isHeaderRefresh: false
            });
        } else if (isHeaderRefresh) {
            this.setState({
                refreshState: RefreshState.Normal,
                canRefresh: false
            });
        }
    };

    /*
    * 滚动触底
    * */
    onScrollToLower = async () => {
        if (this.state.refreshState === RefreshState.Normal || this.state.refreshState === RefreshState.Failure) {
            this.props.onFooterRefresh && await this.props.onFooterRefresh();
        }
    };

    /*
    * 空数据展示组件
    * */
    renderEmptyData(emptyDataText) {
        const {emptyDataImg} = this.props;
        return this.props.emptyDataComponent ? this.props.emptyDataComponent : (
            <View style={mergeStyle([style_.emptyData, style_.colDoubleCenter])}>
                <Image src={`${emptyDataImg}`} mode='aspectFill' style={style_.emptyDataImg}/>
                <View><Text style={mergeStyle([style_.fontLarge, style_.color666])}>{emptyDataText}</Text></View>
            </View>
        );
    }

    /*
    * 下拉刷新
    * */
    renderHeaderRefresh() {
        const {dargDownStyle} = this.state;
        const {themeColor} = this.props;
        return this.props.refreshControl ? this.props.refreshControl : (
            <View style={mergeStyle([style_.pullDownRefresh, dargDownStyle])}>
                <AtActivityIndicator color={themeColor}/>
            </View>
        );
    }

    /*
    * 上拉加载更多
    * */
    renderLoadingMore(loadingMoreText) {
        const {footerStyle} = this.state;
        return this.props.loadingMoreComponent ? this.props.loadingMoreComponent : (
            <View style={mergeStyle([{height: Taro.pxTransform(footerHeight)}, footerStyle, style_.pt_sm])}>
                <View style={style_.rowDoubleCenter as any}>
                    <AtActivityIndicator content={loadingMoreText} size={24}/>
                </View>
            </View>
        );
    }

    /*
    * 暂无更多
    * */
    renderNoMoreData(noMoreDataText) {
        const {footerStyle} = this.state;
        return this.props.noMoreData ? this.props.noMoreData : (
            <View style={mergeStyle([{height: Taro.pxTransform(footerHeight)}, footerStyle, style_.noMoreData])}>
                <Text style={mergeStyle([style_.color666])}>{noMoreDataText}</Text>
            </View>
        );
    }

    render() {
        const {
            style, className, enableBackToTop, scrollY, scrollX,
            scrollWithAnimation, loadingMoreText, emptyDataText, noMoreDataText
        } = this.props;
        const {refreshState, intoView, winHeight, scrollEvent} = this.state;
        return (
            <ScrollView
                id='scrollView'
                className={className}
                style={mergeStyle([{height: `${winHeight}PX`}, style_.positionRel, style_.flex_1, style])}
                scrollY={refreshState === RefreshState.EmptyData ? false : scrollY}
                scrollX={scrollX}
                scrollIntoView={intoView}
                enableBackToTop={enableBackToTop}
                scrollWithAnimation={scrollWithAnimation}
                onTouchMove={(e) => this.onTouchMove(e)}
                onTouchStart={(e) => this.onTouchStart(e)}
                onTouchEnd={() => this.onTouchEnd()}
                onScrollToLower={this.onScrollToLower}      // 加载更多
                onScroll={(e) => this.setState({scrollEvent: e, intoView: ''})}
            >
                {/*用来返回顶部*/}
                <Text id='top'/>
                {/*下拉刷新效果*/}
                {refreshState === RefreshState.HeaderRefresh && this.renderHeaderRefresh()}
                {/*子组件内容*/}
                {this.props.children}
                {/*暂无数据*/}
                {refreshState === RefreshState.EmptyData && this.renderEmptyData(emptyDataText)}
                {/*加载更多*/}
                {refreshState === RefreshState.FooterRefresh && this.renderLoadingMore(loadingMoreText)}
                {/*暂无更多*/}
                {refreshState === RefreshState.NoMoreData && this.renderNoMoreData(noMoreDataText)}
                {/*返回顶部*/}
                <BackTop scrollEvent={scrollEvent} onClick={() => this.setState({intoView: 'top'})}
                         backTopComponent={this.props.backTopComponent}/>
            </ScrollView>
        );
    }
}

const style_ = {
    pullDownRefresh: {
        width: Taro.pxTransform(refreshSize),
        height: Taro.pxTransform(refreshSize),
        background: '#fff',
        borderRadius: '50%',
        boxShadow: '0 0 10px 0 #ddd',
        position: 'absolute',
        top: refreshInitTop,
        left: '50%',
        zIndex: 999,
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyData: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: Taro.pxTransform(30)
    },
    emptyDataImg: {
        width: Taro.pxTransform(150),
        height: Taro.pxTransform(150),
    },
    colDoubleCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowDoubleCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flex_1: {
        flex: 1
    },
    noMoreData: {
        paddingTop: Taro.pxTransform(6),
        paddingLeft: Taro.pxTransform(12),
        paddingRight: Taro.pxTransform(12),
        textAlign: 'center'
    },
    fontLarge: {
        fontSize: Taro.pxTransform(15)
    },
    color666: {
        color: '#666'
    },
    positionRel: {
        position: 'relative'
    },
    pt_sm: {
        paddingTop: Taro.pxTransform(6)
    }
};
