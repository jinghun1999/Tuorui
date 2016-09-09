/**
 * Created by TOMCHOW on 2016/8/25.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ListView,
    View,
    ScrollView,
    Text,
    WebView,
    Dimensions,
    TouchableOpacity,
    InteractionManager,
    ToastAndroid,
    } from 'react-native';
import Head from './../../commonview/Head';
import Global from './../../util/Global';
import Util from './../../util/Util';
import Icon from 'react-native-vector-icons/Ionicons';
import NetUtil from './../../util/NetUtil';
var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class DrugDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: Global.WEB + '/App/New/NewDetail?RequestID=' + this.props.requestId,
            loaded: false,
            title: Util.cutString(this.props.title, 24, '...'),
            isCollect: false,
            viewNum:0,
            collectNum:0
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    fetchData() {
        let _this = this;
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
                //初始化是否已经收藏
                let _ishasOperatedata = 'id=' + this.props.requestId + '&type=1' + '&operateby=' + rets[0].user.FullName;
                NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/IsHasOperate?" + _ishasOperatedata, header, function (data) {
                    if (data.Status) {
                        _this.setState({
                            isCollect: data.Result
                        });
                    } else {
                        alert(data.ErrorMessage);
                        _this.setState({
                            isCollect: false
                        });
                    }
                });
                //初始化收藏数
                let _collectdata = 'type=1';
                NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/GetCountByOperateType?" + _collectdata, header, function (data) {
                    if (data.Status) {
                        _this.setState({
                            collectNum: data.Result
                        });
                    } else {
                        alert(data.ErrorMessage);
                    }
                });
                //初始化查看数
                let _viewdata = 'type=2';
                NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/GetCountByOperateType?" + _viewdata, header, function (data) {
                    if (data.Status) {
                        _this.setState({
                            viewNum: data.Result
                        });
                    } else {
                        alert(data.ErrorMessage);
                    }
                });
            }
        ).catch(err => {
                _this.setState({
                    dataSource: [],
                    loaded: true,
                });
                alert('error:' + err.message);
            }
        );
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _requestCollect(){
        let _this = this;
        storage.getBatchData([{
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }, {
            key: 'HOSPITAL',
            autoSync: false,
            syncInBackground: false,
        }]).then(rets => {
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };

                let querystr = 'id=' + this.props.requestId + '&operateby=' + rets[0].user.FullName;
                if (_this.state.isCollect) {     //收藏
                    NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/Collect?" + querystr, header, function (data) {
                        if (data.Status) {
                            _this.setState({
                                isCollect: data.Result
                            });
                            if (!data.Result) {
                                ToastAndroid.show("收藏失败", ToastAndroid.SHORT);
                            }
                            else {
                                ToastAndroid.show("收藏成功", ToastAndroid.SHORT);
                                _this.fetchData();

                            }

                        } else {
                            alert("收藏失败：" + data.message);
                            _this.setState({
                                isCollect: false
                            });
                        }
                    });
                }
                else {     //取消收藏
                    NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/CountermandCollect?" + querystr, header, function (data) {
                        if (data.Status) {
                            _this.setState({
                                isCollect: !data.Result
                            });
                            if (!data.Result) {
                                ToastAndroid.show("取消收藏失败", ToastAndroid.SHORT);
                            }
                            else {
                                ToastAndroid.show("取消收藏成功", ToastAndroid.SHORT);
                                _this.fetchData();
                            }

                        } else {
                            alert("取消收藏失败：" + data.message);
                            _this.setState({
                                isCollect: true
                            });
                        }
                    });
                }
            }
        ).catch(err => {
                _this.setState({
                    dataSource: [],
                    loaded: true,
                });
                alert('error:' + err.ErrorMessage);
            }
        );
    }

    _onCollect() {
        //alert('收藏' + this.props.requestId);
        let _iscollect = this.state.isCollect;
        this.setState({
            isCollect: !_iscollect,
        });
        this._requestCollect();
    }

    renderLoad() {
        return (
            <View>
                <View style={{flexDirection:'column', justifyContent: 'center',alignItems: 'center',}}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            </View>
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <Head title={this.state.title} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={{flex:1}}>
                    <WebView ref='webView'
                             style={styles.webView}
                             source={{uri: this.state.url}}
                             startInLoadingState={true}
                             domStorageEnabled={true}
                             renderLoading={this.renderLoad.bind(this)}
                             javaScriptEnabled={true}
                             decelerationRate="normal"
                             automaticallyAdjustContentInsets={false} />
                    <View style={styles.bottomContainer}>
                        <View style={{flex:1, flexDirection:'row', backgroundColor:'#ccc'}}>
                            <View style={styles.readInfo}>
                                <Icon name={'ios-eye'} size={30} color={'#999'} style={{marginRight:5}}/>
                                <Text>{this.state.viewNum}</Text>
                            </View>
                            <View style={styles.readInfo}>
                                <Icon name={'ios-star'} size={30} color={'#999'} style={{marginRight:5}}/>
                                <Text>{this.state.collectNum}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewCount} onPress={this._onCollect.bind(this)}>
                            <Icon name={'ios-star'} size={40} color={this.state.isCollect? '#993399': '#ccc'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    webView: {
        backgroundColor: 'red',
        flex: 1,
        width: Width,
    },
    bottomContainer: {
        flexDirection: 'row',
        height: 35,
        backgroundColor: '#ccc',
    },
    readInfo: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        justifyContent: 'center'
    },
    viewCount: {
        width: 80,
        backgroundColor: '#99CCFF',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    }
})
module.exports = DrugDetails;