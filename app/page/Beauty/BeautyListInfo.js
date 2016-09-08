/**
 * Created by tuorui on 2016/9/8.
 */
'use strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    ListView,
    TouchableOpacity,
    ToastAndroid,
    InteractionManager,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import BeautyServices from './BeautyServices';
import Loading from '../../commonview/Loading';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
class BeautyListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pageSize:15,
            pageIndex:1,
            dataSource: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        var _this = this;
        _this._onFetchData(1, false);
    }

    _onFetchData(page, isNext) {
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
                let postdata = {
                    "items": [{
                        "Childrens": null,
                        "Field": "IsDeleted",
                        "Title": null,
                        "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                        "DataType": 0,
                        "Value": "0",
                        "Conn": 0
                    }],
                    "sorts": [{
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Sort": {"Name": "Desc", "Title": "降序"},
                        "Conn": 0
                    }],
                    index: page,
                    pageSize: _this.state.pageSize
                };
                //let hospitalcode = 'aa15-740d-4e6d-a6ca-0ebf-81f1';
                let header = {
                    'Authorization': NetUtil.headerAuthorization(rets[0].user.Mobile, rets[0].pwd, rets[1].hospital.Registration, rets[0].user.Token)
                };
                NetUtil.postJson(CONSTAPI.HOST + '/Service/GetPageRecord', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        let dataSource = _this.state.dataSource;
                        if (isNext) {
                            data.Message.forEach((d)=> {
                                dataSource.push(d);
                            });
                        } else {
                            dataSource = data.Message;
                        }
                        _this.setState({
                            dataSource: dataSource,
                            loaded: true,
                            pageIndex: page,
                        });
                    } else {
                        alert("获取数据失败：" + data.Message);
                        _this.setState({
                            loaded: true,
                        });
                    }
                });
                /*get recordCount from the api */
                postdata = [{
                    "Childrens":null,
                    "Field":"IsDeleted",
                    "Title":null,
                    "Operator":{"Name":"=", "Title":"等于", "Expression":null},
                    "DataType":0,
                    "Value":"0",
                    "Conn":0
                }]
                if (!isNext) {
                    NetUtil.postJson(CONSTAPI.HOST + '/Service/GetRecordCount', postdata, header, function (data) {
                        if (data.Sign && data.Message != null) {
                            _this.setState({
                                recordCount: data.Message,
                            });
                        } else {
                            alert("获取记录数失败：" + data.Message);
                        }
                    });
                }
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
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onEditInfo() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'BeautyServices',
                component: BeautyServices,
                params: {
                    headTitle: '新增服务',
                }
            })
        }
    }

    _onBeautyDetails(beauty) {
        alert(beauty.GestName);
    }

    _onRenderRow(beauty) {
        return (
            <TouchableOpacity style={{
            flexDirection:'row',marginLeft:15, marginRight:15,paddingTop:10, paddingBottom:10,
            borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                              onPress={()=>this._onBeautyDetails(beauty)}>
                <View style={{flex:1,}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{beauty.GestName}</Text>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{flex: 1,}}>会员编号: {beauty.GestCode}</Text>
                        <Text style={{flex: 1,}}>宠物名: {beauty.PetName}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        var body = <Loading type="text"/>;
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                             enableEmptySections={true}
                             renderRow={this._onRenderRow.bind(this)}
            />
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={true} edit="新增" editInfo={this._onEditInfo.bind(this)}/>
                <View>
                    {body}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {flex: 1},
})
module.exports = BeautyListInfo;