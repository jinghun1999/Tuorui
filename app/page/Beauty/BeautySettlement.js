/**
 * Created by tuorui on 2016/9/27.
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
    Alert,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
}from 'react-native';
import Util from '../../util/Util';
import NetUtil from '../../util/NetUtil';
import Head from '../../commonview/Head';
import AppStyle from '../../theme/appstyle';
import Loading from '../../commonview/Loading';
import { toastShort } from '../../util/ToastUtil';
class BeautySettlement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: '结算',
            beauty: [],
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            totalAmount: 0,
            vaccineAmount: 0,
            vaccineDiscount:0,
        }
    }

    _onSaveInfo() {
        let _this =this;
        if (_this.state.vaccineDiscount == null) {
            toastShort("输入折扣");
            return false;
        }else if(_this.state.vaccineDiscount==0){
            toastShort("输入折扣");
            return false;
        }

        //http://test.tuoruimed.com/service/Api/Finance_SettleAccounts/GetFinaceInfo

        NetUtil.getAuth(function (user, hos) {
            let header = NetUtil.headerClientAuth(user, hos);
            var vaccItem=[];
            _this.props.beauty.forEach((item,index,array)=>{
                vaccItem.push(item.ID)
            })
            let getfinpost = {
                gestID: _this.props.member.ID,
                isCurrentOnly: true,
                dicEndItems: {"美容服务": vaccItem},
            };
            //获取疫苗销售信息http://test.tuoruimed.com/service/Api/Finance_SettleAccounts/GetFinaceInfo
            NetUtil.postJson(CONSTAPI.HOST + '/Finance_SettleAccounts/GetFinaceInfo', getfinpost, header, function (findata) {
                if (findata.Sign && findata.Message != null) {
                    let fsas = findata.Message.FSADetalList;
                    let fsasp = [];
                    fsas.forEach(function (v, i, a) {
                        vaccItem.forEach(function (vv, ii, aa) {
                            if (vv === v.RelationDetailID) {
                                fsasp.push(v);
                            }
                        });
                    });
                    let finishpost = {
                        "newSA": {
                            "ID": "00000000-0000-0000-0000-000000000000",
                            "SettleCode": null,
                            "GestID": findata.Message.CurrentGest.ID,
                            "GestCode": findata.Message.CurrentGest.GestCode,
                            "GestName": findata.Message.CurrentGest.GestName,
                            "PetCode": null,
                            "PetName": null,
                            "TotalMoney": _this.state.totalAmount,
                            "DisCountMoney": parseInt(_this.state.vaccineDiscount),
                            "ShouldPaidMoney": parseFloat(_this.state.vaccineAmount),
                            "FactPaidMoney": parseFloat(_this.state.vaccineAmount),
                            "BackMoney": null,
                            "BackReason": null,
                            "PaidStatus": null,
                            "PaidTime": null,
                            "CreatedBy": null,
                            "CreatedOn": null,
                            "ModifiedBy": null,
                            "ModifiedOn": null,
                            "ChangeMoney": 0.00,
                            "EntID": findata.Message.CurrentGest.EntID,
                            "HandDiscountMoney": 0.00,
                            "InputDiscountMoney": parseInt(_this.state.vaccineDiscount),
                            "OriginalDiscountMoney": 0.0,
                            "FactTotalMoney": _this.state.totalAmount,
                            "CreatedByID":"00000000-0000-0000-0000-000000000000",
                            "ModifiedByID":"00000000-0000-0000-0000-000000000000"
                        },
                        "fSADetailList": fsasp,
                        "gprList": [{
                            "ID": null,
                            "GestID": null,
                            "GestName": null,
                            "OperateAction": "现金",
                            "OperateContent": _this.state.vaccineAmount,
                            "SettleAccountsID": null,
                            "CreatedBy": null,
                            "CreatedOn": null,
                            "ModifiedBy": null,
                            "ModifiedOn": null,
                            "EntID": null
                        }, {
                            "ID": null,
                            "GestID": null,
                            "GestName": null,
                            "OperateAction": "折扣",
                            "OperateContent": _this.state.vaccineDiscount,
                            "SettleAccountsID": null,
                            "CreatedBy": null,
                            "CreatedOn": null,
                            "ModifiedBy": null,
                            "ModifiedOn": null,
                            "EntID": null
                        }]
                    };
                    //结算
                    NetUtil.postJson(CONSTAPI.HOST + '/Finance_SettleAccounts/Finish', finishpost, header, function (okdata) {
                        if (okdata.Sign && okdata.Message != null) {
                            toastShort("结算成功");
                            if (_this.props.getResult) {
                                _this.props.getResult();
                            }
                            _this._onBack();
                        } else {
                            toastShort("结算失败");
                        }
                    });
                }
                else {
                    toastShort("获取疫苗销售信息失败");
                }
            });
        })
    }

    _onBack() {
        let _this = this;
        const {navigator} =_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount() {
        let _this = this;
        let amount = 0;
        _this.props.beauty.forEach((item, index, array)=> {
            amount += item.SellPrice * item.InputCount
        })
        _this.setState({
            beauty: _this.props.beauty,
            totalAmount: amount,
        });

    }

    _renderRow(beauty) {
        return (
            <View style={AppStyle.row}>
                <Text style={AppStyle.mpName}>{beauty.ItemName}</Text>
                <Text style={AppStyle.mpTitle}>单价:¥ {beauty.SellPrice}</Text>
                <Text style={AppStyle.mpTitle}>数量: {beauty.InputCount}</Text>
            </View>
        )
    }

    render() {
        var listBody = <Loading type="text"/>;
        if (this.props.beauty.length > 0) {
            listBody = (
                <ListView enableEmptySections={true}
                          dataSource={this.state.ds.cloneWithRows(this.state.beauty)}
                          renderRow={this._renderRow.bind(this)}
                />
            )
        }
        return (
            <View style={AppStyle.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}
                      canAdd={true} edit={this.state.edit} editInfo={this._onSaveInfo.bind(this)}/>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>会员信息</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>会员编号</Text>
                    <Text style={AppStyle.rowVal}>{this.props.member.memberCode}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>会员姓名</Text>
                    <Text style={AppStyle.rowVal}>{this.props.member.memberName}</Text>
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>美容信息</Text>
                </View>
                <View>
                    {listBody}
                </View>
                <View style={AppStyle.groupTitle}>
                    <Text style={AppStyle.groupText}>结算信息</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>应收金额</Text>
                    <Text style={AppStyle.rowVal}>{this.state.totalAmount.toString()}</Text>
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>实收金额</Text>
                    <TextInput value={this.state.vaccineAmount.toString()}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'numeric'}
                               style={AppStyle.input}
                               onChangeText={(text)=>{
                                        this.setState({
                                            vaccineAmount:parseFloat(text)
                                        })
                                   }}
                    />
                </View>
                <View style={AppStyle.row}>
                    <Text style={AppStyle.rowTitle}>折扣</Text>
                    <TextInput value={this.state.vaccineDiscount.toString()}
                               editable={this.state.enable}
                               underlineColorAndroid={'transparent'}
                               keyboardType={'numeric'}
                               style={AppStyle.input}
                               onChangeText={(text)=>{
                                        this.setState({
                                            vaccineDiscount:text
                                        })
                                        var d = parseFloat(text);
                                if(!d || isNaN(d)){
                                    this.setState({
                                        vaccineAmount: 0,
                                    });
                                    return false;
                                }else{
                                    this.setState({
                                        vaccineAmount: (this.state.totalAmount-text).toFixed(1),
                                    });
                                }
                                   }}
                    />
                </View>

            </View>
        )
    }
}
module.exports = BeautySettlement;