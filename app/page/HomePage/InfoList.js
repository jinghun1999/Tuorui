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
    Alert,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    InteractionManager
    } from 'react-native';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
//import InfoSearch from './InfoSearch';
import InfoDetail from './InfoDetail';
import SearchBar from './../../commonview/SearchBar';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/Ionicons';
class Information extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            kw: '',
            pageIndex: 1,
            pageSize: 15,
            listInfoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
            totalPage: 0,
            infoSearchTextInput: '',
            isRefreshing: false,
            infoCache: [],
            loaded: false,
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this._loadData();
        });
    }

    componentWillUnmount() {

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
        storage.load({
            key: 'INFORMATION',
            autoSync: false,
            syncInBackground: false
        }).then(ret => {
            _this.setState({
                infoCache: ret.InfoList,
                loaded: true,
                isRefreshing: false,
            });
        }).catch(err => {
            //alert(err.message);
            _this._fetchData(_this.state.pageIndex, false);
        });
    }

    _onSearchPress() {
        this._fetchData(1, false);
    }

    _fetchData(pageIndex, isNext) {
        let _this = this;
        let fetchUri = CONSTAPI.APIAPP + '/AppInfo/GetInformationByName?infoName=' + _this.state.kw + '&pageIndex=' + pageIndex + '&pageSize=' + _this.state.pageSize;
        NetUtil.get(fetchUri, false, function (result) {
            if (result == null) {
                toastShort("获取数据失败");
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
                    totalPage: result.Data.TotalPage,
                    infoCache: _dataCache,
                    pageIndex: pageIndex,
                    loaded: true,
                });
                if (!isNext) {
                    storage.save({
                        key: 'INFORMATION',
                        rawData: {
                            InfoList: _data
                        }
                    });
                }
            } else {
                toastShort('数据获取失败' + result.Data)
            }
            _this.setState({isRefreshing: false,});
        });
    }

    _onEndReached() {
        if (this.state.pageIndex < this.state.totalPage) {
            this._fetchData(this.state.pageIndex + 1, true);
        }
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

    /*
     _onPressSearch() {
     let _this = this;
     const {navigator} = _this.props;
     if (navigator) {
     navigator.push({
     name: 'InfoSearch',
     component: InfoSearch,
     param: {}
     })
     }
     }
     */
    _onRefresh() {
        let _this = this;
        _this.setState({isRefreshing: true});
        _this._fetchData(1, false);
    }

    _renderInfo(info) {
        return (
            <TouchableOpacity style={styles.rows} onPress={()=>this._rowPress(info)}>
                <Text style={styles.rowTitle}>{info.InfoTitle}</Text>
                <Icon name={'ios-arrow-forward'} size={20} color={'#888'} style={styles.arrow}/>
            </TouchableOpacity>
        )
    }

    renderFooter() {
        if (this.state.pageIndex >= this.state.totalPage) {
            return (
                <View style={{height: 40, justifyContent:'center', alignItems:'center'}}>
                </View>
            )
        } else {
            return (
                <ActivityIndicator />
            )
        }
    }

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.loaded) {
            body = (
                <View style={{flex:1}}>
                    <ListView dataSource={this.state.listInfoSource.cloneWithRows(this.state.infoCache)}
                              renderRow={this._renderInfo.bind(this)}
                              onEndReached={this._onEndReached.bind(this)}
                              initialListSize={15}
                              pageSize={10}
                              enableEmptySections={true}
                              renderFooter={this.renderFooter.bind(this)}
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
            );
        }
        return (
            <View style={styles.container}>
                <SearchBar placeholder="请输入关键字"
                           onChangeText={(text)=>{this.setState({kw: text})}}
                           keyboardType={'default'}
                           onBack={this._onBack.bind(this)}
                           onPress={this._onSearchPress.bind(this)}
                    />
                {body}
            </View>
        );
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