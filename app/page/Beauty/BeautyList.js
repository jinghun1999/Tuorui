/**
 * Created by tuorui on 2016/9/8.
 */
'use strict';
import React, { Component } from 'react';
import {
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
import BeautyInfo from './BeautyInfo';
import Loading from '../../commonview/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';

class BeautyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pageSize: 15,
            pageIndex: 1,
            dataSource: [],
            recordCount: 0,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchData(1, false);
        });
    }

    fetchData(page, isNext) {
        let _this = this;
        NetUtil.getAuth(function (user, hos) {
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
            let header = NetUtil.headerClientAuth(user, hos);
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
                    //alert("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });

            postdata = [{
                "Childrens": null,
                "Field": "IsDeleted",
                "Title": null,
                "Operator": {"Name": "=", "Title": "等于", "Expression": null},
                "DataType": 0,
                "Value": "0",
                "Conn": 0
            }]
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Service/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    } else {
                        //alert("获取记录数失败：" + data.Message);
                    }
                });
            }
        }, function (err) {
            alert(err);
        })
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onAdd() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'BeautyInfo',
                component: BeautyInfo,
                params: {
                    headTitle: '新增美容服务',
                    canEdit: true,
                    beautyID: 1,
                    getResult: function () {
                        _this.fetchData(1, false);
                    }
                }
            })
        }
    }

    _onBeautyDetails(beauty) {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.push({
                name: 'BeautyInfo',
                component: BeautyInfo,
                params: {
                    headTitle: '美容服务详情',
                    canEdit: false,
                    beautyID: 2,
                    beautyInfo: beauty,
                    getResult: function () {
                        _this.fetchData(1, false);
                    }
                }
            })
        }
    }

    _onEndReached() {
        this.fetchData(this.state.pageIndex + 1, true);
    }

    _renderFooter() {
        if (this.state.pageIndex >= this.state.recordCount / this.state.pageSize) {
            return (
                <View style={AppStyle.noMore}>
                    <Text>没有更多数据了~</Text>
                </View>
            )
        }
        return (
            <View style={{height: 120}}>
                <ActivityIndicator />
            </View>
        );
    }

    _onRenderRow(beauty) {
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onBeautyDetails(beauty)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={AppStyle.titleText}>会员: {beauty.GestName}</Text>
                        <Text style={{flex:1, textAlign:'right'}}>手机: {beauty.MobilePhone}</Text>
                    </View>
                    <View style={{flexDirection:'row',marginTop:3}}>
                        <Text style={{flex:1}}>宠物: {beauty.PetName}</Text>
                        <Text style={{flex:1, textAlign:'right'}}>{beauty.CreatedOn.replace('T', ' ')}</Text>
                    </View>
                </View>
                <Icon name={'angle-right'} size={20} color={'#ccc'}/>
            </TouchableOpacity>
        )
    }

    render() {
        var body = <Loading type="text"/>;
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.dataSource)}
                             enableEmptySections={true}
                             renderRow={this._onRenderRow.bind(this)}
                             onEndReached={this._onEndReached.bind(this)}
                             renderFooter={this._renderFooter.bind(this)}/>
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle}
                      canBack={true}
                      onPress={this._onBack.bind(this)}
                      canAdd={true}
                      edit="新增"
                      editInfo={this._onAdd.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = BeautyList;