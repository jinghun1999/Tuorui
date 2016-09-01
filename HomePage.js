/**
 * Modified by Chow on 2016-09-01.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    ListView,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
    ToastAndroid
    } from 'react-native';
import NetUtil from './app/util/NetUtil';
import Head from './app/commonview/Head';
import Sale from './app/page/Sales/Sale';
import NetWorkTool from './app/util/NetWorkTool'
import InfoClass from './app/page/HomePage/InfoClass';
import InfoDetail from './app/page/HomePage/InfoDetail';
import Information from './app/page/HomePage/InfoList';
import Contact from './app/page/HomePage/Contact';

import ViewPager from 'react-native-viewpager';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeIcon from './app/commonview/HomeIcon';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
let IMGS = [
    require('./image/job1.jpg'),
    require('./image/job2.jpg'),
    require('./image/job3.jpg'),
];
const infolistApi = CONSTAPI.APIAPP + '/AppInfo/GetHomeInfo';
/****************MainTopSceen*****************/
class TopScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}).cloneWithPages(IMGS),
            informationSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            infoLoaded: false,
            pageIndex: 1,
            pageSize: 10,
            total: 0,
            totalPage: 0,
            isRefreshing: false,
            dataCache: []
        };
        NetWorkTool.checkNetworkState((isConnected)=> {
            if (!isConnected) {
                ToastAndroid.show(NetWorkTool.NOT_NETWORK, ToastAndroid.SHORT);
            }
        });
    }

    handleMethod(isConnected) {
        console.log('test', (isConnected ? 'online' : 'offline'));
    }

    //组件刷新前调用，类似componentWillMount
    componentWillUpdate() {

    }
    //更新后的hook
    componentDidUpdate() {
    }
    componentWillMount() {
        NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE,this.handleMethod);
    }
    //销毁期，用于清理一些无用的内容，如：点击事件Listener
    componentWillUnmount() {
        NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE,this.handleMethod);
        this.timer && clearTimeout(this.timer);
    }

    componentDidMount() {
        let _this = this;
        _this.timer = setTimeout(
            () => {
                _this._loadData();
            }, 500
        );
    }

    _loadData() {
        /*从缓存中读取*/
        var _this = this;
        storage.load({
            key: 'IndexInfoList',
            autoSync: false,
            syncInBackground: false
        }).then(ret => {
            _this.setState({
                dataCache: ret.IndexInfoList,
                infoLoaded: true,
                isRefreshing: false,
            });
        }).catch(err => {
            /*缓存中不存在，则读取api*/
            _this._fetchData(this.state.pageSize, this.state.pageIndex);
            //_this._loadData();
        });
    }

    _fetchData(pageSize, pageIndex) {
        let _this = this;
        _this.setState({isRefreshing: true})
        NetUtil.get(infolistApi + "?pid=&PageSize=" + pageSize + "&PageIndex=" + pageIndex, false, function (result) {
            if (result.Status) {
                _this.setState({
                    total: result.Data.total,
                    totalPage: result.Data.TotalPage,
                    infoLoaded: true,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    isRefreshing: false,
                    dataCache: result.Data.rows,
                });
                storage.save({
                    key: 'IndexInfoList',
                    rawData: {
                        IndexInfoList: result.Data.rows
                    },
                    expires: 1000 * 3600 * 24
                });
            }
            else {
                alert("get data error")
            }
        });
    }

    _onEndReached() {
        let _this = this;
        let _pageIndex = _this.state.pageIndex + 1;
        let msg = NetUtil.get(infolistApi + "?pid=&PageIndex=" + _pageIndex + "&PageSize=" + _this.state.pageSize, false, function (result) {
            let _dataCache = _this.state.dataCache;
            result.Data.rows.forEach((d)=> {
                _dataCache.push(d);
            });
            if (result.Status) {
                _this.setState({
                    pageIndex: _pageIndex,
                    isRefreshing: false,
                    dataCache: _dataCache,
                });
            }
        });
        if (msg != null) {
            alert(msg);
        }
    }

    _toolsPress() {
        var _this = this;
        Errorr('error..');
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'Sale',
                id: 'page',
                component: Sale,
                params: {
                    id: _this.state.id,
                }
            });
        }
    }

    _renderViewPage(data) {
        return (<Image source={data} style={styles.page}/>);
    }

    _ClickPress(Info) {
        let _this = this;
        //_this.requestAnimationFrame(()=> {
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'InfoDetail',
                component: InfoDetail,
                params: {
                    requestId: Info.RequestID,
                    title: Info.InfoTitle,
                }
            })
        }
        //});
    }

    _informationClick() {
        var _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'Information',
                component: Information,
                params: {
                    headTitle: '资讯'
                }
            });
        }
    }

    _drugPress() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'InfoClass',
                component: InfoClass,
                params: {
                    headTitle: '药品信息'
                }
            });
        }
    }

    _laboratoryPress() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'InfoClass',
                component: InfoClass,
                params: {
                    headTitle: '检验手册'
                }
            });
        }
    }

    _DiagnosisPress() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'InfoClass',
                component: InfoClass,
                params: {
                    headTitle: '诊断手册'
                }
            });
        }
    }

    _onPressDoc() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'InfoClass',
                component: InfoClass,
                params: {
                    headTitle: '文献库'
                }
            });
        }
    }

    renderInfo(Info) {
        return (
            <TouchableOpacity style={styles.rows} onPress={()=>this._ClickPress(Info)}>
                <Icon name={'local-post-office'} size={20} color={'#ADD8E6'} style={styles.rowIcon}/>
                {/*<Image resource={Info.ImagePath}/>*/}
                <Text style={styles.rowText}>{Info.InfoTitle}</Text>
                <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.rowRight}/>
            </TouchableOpacity>
        )
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Head title='首页'/>
                <View style={{flexDirection:'column', justifyContent: 'center',alignItems: 'center',}}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            </View>
        );
    }

    renderFooter() {
        //if(this.state.nomore) {
        //    return null;
        //}
        return (
            <View style={{height: 120}}>
                <ActivityIndicator />
            </View>
        );
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        setTimeout(() => {
            // prepend 10 items
            this._fetchData(this.state.pageSize, 1);
            this.setState({
                isRefreshing: false,
            });
        }, 500);
    }

    render() {
        if (!this.state.infoLoaded) {
            return this.renderLoadingView();
        } else {
            return (
                <View style={styles.container}>
                    <Head title='首页'/>
                    <ListView
                        renderHeader={()=>
                              <View>
                                <ViewPager style={{height:200}}
                                        renderPage={this._renderViewPage}
                                        dataSource={this.state.imageSource}
                                        isLoop={true}
                                        autoPlay={true}/>
                                <View style={{flexDirection:'row'}}>
                                    <HomeIcon text="药品" iconName={'ios-git-network'} iconColor={'#33CC99'}
                                              onPress={this._drugPress.bind(this)}/>
                                    <HomeIcon text="检验" iconName={'ios-water'} iconColor={'#6699CC'}
                                              onPress={this._laboratoryPress.bind(this)}/>
                                    <HomeIcon text="诊断" iconName={'ios-medkit'} iconColor={'#9999CC'}
                                              onPress={this._DiagnosisPress.bind(this)}/>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <HomeIcon text="文献" iconName={'ios-book'} iconColor={'#CDB7B5'}
                                              onPress={this._onPressDoc.bind(this)}/>
                                    <HomeIcon text="资讯" iconName={'ios-list-box'} iconColor={'#66CCFF'}
                                              onPress={this._informationClick.bind(this)}/>
                                    <HomeIcon text="工具" iconName={'ios-build'} iconColor={'#FFAEB9'}
                                              onPress={this._toolsPress.bind(this)}/>
                                </View>
                              </View>}
                        renderFooter={this.renderFooter}
                        dataSource={this.state.informationSource.cloneWithRows(this.state.dataCache)}
                        renderRow={this.renderInfo.bind(this)}
                        onEndReached={this._onEndReached.bind(this)}
                        onEndReachedThreshold={100}
                        initialListSize={this.state.pageSize}
                        pageSize={this.state.pageSize}
                        enableEmptySections={true}
                        refreshControl={
                                  <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor="#ff0000"
                                    title="Loading..."
                                    titleColor="#00ff00"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#ffff00"
                                  />
                                }
                        />
                </View>
            )
        }

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    page: {
        width: deviceWidth,
        height: 150,
        resizeMode: 'stretch'
    },
    rows: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc'
    },
    rowIcon: {marginLeft: 10, justifyContent: 'center', alignSelf: 'center'},
    rowText: {flex: 1, marginLeft: 10, justifyContent: 'center', alignSelf: 'center'},
    rowRight: {justifyContent: 'center', alignSelf: 'center'},
});

module.exports = TopScreen;