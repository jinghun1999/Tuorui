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
    Alert,
    ListView,
    ActivityIndicator,
    RefreshControl,
    ToastAndroid
    } from 'react-native';
import NetUtil from './app/util/NetUtil';
//import Head from './app/commonview/Head';
import NetWorkTool from './app/util/NetWorkTool'
import InfoClass from './app/page/HomePage/InfoClass';
import InfoDetail from './app/page/HomePage/InfoDetail';
import InfoList from './app/page/HomePage/InfoList';
import ToolsHome from './app/page/tools/ToolsHome';
import Loading from './app/commonview/Loading';
import HomeIcon from './app/commonview/HomeIcon';

import ViewPager from 'react-native-viewpager';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import Icon from 'react-native-vector-icons/MaterialIcons';
//import CacheableImage from 'react-native-cacheable-image'
var deviceWidth = Dimensions.get('window').width;

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connect: false,
            imageSource: [],
            dsImage: new ViewPager.DataSource({pageHasChanged: (p1, p2)=>p1 !== p2}),
            informationSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            loaded: false,
            focusLoaded: false,
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
            this.setState({connect: isConnected});
        });
        this.networkChanged = this.networkChanged.bind(this);
    }

    networkChanged(isConnected) {
        //console.log('test', (isConnected ? 'online' : 'offline'));
        if (!isConnected) {
            Alert.alert('提醒', '无法连接到互联网', [{
                text: '知道了', onPress: () => {
                }
            },]);
            this.setState({
                connect: false,
            });
        } else {
            this.setState({
                connect: true,
            })
        }
    }

    componentDidMount() {
        NetWorkTool.addEventListener(NetWorkTool.TAG_NETWORK_CHANGE, this.networkChanged);
        this._loadData();
    }

    componentWillUnmount() {
        NetWorkTool.removeEventListener(NetWorkTool.TAG_NETWORK_CHANGE, this.networkChanged);
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
                loaded: true,
                isRefreshing: false,
            });
        }).catch(err => {
            _this._fetchData(1);
        });
        /*加载焦点图*/
        storage.load({
            key: 'IndexFocus',
            autoSync: false,
            syncInBackground: false
        }).then(ret => {
            _this.setState({
                imageSource: ret.IndexFocus,
                focusLoaded: true,
            });
        }).catch(err => {
            _this._loadAD();
        });
    }

    _loadAD() {
        let _this = this;
        if (_this.state.connect) {
            NetUtil.get(CONSTAPI.APIAPP + '/AppInfo/GetHomePageImageInfo', null, function (data) {
                if (data.Status) {
                    if (data.Data.length > 0) {
                        let imgs = [];
                        data.Data.forEach(function (obj, index, v) {
                            imgs.push({uri: obj.AddressUrl});
                        });
                        storage.save({
                            key: 'IndexFocus',
                            rawData: {
                                IndexFocus: imgs,
                            }
                        });
                        _this.setState({
                            imageSource: imgs,
                            focusLoaded: true,
                        });
                        //alert(JSON.stringify(imgs))
                    } else {
                        //alert('没有图片');
                    }
                } else {
                    alert("获取数据失败：" + data.message);
                }
            });
        }
    }

    _fetchData(page) {
        let _this = this;
        if (_this.state.connect) {
            NetUtil.get(CONSTAPI.APIAPP + '/AppInfo/GetHomeInfo?pid=&PageSize=' + this.state.pageSize + '&PageIndex=' + page, false, function (result) {
                if (result.Status && result.Data) {
                    let _dataCache = _this.state.dataCache;
                    if (page > 1) {
                        result.Data.rows.forEach((d)=> {
                            _dataCache.push(d);
                        });
                    } else {
                        _dataCache = result.Data.rows;
                        storage.save({
                            key: 'IndexInfoList',
                            rawData: {
                                IndexInfoList: _dataCache
                            }
                        });
                    }
                    _this.setState({
                        total: result.Data.total,
                        totalPage: result.Data.TotalPage,
                        loaded: true,
                        pageIndex: page,
                        isRefreshing: false,
                        dataCache: _dataCache,
                    });
                }
                else {
                    alert("get data error")
                }
            });
        }
    }

    _onEndReached() {
        this._fetchData(this.state.pageIndex + 1);
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        this._fetchData(1);
        this._loadAD();
    }

    _infoClick(Info) {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                id: 'page',
                name: 'InfoDetail',
                component: InfoDetail,
                params: {
                    requestId: Info.RequestID,
                    title: Info.InfoTitle,
                }
            })
        }
    }

    _onPress(com, name, title, pid) {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: name,
                component: com,
                params: {
                    headTitle: title,
                    parentId: pid
                }
            });
        }
    }

    renderPage(data) {
        return (<Image source={{uri: data.uri}} style={styles.page}/>);
        /*return (
         {<CacheableImage
         resizeMode="cover"
         style={styles.page}
         source={{uri: data.AddressUrl}}
         />
         );}*/
    }

    renderInfo(Info) {
        return (
            <TouchableOpacity style={styles.rows} onPress={()=>this._infoClick(Info)}>
                <Icon name={'local-post-office'} size={20} color={'#ADD8E6'} style={styles.rowIcon}/>
                {/*<Image resource={Info.ImagePath}/>*/}
                <Text style={styles.rowText}>{Info.InfoTitle}</Text>
                <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.rowRight}/>
            </TouchableOpacity>
        )
    }

    renderLoadingView() {
        return (
            <Loading type='text'/>
        );
    }

    renderHeader() {
        return (
            <View>
                {this.state.focusLoaded ?
                    <ViewPager style={{height:150}}
                               dataSource={this.state.dsImage.cloneWithPages(this.state.imageSource)}
                               renderPage={this.renderPage}
                               isLoop={true}
                               autoPlay={true}/>
                    : null}
                <View style={{flexDirection:'row'}}>
                    <HomeIcon text="药品" iconName={'ios-git-network'} iconColor={'#33CC99'}
                              onPress={this._onPress.bind(this, InfoClass, 'InfoClass', '药品手册', '5738f12b-3fb7-4fbd-9975-3475251f62d6')}/>
                    <HomeIcon text="检验" iconName={'ios-water'} iconColor={'#6699CC'}
                              onPress={this._onPress.bind(this, InfoClass, 'InfoClass', '检验手册', '2efb2463-029c-4960-9964-7a3670a6fe7f')}/>
                    <HomeIcon text="诊断" iconName={'ios-medkit'} iconColor={'#9999CC'}
                              onPress={this._onPress.bind(this, InfoClass, 'InfoClass', '诊断手册', 'a2f0ae74-9085-466f-a7b6-ac67fa316a8a')}/>
                </View>
                <View style={{flexDirection:'row'}}>
                    <HomeIcon text="文献" iconName={'ios-book'} iconColor={'#CDB7B5'}
                              onPress={this._onPress.bind(this, InfoClass, 'InfoClass', '医学文献', '23e4546c-ccd8-456b-a91c-ad125d9d67a0')}/>
                    <HomeIcon text="资讯" iconName={'ios-list-box'} iconColor={'#66CCFF'}
                              onPress={this._onPress.bind(this, InfoList, 'InfoList', '行业资讯', null)}/>
                    <HomeIcon text="工具" iconName={'ios-build'} iconColor={'#FFAEB9'}
                              onPress={this._onPress.bind(this, ToolsHome, 'ToolsHome', '健康工具', null)}/>
                </View>
                <View style={{padding:5, borderLeftWidth:5, borderLeftColor:'#99CCFF', backgroundColor:'#eef4ff'}}>
                    <Text style={{fontWeight:'bold', color:'#3e82ff'}}>最新资讯</Text>
                </View>
            </View>
        );
    }

    renderFooter() {
        if (this.state.pageIndex >= this.state.totalPage) {
            return (
                <View style={{height: 40, justifyContent:'center', alignItems:'center'}}>
                    {/*<Text>没有更多数据了~</Text>*/}
                </View>
            );
        }
        return (
            <ActivityIndicator />
        );
    }

    render() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        } else {
            return (
                <View style={styles.container}>
                    <ListView
                        renderHeader={this.renderHeader.bind(this)}
                        renderFooter={this.renderFooter.bind(this)}
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

module.exports = HomePage;