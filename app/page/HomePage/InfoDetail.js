/**
 * Created by TOMCHOW on 2016/8/25.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
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
import Loading from './../../commonview/Loading';
var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class InfoDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: Global.WEB + '/App/New/NewDetail/' + this.props.requestId,
            loaded: false,
            phone: '',
            title: Util.cutString(this.props.title, 24, '...'),
            isCollect: false,
            readNum: 0,
            collectNum: 0
        }
    }

    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData();
        });
    }

    fetchData() {
        let _this = this;
        storage.load({
            key: 'USER',
            autoSync: false,
            syncInBackground: false,
        }).then(ret => {
                //初始化
                let _paramData = 'id=' + this.props.requestId + '&operateby=' + ret.user.Mobile;
                NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/GetArticleOperateInfo?" + _paramData, null, function (data) {
                    if (data.Status) {
                        let result = data.Data;
                        _this.setState({
                            isCollect: result.IsCollect,
                            collectNum: result.CollectNumber,
                            readNum: result.ReadNumber,
                            phone: ret.user.Mobile
                        });
                    } else {
                        alert(data.ErrorMessage);
                        _this.setState({
                            isCollect: false
                        });
                    }
                });
            }
        ).catch(err => {
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

    _onCollect() {
        //alert('收藏' + this.props.requestId);
        let _this = this;
        let querystr = 'id=' + this.props.requestId + '&operateby=' + _this.state.phone;
        NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/AddOrCountermandOperate?operatetype=1&" + querystr, null, function (data) {
            if (data.Status) {
                let result = data.Data;
                ToastAndroid.show(result.Message, ToastAndroid.SHORT);
                _this.setState({
                    isCollect: result.IsCollect,
                    collectNum: result.IsCollect ? _this.state.collectNum + 1 : _this.state.collectNum - 1
                });
            }
        });

    }

    renderLoad() {
        return (
            <Loading type={'text'}/>
        )
    }
    onError(){
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>加载失败</Text>
            </View>
        )
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <Head title={this.state.title} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={{flex: 1}}>
                    <WebView ref='webView'
                             style={styles.webView}
                             source={{uri: this.state.url}}
                             startInLoadingState={true}
                             domStorageEnabled={true}
                             renderLoading={this.renderLoad.bind(this)}
                             onError={this.onError.bind(this)}
                             javaScriptEnabled={true}
                             decelerationRate="normal"/>
                    <View style={styles.bottomContainer}>
                        <View style={{flex: 1, flexDirection: 'row', backgroundColor: '#ccc'}}>
                            <View style={styles.readInfo}>
                                <Icon name={'ios-eye'} size={30} color={'#999'} style={{marginRight: 5}}/>
                                <Text>{this.state.readNum}</Text>
                            </View>
                            <View style={styles.readInfo}>
                                <Icon name={'ios-star'} size={30} color={'#999'} style={{marginRight: 5}}/>
                                <Text>{this.state.collectNum}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.viewCount} onPress={this._onCollect.bind(this)}>
                            <Icon name={'ios-star'} size={40} color={this.state.isCollect ? '#993399' : '#ccc'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    webView: {
        backgroundColor: '#fff',
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
module.exports = InfoDetail;