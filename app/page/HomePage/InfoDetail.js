/**
 * Created by TOMCHOW on 2016/8/25.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    ListView,
    WebView,
    ScrollView,
    Image,
    Dimensions,
    TextInput,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';
import Head from './../../commonview/Head';
import Global from './../../util/Global';
import Util from './../../util/Util';
import NetUtil from './../../util/NetUtil';
import Loading from './../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';

import Icon from 'react-native-vector-icons/Ionicons';
var Width = Dimensions.get('window').width;
var Height = Dimensions.get('window').height;
class InfoDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: Global.WEB + '/App/New/NewDetail/' + this.props.requestId,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSource: [],
            loaded: false,
            phone: '',
            title: Util.cutString(this.props.title, 24, '...'),
            isCollect: false,
            readNum: 0,
            collectNum: 0,
            pageIndex: 1,
            pageSize: 10,
            text: null,
            webViewHeight: 500,
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
            autoSync: true,
            syncInBackground: false,
        }).then(ret => {
                //初始化
                let _paramData = '?id=' + this.props.requestId + '&operateby=' + ret.Mobile;
                NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/GetArticleOperateInfo" + _paramData, null, function (data) {
                    if (data.Status) {
                        let result = data.Data;
                        _this.setState({
                            isCollect: result.IsCollect,
                            collectNum: result.CollectNumber,
                            readNum: result.ReadNumber,
                            phone: ret.Mobile
                        });
                    } else {
                        toastShort(data.ErrorMessage);
                        _this.setState({
                            isCollect: false
                        });
                    }
                });

            }
        ).catch(err => {
                toastShort('error:' + err.message);
            }
        );
        _this.fetchComment(1, false);
    }

    fetchComment(page, isNext) {
        let _this = this;
        //api/AppInfo/GetCommentByInfoID?infoid=requestId&PageSize=15&PageIndex=1 CONSTAPI.APIAPP +
        NetUtil.getAuth(function (user, hos) {
            let api = CONSTAPI.APIAPP + "/AppInfo/GetCommentByInfoID?createdBy=" + user.Mobile + "&infoid=" + _this.props.requestId + "&pageIndex=" + page + "&pageSize=" + _this.state.pageSize;
            NetUtil.get(api, null, function (data) {
                if (data.Status && data.Data != null) {
                    let dataSource = _this.state.dataSource;
                    if (page > 1) {
                        data.Data.rows.forEach((d)=> {
                            dataSource.push(d);
                        });
                    } else {
                        dataSource = data.Data.rows;
                    }
                    _this.setState({
                        dataSource: dataSource,
                        pageIndex: page,
                        loaded: true,
                    })
                } else {
                    toastShort("获取数据失败：" + data.Exception);
                    _this.setState({
                        loaded: true,
                    });
                }
            })
        }, function (err) {
            toastShort(err);
        })
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onCollect() {
        let _this = this;
        let querystr = 'id=' + this.props.requestId + '&operateby=' + _this.state.phone;
        NetUtil.get(CONSTAPI.APIAPP + "/AppInfo/AddOrCountermandOperate?operatetype=1&" + querystr, null, function (data) {
            if (data.Status) {
                let result = data.Data;
                toastShort(result.Message);
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

    onError() {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text>加载内容失败</Text>
            </View>
        )
    }


    _renderHeader() {
        return (
            <View style={{height:this.state.webViewHeight}}>
                <WebView ref='webView'
                         source={{uri: this.state.url}}
                         startInLoadingState={true}
                         domStorageEnabled={true}
                         style={{flex:1}}
                         onError={this.onError.bind(this)}
                         onNavigationStateChange={(info)=>{
                         var height = info.url.split('#')[1];
                         if(height==null && height == undefined){return false;}
                         this.setState({webViewHeight:parseInt(height)+20})
                         }}
                         javaScriptEnabled={true}
                         decelerationRate="normal"/>
            </View>
        )
    }

    onSubmit() {
        //提交评论信息
        let _this = this;
        if (_this.state.text == '' || _this.state.text == null) {
            toastShort('评论为空 请输入评论信息')
            return false;
        }
        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            var data = {
                "InfoRequestID": _this.props.requestId,
                "Comment": _this.state.text,
                "UserId": user.FullName,
                "CreatedBy": user.Mobile,
                "ModifiedBy": user.Mobile
            };
            //api/AppInfo/AddComment CONSTAPI.APIAPP 'http://192.168.1.121:8090/api'
            NetUtil.postJson(CONSTAPI.APIAPP + '/AppInfo/AddComment', data, header, function (data) {
                if (data.Status) {
                    toastShort('评论成功');
                    _this.setState({text: null,})
                    _this.fetchComment(1, false);
                } else {
                    toastShort('评论失败 请重试');
                }
            })
        }, function (err) {
            toastShort(err)
        })
    }

    deleteComment(row) {
        let _this = this;
        Alert.alert(
            '删除提示',
            '您确定要删除此条评论吗？',
            [
                {text: '取消', onPress: () => console.log('Cancel Pressed!')},
                {
                    text: '确定', onPress: () => {
                    let api = '/AppInfo/DeleteComment?commentid=' + row.Id;
                    NetUtil.get(CONSTAPI.APIAPP + api, null, function (data) {
                        if (data.Status) {
                            toastShort('删除评论成功');
                            _this.fetchComment(1, false);
                        } else {
                            toastShort('删除评论失败 请重试');
                        }
                    }, function (err) {
                        toastShort(err)
                    })
                }
                }
            ])

    }

    _onRenderRow(row) {
        return (
            <View
                style={{flexDirection:'column',padding:5,borderBottomColor:'#ccc',borderBottomWidth:StyleSheet.hairlineWidth,}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={require('../../../image/Head_physician_128px.png')}
                           style={{width:30,height:30,borderRadius:50,}}/>
                    <Text style={{textAlign:'center',color:'#4B0082'}}>{row.UserId}</Text>
                </View>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <Text
                        style={{width:Width-100,flex:1,color:'#1A1A1A',marginLeft:30,textAlign:'left',fontWeight:'bold',fontSize:16,}}>{row.Comment}</Text>
                    {row.canDel == 1 ?
                        <TouchableOpacity onPress={()=>this.deleteComment(row)}>
                            <Text style={{textAlign:'center',margin:5,}}>删除</Text>
                        </TouchableOpacity> : null
                    }
                </View>
                    <Text style={{marginLeft:30,}}>{Util.getFormateTime(row.CreatedAt, 'min')}</Text>
            </View>
        )
    }

    _onEndReached() {
        this.fetchComment(this.state.pageIndex + 1, true);
    }

    render() {
        var listInfo = <Loading type={'text'}/>;
        if (this.state.loaded) {
            listInfo =
                <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                          renderHeader={this._renderHeader.bind(this)}
                          enableEmptySections={true}
                          initialListSize={this.state.pageIndex}
                          pageSize={this.state.pageSize}
                          renderRow={this._onRenderRow.bind(this)}
                          onEndReached={this._onEndReached.bind(this)}
                />
        }
        return (
            <View style={styles.container}>
                <Head title={this.state.title} canBack={true} onPress={this._onBack.bind(this)}/>
                {listInfo}
                <View style={styles.bottomContainer}>
                    <View style={{flexDirection: 'row'}}>
                        {/*<View style={styles.readInfo}>
                         <Icon name={'ios-eye'} size={20} color={'#999'} style={{marginRight: 5}}/>
                         <Text>{this.state.readNum}</Text>
                         </View>*/}
                        <View style={styles.readInfo}>
                            <Icon name={'ios-star'} size={20} color={'#ffad00'} style={{marginRight: 5}}/>
                            <Text>{this.state.collectNum}</Text>
                        </View>
                    </View>
                    <TextInput value={this.state.text}
                               editable={true}
                               placeholder='请输入评论..'
                               underlineColorAndroid={'transparent'}
                               keyboardType={'default'}
                               style={styles.input}
                               onChangeText={(text)=>{this.setState({ text:text })}}/>
                    <TouchableOpacity onPress={this.onSubmit.bind(this)}
                                      style={{height:35,width:60,borderRadius:10,backgroundColor:'#836FFF',justifyContent:'center',alignSelf:'center',}}>
                        <Text style={{textAlign:'center',color:'#fff'}}>提交</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewCount} onPress={this._onCollect.bind(this)}>
                        <Icon name={'ios-star'} size={30} color={this.state.isCollect ? '#ffad00' : '#fff'}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        flex: 1,
        backgroundColor: '#fff',
        //width: Width,
    },
    input: {
        flex: 1,
        height: 35,
        margin: 1,
        paddingLeft: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 10,
        borderColor: '#dcdcdc',
    },
    bottomContainer: {
        flexDirection: 'row',
        height: 40,
        backgroundColor: '#f8f8f8',
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
        backgroundColor: '#ececec',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
    }
})
module.exports = InfoDetail;