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
    Alert,
    ListView,
    TouchableOpacity,
    ToastAndroid,
    Picker,
    InteractionManager,
    ActivityIndicator,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import BeautyInfo from './BeautyInfo';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
import Icon from 'react-native-vector-icons/FontAwesome';
import AppStyle from '../../theme/appstyle';
import DatePicker from 'react-native-datepicker';
class BeautyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            pageSize: 15,
            pageIndex: 1,
            dataSource: [],
            recordCount: 0,
            searchID: 0,
            value: '',
            dateFrom: Util.GetDateStr(0),
            dateTo: Util.GetDateStr(0),
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
                "items": [
                    {
                        "Childrens": null,
                        "Field": "1",
                        "Title": null,
                        "Operator": {
                            "Name": "=",
                            "Title": "等于",
                            "Expression": null
                        },
                        "DataType": 0,
                        "Value": "1",
                        "Conn": 0
                    },
                    {
                        "Childrens": null,
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Operator": {
                            "Name": ">=",
                            "Title": "大于等于",
                            "Expression": null
                        },
                        "DataType": 0,
                        "Value": _this.state.dateFrom + " 00:00:00",
                        "Conn": 1
                    },
                    {
                        "Childrens": null,
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Operator": {
                            "Name": "<=",
                            "Title": "小于等于",
                            "Expression": null
                        },
                        "DataType": 0,
                        "Value": _this.state.dateTo + " 23:59:59",
                        "Conn": 1
                    }
                ],
                "sorts": [
                    {
                        "Field": "ModifiedOn",
                        "Title": null,
                        "Sort": {
                            "Name": "Desc",
                            "Title": "降序"
                        },
                        "Conn": 0
                    }
                ],
                index: page,
                pageSize: _this.state.pageSize
            };

            let gestData={
                "Childrens": [
                    {
                        "Childrens": null,
                        "Field": "GestCode",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 0
                    },
                    {
                        "Childrens": null,
                        "Field": "GestName",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    },
                    {
                        "Childrens": null,
                        "Field": "MobilePhone",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    }
                ],
                "Field": null,
                "Title": null,
                "Operator": null,
                "DataType": 0,
                "Value": null,
                "Conn": 1
            };
            let paidData={
                "Childrens": null,
                "Field": "PaidStatus",
                "Title": null,
                "Operator": {
                    "Name": "=",
                    "Title": "等于",
                    "Expression": null
                },
                "DataType": 0,
                "Value": _this.state.paidStatus,
                "Conn": 1
            };
            if(_this.state.value!=null&& _this.state.value!=''){
                postdata.items.push(gestData);
            }
            if(_this.state.paidStatus!=null&& _this.state.paidStatus!=''){
                postdata.items.push(paidData);
            }
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
                    toastShort("获取数据失败：" + data.Message);
                    _this.setState({
                        loaded: true,
                    });
                }
            });
            let guestFilter = {
                "Childrens": [
                    {
                        "Childrens": null,
                        "Field": "GestCode",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 0
                    },
                    {
                        "Childrens": null,
                        "Field": "GestName",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    },
                    {
                        "Childrens": null,
                        "Field": "MobilePhone",
                        "Title": null,
                        "Operator": {
                            "Name": "like",
                            "Title": "相似",
                            "Expression": " @File like '%' + @Value + '%' "
                        },
                        "DataType": 0,
                        "Value": _this.state.value,
                        "Conn": 2
                    }
                ],
                "Field": null,
                "Title": null,
                "Operator": null,
                "DataType": 0,
                "Value": null,
                "Conn": 1
            };
            let paidFilter ={
                "Childrens": null,
                "Field": "PaidStatus",
                "Title": null,
                "Operator": {
                    "Name": "=",
                    "Title": "等于",
                    "Expression": null
                },
                "DataType": 0,
                "Value": _this.state.paidStatus,
                "Conn": 1
            };
            postdata = [
                {
                    "Childrens": null,
                    "Field": "1",
                    "Title": null,
                    "Operator": {
                        "Name": "=",
                        "Title": "等于",
                        "Expression": null
                    },
                    "DataType": 0,
                    "Value": "1",
                    "Conn": 0
                },
                {
                    "Childrens": null,
                    "Field": "ModifiedOn",
                    "Title": null,
                    "Operator": {
                        "Name": ">=",
                        "Title": "大于等于",
                        "Expression": null
                    },
                    "DataType": 0,
                    "Value": _this.state.dateFrom + " 00:00:00",
                    "Conn": 1
                },
                {
                    "Childrens": null,
                    "Field": "ModifiedOn",
                    "Title": null,
                    "Operator": {
                        "Name": "<=",
                        "Title": "小于等于",
                        "Expression": null
                    },
                    "DataType": 0,
                    "Value": _this.state.dateTo + " 23:59:59",
                    "Conn": 1
                }
            ];
            if(_this.state.value!=null&& _this.state.value!=''){
                postdata.push(guestFilter);
            }
            if(_this.state.paidStatus!=null&& _this.state.paidStatus!=''){
                postdata.push(paidFilter);
            }
            if (!isNext) {
                NetUtil.postJson(CONSTAPI.HOST + '/Service/GetRecordCount', postdata, header, function (data) {
                    if (data.Sign && data.Message != null) {
                        _this.setState({
                            recordCount: data.Message,
                        });
                    } else {
                        toastShort("获取记录数失败：" + data.Message);
                    }
                });
            }
        }, function (err) {
            toastShort(err);
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
                    headTitle: '新增美容',
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
                    headTitle: '美容详情',
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
                </View>
            )
        }
        return (
            <ActivityIndicator />
        );
    }

    _onRenderRow(beauty) {
        //PaidStatus=SM00051
        return (
            <TouchableOpacity style={AppStyle.row} onPress={()=>this._onBeautyDetails(beauty)}>
                <View style={{flex:1, marginRight:10,}}>
                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={[AppStyle.titleText,{flex:1,}]}>会员: {beauty.GestName}</Text>
                        {beauty.PaidStatus === 'SM00051' ? <Text style={{color:'#FF8247'}}>已付款</Text> :
                            <Text style={{color:'#CDC9A5'}}>未付款</Text>}
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

    onSearch(value) {
        let _this = this;
        if (value == 1) {
            _this.setState({searchID:1});
        } else if (value == 2) {
            _this.setState({searchID:2});
        }
    }
    _search() {
        this.fetchData(1, false);
    }
    _searchName(txt){
        let _this =this;
        _this.state.value=txt;
        _this.fetchData(1, false);
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
                <View style={{flexDirection:'row',margin:5,padding:1,}}>
                    <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',}}
                                      onPress={this.onSearch.bind(this)}>
                        <Text style={{textAlign:'center',}}>付款状态</Text>
                        <Icon name={'caret-down'} size={20} color={'#ccc'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',}}
                                      onPress={this.onSearch.bind(this,1)}>
                        <Text style={{textAlign:'center',}}>时间选择</Text>
                        <Icon name={'caret-down'} size={20} color={'#ccc'}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',}}
                                      onPress={this.onSearch.bind(this,2)}>
                        <Text style={{textAlign:'center',}}>筛选条件</Text>
                        <Icon name={'filter'} size={20} color={'#ccc'}/>
                    </TouchableOpacity>
                </View>
                {this.state.searchID === 0 ? null : <View>
                    {
                        this.state.searchID === 1 ? <View style={AppStyle.searchBox}>
                            <Text>时间</Text>
                            <DatePicker
                                date={this.state.dateFrom}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="2015-01-01"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                style={{width:80}}
                                customStyles={{
                        dateInput: {
                          height:30,
                          borderWidth:StyleSheet.hairlineWidth,
                        },
                      }} onDateChange={(date) => {this.setState({dateFrom: date})}}/>
                            <Text>到</Text>
                            <DatePicker
                                date={this.state.dateTo}
                                mode="date"
                                placeholder="选择日期"
                                format="YYYY-MM-DD"
                                minDate="2010-01-01"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                style={{width:80}}
                                customStyles={{
                    dateInput: {
                      height:30,
                      borderWidth:StyleSheet.hairlineWidth,
                    },
                  }} onDateChange={(date) => {this.setState({dateTo: date})}}/>
                            <TouchableOpacity
                                underlayColor='#4169e1'
                                style={AppStyle.searchBtn}
                                onPress={this._search.bind(this)}>
                                <Text style={{color:'#fff'}}>查询</Text>
                            </TouchableOpacity>
                        </View>
                            :
                            <View style={AppStyle.searchRow}>
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    clearButtonMode="always"
                                    onChangeText={this._searchName.bind(this)}
                                    placeholder="输入会员名称..."
                                    value={this.state.value}
                                    style={AppStyle.searchTextInput}
                                />
                            </View>
                    }
                </View>
                }
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({})
module.exports = BeautyList;