/**
 * Created by tuorui on 2016/8/19.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    InteractionManager
    } from 'react-native';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import SearchInfo from './InfoSearch';
import InfoDetail from './InfoDetail';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 1,
            pageSize: 15,
            listInfoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            totalPage: 0,
            infoSearchTextInput: '',
            infoCache: [],
            infoLoaded: false,
        }
    }

    componentDidMount() {
        let _this = this;
        _this.timer = setTimeout(
            () => {
                _this._loadData();
            }, 100
        );
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    //返回方法
    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _loadData() {
        /*从缓存中读取*/
        var _this = this;
        InteractionManager.runAfterInteractions(() => {
            storage.load({
                key: 'InfoList',
                autoSync: false,
                syncInBackground: false
            }).then(ret => {
                _this.setState({
                    infoCache: ret.InfoList,
                    infoLoaded: true,
                    isRefreshing: false,
                });
            }).catch(err => {
                //alert("暂无缓存数据");
                _this._fetchData(_this.state.pageIndex, false);
            });
        });
    }

    _fetchData(pageIndex, isNext) {
        let _this = this;
        let fetchUri = CONSTAPI.APIAPP + '/AppInfo/GetInformationByName?infoName=&pageIndex=' + pageIndex + '&pageSize=' + _this.state.pageSize;
        NetUtil.get(fetchUri, false, function(result) {
            if(result==null){
                alert("null");
                return false;
            }
            let _dataCache = _this.state.infoCache;
            let _data = result.Data.rows;
            if (isNext) {
                _data.forEach((d)=> {
                    _dataCache.push(d);
                });
            } else {
                _dataCache = _data;
            }
            if (result.Status) {
                _this.setState({
                    totalPage: result.TotalPage,
                    infoCache: _dataCache,
                    pageIndex: pageIndex,
                    infoLoaded: true,
                    isRefreshing: false,
                });
                if (!isNext) {
                    storage.save({
                        key: 'InfoList',
                        rawData: {
                            InfoList: _data
                        },
                        expires: 1000 * 3600 * 24
                    });
                }
            }
        });
    }

    _onEndReached() {
        this._fetchData(this.state.pageIndex + 1, true);
    }

    _rowPress(info) {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: 'InfoDetail',
                component: InfoDetail,
                params: {
                    requestId: info.RequestID,
                    title: info.InfoTitle,
                }
            })
        }
    }

    _onPressSearch() {
        let _this = this;
        const {navigator} = _this.props;
        if (navigator) {
            navigator.push({
                name: 'SearchInfo',
                component: SearchInfo,
                param: {}
            })
        }
    }

    renderFooter() {
        return (
            <View style={{height: 120}}>
                <ActivityIndicator />
            </View>
        );
    }

    _onRefresh() {
        let _this = this;
        _this.setState({isRefreshing: true});
        setTimeout(() => {
            _this._fetchData(1, false);
            _this.setState({
                isRefreshing: false,
            });
        }, 500);
    }

    _renderInfo(info) {
        return (
            <TouchableOpacity style={styles.rows} onPress={()=>this._rowPress(info)}>
                {/*<Ionicons name={'local-post-office'} size={20} color={'#ADD8E6'} style={styles.icon}/>*/}
                <Text style={styles.rowTitle}>{info.InfoTitle}</Text>
                <Ionicons name={'ios-arrow-forward'} size={20} color={'#888'} style={styles.arrow}/>
            </TouchableOpacity>
        )
    }

    _renderLoadingView() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle}/>
                <View style={{flexDirection:'column', justifyContent: 'center',alignItems: 'center',}}>
                    <Text>数据加载中...</Text>
                    {/*<Bars size={10} color="#1CAFF6"/>*/}
                </View>
            </View>
        );
    }

    render() {
        if (!this.state.infoLoaded) {
            return this._renderLoadingView();
        } else {
            return (
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <TouchableOpacity style={styles.touchStyle}
                                      onPress={this._onPressSearch.bind(this)}>
                        <View style={styles.iconStyle}>
                            <Ionicons name={'ios-search'} size={20} color={'#666'}/>
                        </View>
                        <Text style={{flex:1,}}/>
                        <View style={styles.textStyle}>
                            <Text>搜索</Text>
                        </View>
                    </TouchableOpacity>
                    <ListView dataSource={this.state.listInfoSource.cloneWithRows(this.state.infoCache)}
                              renderRow={this._renderInfo.bind(this)}
                              onEndReached={this._onEndReached.bind(this)}
                              initialListSize={15}
                              pageSize={10}
                              enableEmptySections={true}
                              renderFooter={this.renderFooter}
                              refreshControl={
                                  <RefreshControl
                                    refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                    tintColor="#ff0000"
                                    title="Loading..."
                                    titleColor="#00ff00"
                                    colors={['#ff0000', '#00ff00', '#0000ff']}
                                    progressBackgroundColor="#fff"
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
    listViewStyle: {
        flexDirection: 'row',
    },
    touchStyle: {

        margin: 5,
        flexDirection: 'row',
        height: 30,
        borderColor: '#666',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
    },
    iconStyle: {
        height: 30,
        width: 25,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    textStyle: {
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 5,
    },
    icon: {
        marginLeft: 10,
        justifyContent: 'center',
        alignSelf: 'center'
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
    rowTitle: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    arrow: {
        width: 15,
        justifyContent: 'center',
        alignSelf: 'center'
    }
});

module.exports = Information;